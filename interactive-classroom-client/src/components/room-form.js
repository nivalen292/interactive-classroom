import React, { Component } from 'react';
import { putRequest as put } from '../utils/requests';
import { withRouter } from 'react-router-dom';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

// ui
import { TextField, Grid, Button } from '@material-ui/core';

// config
import config from '../utils/client-constants';

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
        put(`${config.endpoint}/api/room`, { name: name })
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
                <h2>Join as guest</h2>

                <Grid container>
                    <Grid item xs={12}>
                        <TextField label="Name" value={this.state.inputValue} onChange={this.updateInputValue.bind(this)} />
                    </Grid>
                    <Grid item xs={12}>
                       <Button variant="contained" color="primary" style={{marginTop: "10px"}} onClick={this.joinRoom.bind(this)}>Enter</Button>
                    </Grid>
                </Grid>
                <NotificationContainer />
            </div>
        );
    }
}

export default withRouter(RoomForm);
