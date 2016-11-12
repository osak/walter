import React from 'react';

export default class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onSearch(e.target.value);
        }
    }

    onChange(e) {
        this.setState({value: e.target.value});
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor="searchBox">Show only this user:</label>
                <input type="text" name="searchBox" className="form-control" value={this.state.value} onKeyPress={this.onKeyPress} onChange={this.onChange} />
            </div>
        );
    }
}
