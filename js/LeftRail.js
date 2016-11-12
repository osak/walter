import React from 'react';
import SearchBox from './SearchBox';

export default class LeftRail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <SearchBox value={this.props.value} onSearch={this.props.onSearch} />
            </div>
        );
    }
}
