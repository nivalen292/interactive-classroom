import React, { Component } from 'react';
import { putRequest as put } from '../utils/requests';
import { withRouter } from 'react-router-dom';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

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
            .then((room) => {
                this.props.history.push('/room/' + room.roomID);
            })
            .catch((error) => {
                NotificationManager.error('There is no room with that name!', 'Error', 5000);
            });
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

export default withRouter(RoomForm);
