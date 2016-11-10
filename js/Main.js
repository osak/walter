import React from 'react';
import ReactDOM from 'react-dom';
import TweetList from './TweetList';

var lastCursor = '';
var tweets = [];
var loading = false;

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

function getTweets(cursor) {
    return new Promise((resolve, reject) => {
        ajax(`/api/tweets?count=50&cursor=${lastCursor}`, (response) => {
            resolve(JSON.parse(response))
        });
    });
}

async function loadMore() {
    let res = await getTweets(lastCursor);
    lastCursor = res.cursor;
    tweets.push(...res.tweets);
}

function onTweetListScroll(e) {
    if (loading) {
        return;
    }
    if (e.target.scrollTop > e.target.scrollTopMax - 100) {
        loading = true;
        window.requestAnimationFrame(() => {
            loadMore();
            render();
            loading = false;
        });
    }
}

function render() {
    ReactDOM.render(<TweetList tweets={tweets} onScroll={onTweetListScroll} />, document.getElementById('content'));
}

window.addEventListener('DOMContentLoaded', async () => {
    loading = true;
    await loadMore();
    render();
    loading = false;
});
