import React, { Component } from 'react';
import { getRequest as get } from '../utils/requests';

class RoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }
    }

    joinRoom() {
        const roomID = this.state.inputValue;
        this.setState({ inputValue: '' });
        get('http://localhost:5000/api/room/' + roomID)
            .then((data) => console.log(data));
    }

    updateInputValue(e) {
        this.setState({ inputValue: e.target.value });
    }

    render() {

        return (
            <div className="RoomForm">
                <label>RoomID</label>
                <input value={this.state.inputValue} onChange={this.updateInputValue.bind(this)} />
                <button onClick={this.joinRoom.bind(this)}>Enter</button>
            </div>
        );
    }
}

export default RoomForm;
