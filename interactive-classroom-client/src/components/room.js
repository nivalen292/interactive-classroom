import React, { Component } from 'react';
import { getRequest as get } from '../utils/requests';
import Question from '../components/question';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            currectQuestion: {text: "text", answers: ["ans1", "ans2"]}
        }
    }

    componentDidMount() {
        get('http://localhost:5000/api/room/' + this.props.match.params.id)
            .then((room) => {
                this.setState({questions: room.questions});
                this.setState({currectQuestion: this.state.questions[0]});
            });
    }


    render() {
        console.log(this.state.questions)
        return (
            <div className="Room">
                <h1>Room {this.props.match.params.id}</h1>
                <Question question={this.state.currectQuestion}/>
            </div>
        );
    }
}

export default Room;