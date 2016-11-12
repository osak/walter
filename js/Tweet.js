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
                <div className="tweet-profile-image">
                    <img src={this.props.tweet.user.profileImageUrl} />
                </div>
                <div className="tweet-main">
                    <div className="tweet-header">
                        <div className="tweet-time">{tweetTime}</div>
                        <div className="tweet-username">{this.props.tweet.user.name}</div>
                        <div className="tweet-screenname">@{this.props.tweet.user.screenName}</div>
                    </div>
                    <div className="tweet-body">{this.props.tweet.text}</div>
                </div>
            </article>
        );
    }
}
