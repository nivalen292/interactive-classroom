import React, { Component } from 'react';
import { postRequest as post } from '../utils/requets';

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
        fetch('/api/rooms/' + roomID)
            .then((room) => console.log(room));
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
