import React, { Component } from 'react';
import { putRequest as put } from '../utils/requests';
import { withRouter, Redirect } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class OwnerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            isAutheticated: false,
            roomID: ''
        }
    }

    joinRoom() {
        this.setState({ name: '' });
        this.setState({ password: '' });
        // modify url
        put('http://localhost:5000/api/room', { name: name, password: sha256(this.state.password).toString() })
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
                throw new Error('Wrong credentials!');
            })
            .then((room) => {
                this.setState({ roomID: room.roomID });
                this.setState({ isAutheticated: true });
                //this.props.history.push('/room/' + room.roomID);
            })
            .catch((error) => {
                NotificationManager.error('There is no room with that name!', 'Error', 5000);
            });
    }

    updateName(e) {
        this.setState({ name: e.target.value });
    }

    updatePassword(e) {
        this.setState({ password: e.target.value });
    }

    render() {
        if (this.state.isAutheticated) {
            return <Redirect to={{
                pathname: '/room/' + this.state.roomID,
                state: { isOwner: true }
            }} />;
        }

        return (
            <div className="OwnerForm">
                <h2>Join room as owner</h2>
                <label>Name</label>
                <input value={this.state.name} onChange={this.updateName.bind(this)} />
                <label>Password</label>
                <input value={this.state.password} onChange={this.updatePassword.bind(this)} />
                <button onClick={this.createRoom.bind(this)}>Create</button>
                <NotificationContainer />
            </div>
        );
    }
}

export default withRouter(OwnerForm);