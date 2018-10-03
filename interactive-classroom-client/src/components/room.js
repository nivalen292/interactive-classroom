import React, { Component } from 'react';
import { getRequest as get, postRequest as post, putRequest as put } from '../utils/requests';
import Question from '../components/question';
import CreateQuestion from './create-question';
import ModifyQuestion from './modify-question';
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
            currentQuestion: { text: '', answers: [] },
            roomID: '',
            showCreateQuestionForm: false,
            showModifyQuestionForm: false,
            questionToModify: null,
            questionIndexToModify: -1
        }
    }

    componentDidMount() {
        get('http://localhost:5000/api/room/' + this.props.match.params.roomID)
            .then((room) => {
                this.setState({ questions: room.questions });
                this.setState({ currentQuestion: this.state.questions[0] });
                this.setState({ name: room.name });
                this.setState({ roomID: room.roomID });
            }).catch((error) => {
                NotificationManager.error('No room with ID: ' + this.props.match.params.roomID + ' exists!', 'Okay!', 3000);
            });
    }

    isAuthenticated() {
        try {
            return this.props.location.state.isOwner;
        }
        catch (e) {
            return false;
        }
    }

    toggleCreateQuestionForm() {
        this.setState({ showCreateQuestionForm: !this.state.showCreateQuestionForm });
    }

    toggleModifyQuestionForm(question) {
        const result = this.state.questionToModify === null ? question : null;
        this.setState({ questionToModify: result });
        this.setState({ questionIndexToModify: result });
    }

    showCreateQuestionForm() {
        if (this.state.showCreateQuestionForm) {
            return (<CreateQuestion addQuestion={this.addQuestion.bind(this)} />);
        }
    }

    showModifyQuestionForm() {
        if (this.state.questionToModify !== null) {
            return (<ModifyQuestion question={this.state.questionToModify} modifyQuestion={this.modifyQuestion.bind(this)} />);
        }
    }

    showGuestContent() {
        return (<Question question={this.state.currentQuestion} />);
    }

    showOwnerContent() {
        return (
            <div>
                <h2>Questions</h2>
                {this.state.questions.map((q, index) => {
                    return (
                        <div key={index}>
                            <p>{q.text}</p>
                            <button>Display</button>
                            <button onClick={() => this.toggleModifyQuestionForm(this.state.questions[index])}>Modify</button>
                            <button>Remove</button>
                        </div>
                    );
                })}
                <button onClick={this.toggleCreateQuestionForm.bind(this)}>New Question Form</button>
                <br />
                {this.showCreateQuestionForm()}
                {this.showModifyQuestionForm()}
            </div>
        );
    }

    showContent() {
        if (this.isAuthenticated()) {
            return this.showOwnerContent();
        }
        return this.showGuestContent();
    }

    modifyQuestion(question) {
        // update db
        put('http://localhost:5000/api/room/' + this.state.roomID + '/questions', { roomID: this.state.roomID, question: question })
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success('Added Question!', 'Success!', 3000);
                }
            });
    }

    addQuestion(question) {
        // update db
        post('http://localhost:5000/api/room/' + this.state.roomID + '/questions', { question: question, roomID: this.state.roomID })
            .then((response) => {
                if (response.status === 201) {
                    NotificationManager.success('Added Question!', 'Success!', 3000);
                }
            });
        // hide question form
        this.setState({ showCreateQuestionForm: !this.state.showCreateQuestionForm });

        this.setState({ questions: [...this.state.questions, question] });
    }


    render() {
        return (
            <div className="Room">
                <h1>Room: {this.state.name}</h1>
                {this.showContent()}
                <NotificationContainer />
            </div>
        );
    }
}

export default Room;