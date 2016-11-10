import React from 'react';
import ReactDOM from 'react-dom';
import TweetList from './TweetList';

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

function getTweets() {
    return new Promise((resolve, reject) => {
        ajax('/api/tweets?count=50', (response) => {
            resolve(JSON.parse(response))
        });
    });
}

async function render() {
    let res = await getTweets();
    console.log(res);
    ReactDOM.render(<TweetList tweets={res.tweets} />, document.getElementById('content'));
}

window.addEventListener('DOMContentLoaded', render);
