import React from 'react';
import Tweet from './Tweet';

export default class TweetList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let tweets = this.props.tweets.map((tweet) => <Tweet tweet={tweet} />);
        return (
            <section id="tweet-list">
                {tweets}
            </section>
        );
    }
}
