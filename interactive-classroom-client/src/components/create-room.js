import React, { Component } from 'react';
import { postRequest as post } from '../utils/requests';
import sha256 from 'crypto-js/sha256';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomID: '',
            password: ''
        }
    }

    createRoom() {
        if (this.state.password === '' || this.state.roomID === '') {
            NotificationManager.error('You must enter a RoomID and password first!', 'Okay!', 3000);
            return;
        }
        post('http://localhost:5000/api/room', {
            roomID: this.state.roomID,
            password: sha256(this.state.password).toString()
        })
            .then((response) => {
                console.log('here')
                if (response.status === 409) {
                    NotificationManager.error('A room with that ID already exists', 'Okay!', 3000);
                }
                else if (response.status === 201) {
                    NotificationManager.success('Room created, you can now log in as owner to modify it!', 'Success', 5000);
                }
            });
        this.setState({ roomID: '' });
        this.setState({ password: '' });
    }

    updateRoomID(e) {
        this.setState({ roomID: e.target.value });
    }

    updatePassword(e) {
        this.setState({ password: e.target.value });
    }

    render() {

        return (
            <div className="CreateRoom">
                <label>RoomID</label>
                <input value={this.state.roomID} onChange={this.updateRoomID.bind(this)} />
                <label>Password</label>
                <input value={this.state.password} onChange={this.updatePassword.bind(this)} />
                <button onClick={this.createRoom.bind(this)}>Create</button>
                <NotificationContainer/>
            </div>
        );
    }
}

export default CreateRoom;