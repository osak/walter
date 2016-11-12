import React from 'react';

export default class Tweet extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let tweetTime = new Date(this.props.tweet.timestamp * 1000).toLocaleString();
        let classes = ['tweet', 'panel'];
        if (this.props.tweet.isBlogMention) {
            classes.push('tweet--blog-mention');
        }
        return (
            <article className={classes.join(' ')}>
                <div className="tweet-header row">
                    <div className="tweet-username col-xs-2">{this.props.tweet.user.name}</div>
                    <div className="tweet-screenname col-xs-2">@{this.props.tweet.user.screenName}</div>
                    <div className="tweet-time col-xs-3 col-xs-offset-5">{tweetTime}</div>
                </div>
                <div className="tweet-body">{this.props.tweet.text}</div>
            </article>
        );
    }
}
