import React, { Component } from 'react';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class ModifyQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: this.props.question.answers,
            answerInput: '',
            textInput: this.props.question.text
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

    modifyQuestion() {
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
            <div className="ModifyQuestion">
                <h2>Question: </h2>
                <h3>Text: {this.state.textInput}</h3>
                <input value={this.state.textInput} onChange={this.updateTextInput.bind(this)} />
                <h3>Answers: </h3>
                {this.state.answers.map((a, index) => {
                    return (
                        <div key={index}>
                            <p>{a.text} : {a.correct ? 'Correct' : 'Wrong'}</p>
                            <button onClick={() => this.removeAnswer(index)}>Remove Answer</button>
                        </div>
                    );
                })}
                <h3>Add Answer: </h3>
                <input value={this.state.answerInput} onChange={this.updateAnswerInput.bind(this)} />
                <span>Correct?</span>
                <input type="checkbox" ref="correctCheckBox" />
                <button onClick={() => this.addAnswer({ text: this.state.answerInput, correct: this.refs.correctCheckBox.checked })}>Add Answer</button>
                <br />
                <button onClick={this.modifyQuestion.bind(this)}>Save</button>
                <NotificationContainer />
            </div>
        );
    }
}

export default ModifyQuestion;