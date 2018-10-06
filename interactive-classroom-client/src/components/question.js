import React, { Component } from 'react';
import { putRequest as put } from '../utils/requests';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAnswerIndex: -1,
            submitted: false
        }
    }

    getQuestionText() {
        if (this.props.question.text.trim().length > 0) {
            return this.props.question.text;
        }
        return 'No question';
    }

    getQuestionAnswers() {
        if (this.props.question.answers.length > 0) {
            return this.props.question.answers
                .map((ans, i) => <li onClick={() => this.setState({ selectedAnswerIndex: i })} key={i}>{ans.text}</li>);
        }
        return 'No answers';
    }

    sendAnswer() {
        if (this.state.selectedAnswerIndex === -1) {
            NotificationManager.error('Select an answer first!', 'Error!', 3000);
            return;
        }
        put('http://localhost:5000/api/room/' + this.props.roomID + '/current-question/' + this.state.selectedAnswerIndex)
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success('Submitted answer', 'Success!', 3000);
                    this.setState({ submitted: true });
                }
            })
            .catch((e) => {
                NotificationManager.error('Something went wrong!', 'Error!', 3000);
            });
    }

    showContent() {
        if (!this.state.submitted) {
            // voting content
            return (
                <div>
                    <ul>
                        {this.getQuestionAnswers()}
                    </ul>
                    <button onClick={this.sendAnswer.bind(this)}>Submit</button>
                </div>
            );
        }
        return <h2>Waiting for results</h2>;
    }


    render() {
        return (
            <div className="Question">
                <h2>{this.getQuestionText()}</h2>
                {this.showContent()}
            </div>
        );
    }
}

export default Question;