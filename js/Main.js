import React from 'react';
import ReactDOM from 'react-dom';
import TweetList from './TweetList';
import LeftRail from './LeftRail';

const API_GET_TWEETS = '/api/tweets';

var lastCursor = '';
var tweets = [];
var filteredTweets = null;
var loading = false;
var searchingUserName = '';

function ajax(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState < 4 || xhr.status !== 200) {
            return new Error();
        }
        if (xhr.readyState == 4) {
            callback(xhr.response);
        }
    }
    xhr.open('GET', url, true);
    xhr.send('');
}

function getTweets(count = 50, cursor, user) {
    let options = {count: count};
    if (typeof cursor !== 'undefined') {
        options.cursor = cursor;
    }
    if (typeof user !== 'undefined') {
        options.user = user;
    }
    let params = Object.keys(options).map((key) => `${key}=${encodeURIComponent(options[key])}`).join('&');
    let url = `${API_GET_TWEETS}?${params}`
    return new Promise((resolve, reject) => {
        ajax(url, (response) => {
            resolve(JSON.parse(response))
        });
    });
}

async function loadMore() {
    let res = await getTweets(undefined, lastCursor);
    lastCursor = res.cursor;
    tweets.push(...res.tweets);
    let groupByUser = tweets.reduce((dict, tweet) => {
        let key = tweet.user.id;
        if (!dict.has(key)) {
            dict.set(key, []);
        }
        dict.get(key).push(tweet);
        return dict;
    }, new Map());
    let withOldest = Array.from(groupByUser.values()).map((arr) => {
        return {
            arr: arr,
            oldest: arr.reduce((a, b) => Math.min(a, b.timestamp), 1.0 / 0.0)
        }
    });
    // Sort by descending order of oldest tweet of user
    withOldest.sort((a, b) => b.oldest - a.oldest);
    tweets = withOldest.reduce((a, b) => {
        b.arr[b.arr.length-1].isBlogMention = true;
        a.push(...b.arr);
        return a;
    }, []);
    render();
}

async function loadUserTweets(user) {
    let res = await getTweets(undefined, undefined, user);
    filteredTweets = res.tweets;
    render();
}

function onTweetListScroll(e) {
    if (loading) {
        return;
    }
    if (window.scrollY > window.scrollMaxY - 200) {
        loading = true;
        window.requestAnimationFrame(async () => {
            await loadMore();
            loading = false;
        });
    }
}

function onSearch(name) {
    if (loading) {
        return;
    }
    if (name === '') {
        filteredTweets = null;
        render();
        return;
    }
    loading = true;
    window.requestAnimationFrame(() => {
        loadUserTweets(name);
        loading = false;
    });
}

function render() {
    ReactDOM.render(<LeftRail onSearch={onSearch} />, document.getElementById('leftrail'));
    let displayTweets = filteredTweets !== null ? filteredTweets : tweets;
    ReactDOM.render(<TweetList tweets={displayTweets} />, document.getElementById('content'));
}

window.addEventListener('DOMContentLoaded', async () => {
    loading = true;
    await loadMore();
    render();
    loading = false;
    window.addEventListener('scroll', onTweetListScroll);
});
