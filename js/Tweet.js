import React from 'react';

export default class Tweet extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <article className="tweet">
                <div className="tweet-header">
                    <div className="tweet-username">{this.props.tweet.user.name}</div>
                    <div className="tweet-screenname">@{this.props.tweet.user.screenName}</div>
                </div>
                <div className="tweet-body">{this.props.tweet.text}</div>
            </article>
        );
    }
}
