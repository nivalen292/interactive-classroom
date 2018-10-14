import React, { Component } from 'react';
import { putRequest as put } from '../utils/requests';
import { withRouter, Redirect } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

// ui
import { TextField, Grid, Button } from '@material-ui/core';

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
        if (this.state.password.trim() === '' || this.state.name.trim() === '') {
            NotificationManager.error('You must enter a name and password first!', 'Error!', 3000);
            return;
        }
        put('http://localhost:5000/api/room', { name: this.state.name, password: sha256(this.state.password).toString() })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error('Wrong credentials!');
            })
            .then((room) => {
                this.setState({ roomID: room.roomID });
                this.setState({ isAutheticated: true });
            })
            .catch((error) => {
                NotificationManager.error(error.message, 'Error', 5000);
            });
        this.setState({ name: '' });
        this.setState({ password: '' });
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
                <Grid container>
                    <Grid item xs={12}>
                        <TextField label="Name" value={this.state.name} onChange={this.updateName.bind(this)} style={{marginRight: "10px"}}/>
                        <TextField type="password" label="Password" value={this.state.password} onChange={this.updatePassword.bind(this)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" style={{marginTop: "10px"}} onClick={this.joinRoom.bind(this)}>Join</Button>
                    </Grid>
                    <NotificationContainer />
                </Grid>
            </div>
        );
    }
}

export default withRouter(OwnerForm);