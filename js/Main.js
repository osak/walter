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
        window.requestAnimationFrame(() => {
            loadMore();
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
