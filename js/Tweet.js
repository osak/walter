import React from 'react';

export default class Tweet extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let tweetTime = new Date(this.props.tweet.timestamp * 1000).toLocaleString();
        let tweetUrl = `https://twitter.com/${this.props.tweet.user.screenName}/status/${this.props.tweet.idString}`;
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
                        <div className="tweet-logo"><img src="/twitter.png" width="32px" height="32px" /></div>
                        <div className="tweet-time"><a href={tweetUrl} target="_blank">{tweetTime}</a></div>
                        <div className="tweet-username">{this.props.tweet.user.name}</div>
                        <div className="tweet-screenname">@{this.props.tweet.user.screenName}</div>
                    </div>
                    <div className="tweet-body">{this.props.tweet.text}</div>
                </div>
            </article>
        );
    }
}
