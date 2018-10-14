import React, { Component } from 'react';
import { getRequest as get, postRequest as post, putRequest as put, deleteRequest as del } from '../utils/requests';
import Question from '../components/question';
import CreateQuestion from './create-question';
import ModifyQuestion from './modify-question';
import socketIOClient from 'socket.io-client';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import QuestionResults from './question-results';

// material-ui
import { Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

// config
import config from '../utils/client-constants';

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
            questionIndexToModify: -1,
            questionResults: null,
            questionIndexResults: -1,
            guests: 0,
            endpoint: config.endpoint
        }
    }

    componentDidMount() {
        const socket = socketIOClient(this.state.endpoint);

        socket.on('change-question', (index) => {
            // to remove any result content
            this.setState({ questionResults: null });
            this.setState({ questionIndexResults: -1 });

            this.setState({ currentQuestion: this.state.questions[index] });
        });

        socket.on('show-results', (data) => {
            this.setState({ questionIndexResults: data.questionIndex });
            this.setState({ questionResults: data.results });
        });

        socket.on('join', (data) => {
            this.setState({ guests: data.guests || 0 });
        });

        socket.on('leave', (data) => {
            this.setState({ guests: data.guests });
        });

        get(`${this.state.endpoint}/api/room/` + this.props.match.params.roomID)
            .then((room) => {
                this.setState({ questions: room.questions });
                this.setState({ currentQuestion: room.currentQuestion === null ? { text: '', answers: [] } : room.currentQuestion });
                this.setState({ name: room.name });
                this.setState({ roomID: room.roomID });
                socket.emit('join', { roomID: this.state.roomID, isGuest: !this.isAuthenticated() });
            }).catch((error) => {
                NotificationManager.error('No room with ID: ' + this.props.match.params.roomID + ' exists!', 'Okay!', 3000);
            });

        // before unmount
        window.addEventListener('beforeunload', () => {
            socket.emit('leave', { roomID: this.state.roomID, isGuest: !this.isAuthenticated() });
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

    toggleModifyQuestionForm(questionIndex) {
        const result = this.state.questionIndexToModify === -1 ? questionIndex : -1;
        this.setState({ questionIndexToModify: result });
    }

    showCreateQuestionForm() {
        if (this.state.showCreateQuestionForm) {
            return (<CreateQuestion addQuestion={this.addQuestion.bind(this)} />);
        }
    }

    showModifyQuestionForm() {
        const index = this.state.questionIndexToModify;
        if (index >= 0 && index < this.state.questions.length) {
            return (<ModifyQuestion questionIndex={index} question={this.state.questions[this.state.questionIndexToModify]} modifyQuestion={this.modifyQuestion.bind(this)} />);
        }
    }

    showResults(roomID, questionIndex) {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('show-results', { roomID: roomID, questionIndex: questionIndex });
    }

    showGuestContent() {
        return (this.state.questionResults === null ?
            <Question roomID={this.state.roomID} question={this.state.currentQuestion || { text: '', answers: [], score: 0 }} />
            : <QuestionResults results={this.state.questionResults} question={this.state.questions[this.state.questionIndexResults]} />);
    }

    showOwnerContent() {
        return (
            <div>
                <h2>Questions</h2>
                {this.state.questions.map((q, index) => {
                    return (
                        <div key={index}>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>{q.text}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Button variant="contained" color="primary" onClick={() => this.triggerUpdateCurrentQuestion(index)}>
                                        Display
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => this.toggleModifyQuestionForm(index)}>Modify</Button>
                                    <Button variant="contained" color="secondary" onClick={() => this.removeQuestion(index)}>
                                        Delete
                                    </Button>
                                    <Button style={{ backgroundColor: 'green' }} variant="contained" color="primary" onClick={() => this.showResults(this.state.roomID, index)}>Results</Button>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    );
                })}
                <Button style={{marginTop: '10px'}} variant="fab" color="primary" aria-label="Add" onClick={this.toggleCreateQuestionForm.bind(this)}><AddIcon /></Button>
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

    modifyQuestion(question, questionIndex) {
        // update db
        put(`${this.state.endpoint}/api/room/` + this.state.roomID + '/questions',
            { roomID: this.state.roomID, question: question, questionIndex: questionIndex })
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success('Modified Question!', 'Success!', 3000);
                }
            });
        // hide form
        this.setState({ questionIndexToModify: -1 });

        // not updating locally until a request is made
    }

    addQuestion(question) {
        // update db
        post(`${this.state.endpoint}/api/room/` + this.state.roomID + '/questions', { question: question, roomID: this.state.roomID })
            .then((response) => {
                if (response.status === 201) {
                    NotificationManager.success('Added Question!', 'Success!', 3000);
                }
            });
        // hide form
        this.setState({ showCreateQuestionForm: false });

        // updating local state
        this.setState({ questions: [...this.state.questions, question] });
    }

    removeQuestion(questionIndex) {
        // update db
        del(`${this.state.endpoint}/api/room/` + this.state.roomID + '/questions/' + questionIndex)
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success('Deleted Question!', 'Success!', 3000);
                }
            })

        // update local state
        const newArr = this.state.questions.slice(0);
        newArr.splice(questionIndex, 1);
        this.setState({ questions: newArr });
    }

    triggerUpdateCurrentQuestion(index) {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('change-question', { questionIndex: index, roomID: this.state.roomID });

        // update db too to keep changes
        put(`${this.state.endpoint}/api/room/` + this.state.roomID + '/current-question', {
            questionIndex: index,
            roomID: this.state.roomID
        });
    }


    render() {

        return (
            <div className="Room">
                <h1>Room: {this.state.name}</h1>
                <h3>Guests: {this.state.guests}</h3>
                {this.showContent()}
                <NotificationContainer />
            </div>
        );
    }
}

export default Room;