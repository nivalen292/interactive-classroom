import React, { Component } from 'react';
import { getRequest as get } from '../utils/requests';
import Question from '../components/question';
import CreateQuestion from './create-question';
import socketIOClient from 'socket.io-client';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            questions: [],
            currectQuestion: {text: '', answers: []}
        }
    }

    componentDidMount() {
        get('http://localhost:5000/api/room/' + this.props.match.params.roomID)
            .then((room) => {
                this.setState({questions: room.questions});
                this.setState({currectQuestion: this.state.questions[0]});
                this.setState({name: room.name});
            }).catch((error) => {
                NotificationManager.error('No room with ID: ' + this.props.match.params.roomID + ' exists!', 'Okay!', 3000);
            });
    }

    isAuthenticated() {
        try {
            return this.props.location.state.isOwner;
        }
        catch(e) {
            return false;
        }
    }

    showGuestContent() {
        return (<Question question={this.state.currectQuestion}/>);
    }

    showOwnerContent() {
        return (
            <div>
                <h2>Questions</h2>
                {this.state.questions.map((q, index) => <p key={index}>{q.text}</p>)}
                <button>Create New Question</button>
                -------
                <CreateQuestion />
            </div>
        );
    }

    showContent() {
        if (this.isAuthenticated()) {
            return this.showOwnerContent();
        }
        return this.showGuestContent();
    }

    addQuestion() {

    }


    render() {
        return (
            <div className="Room">
                <h1>Room: {this.state.name}</h1>
                {this.showContent()}
                <NotificationContainer/>
            </div>
        );
    }
}

export default Room;