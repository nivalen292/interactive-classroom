import React, { Component } from 'react';
import { getRequest as get } from '../utils/requests';
import Question from '../components/question';
import socketIOClient from 'socket.io-client';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            questions: [],
            currectQuestion: {text: "text", answers: ["ans1", "ans2"]}
        }
    }

    componentDidMount() {
        get('http://localhost:5000/api/room/' + this.props.match.params.roomID)
            .then((room) => {
                this.setState({questions: room.questions});
                this.setState({currectQuestion: this.state.questions[0]});
                this.setState({name: room.name});
            });
    }


    render() {
        return (
            <div className="Room">
                <h1>Room {this.state.name}</h1>
                <Question question={this.state.currectQuestion}/>
            </div>
        );
    }
}

export default Room;