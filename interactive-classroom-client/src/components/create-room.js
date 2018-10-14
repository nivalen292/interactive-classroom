import React, { Component } from 'react';
import { postRequest as post } from '../utils/requests';
import sha256 from 'crypto-js/sha256';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

// ui
import { TextField, Grid, Button } from '@material-ui/core';

// config
import config from '../utils/client-constants';

class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: ''
        }
    }

    createRoom() {
        if (this.state.password.trim() === '' || this.state.name.trim() === '') {
            NotificationManager.error('You must enter a name and password first!', 'Error!', 3000);
            return;
        }
        post(`${config.endpoint}/api/room`, {
            name: this.state.name,
            password: sha256(this.state.password).toString()
        })
            .then((response) => {
                if (response.status === 409) {
                    NotificationManager.error('A room with that name already exists', 'Error!', 3000);
                }
                else if (response.status === 201) {
                    NotificationManager.success('Room created, you can now log in as owner to modify it!', 'Success', 5000);
                }
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

        return (
            <div className="CreateRoom">
                <h2>Create room</h2>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField label="Name" value={this.state.name} style={{marginRight: "10px"}} onChange={this.updateName.bind(this)} />
                        <TextField type="password" label="Password" value={this.state.password} onChange={this.updatePassword.bind(this)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" style={{marginTop: "10px"}} onClick={this.createRoom.bind(this)}>Create</Button>
                    </Grid>
                </Grid>
                <NotificationContainer/>
            </div>
        );
    }
}

export default CreateRoom;