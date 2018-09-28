import React, { Component } from 'react';
import { putRequest as put } from '../utils/requests';

class RoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }
    }

    joinRoom() {
        const name = this.state.inputValue;
        this.setState({ inputValue: '' });
        put('http://localhost:5000/api/room', { name: name })
            .then((response) => response.json())
            .then((data) => console.log(data));
    }

    updateInputValue(e) {
        this.setState({ inputValue: e.target.value });
    }

    render() {

        return (
            <div className="RoomForm">
                <label>Name</label>
                <input value={this.state.inputValue} onChange={this.updateInputValue.bind(this)} />
                <button onClick={this.joinRoom.bind(this)}>Enter</button>
            </div>
        );
    }
}

export default RoomForm;
