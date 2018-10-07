import React, { Component } from 'react';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

// ui
import { TextField, Grid, Button, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

class CreateQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            answerInput: '',
            textInput: ''
        };
    }

    updateAnswerInput(e) {
        this.setState({ answerInput: e.target.value });
    }

    updateTextInput(e) {
        this.setState({ textInput: e.target.value });
    }

    removeAnswer(index) {
        const newArr = this.state.answers.slice(0);
        newArr.splice(index, 1);
        this.setState({ answers: newArr });
    }

    addAnswer(a) {
        if (a.text.trim() === '') {
            NotificationManager.error('Please enter a value!', 'Error', 5000);
            return;
        }
        this.setState({ answers: [...this.state.answers, a] });
        this.setState({ answerInput: '' });
    }

    addQuestion() {
        if (this.state.textInput.trim() === '') {
            NotificationManager.error('Please fill in all values!', 'Error', 5000);
            return;
        }
        if (this.state.answers.length < 2) {
            NotificationManager.error('You must add atleast 2 answers!', 'Error', 5000);
            return;
        }
        const hasCorrectAnswer = this.state.answers.some((answer) => answer.correct)

        if (!hasCorrectAnswer) {
            NotificationManager.error('You must have atleast one correct answer!', 'Error', 5000);
            return;
        }
        this.props.addQuestion({ text: this.state.textInput, answers: this.state.answers });
    }


    render() {
        return (
            <div className="CreateQuestion">
                <h2>New Question: </h2>
                <h3>Text: {this.state.textInput}</h3>
                <TextField label="Text" value={this.state.textInput} onChange={this.updateTextInput.bind(this)} />
                <h3>Answers: </h3>
                {this.state.answers.map((a, index) => {
                    return (
                        <div key={index}>
                            <p>{a.text} : {a.correct ? 'Correct' : 'Wrong'}
                                <IconButton style={{marginLeft: '10px'}} aria-label="Delete" color="primary" onClick={() => this.removeAnswer(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </p>
                        </div>
                    );
                })}
                <h3>Add Answer: </h3>
                <TextField label="Answer Text" value={this.state.answerInput} onChange={this.updateAnswerInput.bind(this)} />
                <Grid container style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Grid><p>Correct?</p></Grid>
                    <Grid><input type="checkbox" ref="correctCheckBox" /></Grid>
                </Grid>
                <Button style={{ marginBottom: '10px' }} mini variant="fab" color="primary" aria-label="Add" onClick={() => this.addAnswer({ text: this.state.answerInput, correct: this.refs.correctCheckBox.checked, score: 0 })}><AddIcon /></Button>
                <br />
                <Button variant="contained" color="primary" onClick={this.addQuestion.bind(this)}>Save <SaveIcon /></Button>
                <NotificationContainer />
            </div >
        );
    }
}

export default CreateQuestion;