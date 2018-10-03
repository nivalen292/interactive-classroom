import React, { Component } from 'react';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

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
        if (a.trim() === '') {
            NotificationManager.error('Please enter a value!', 'Error', 5000);
        }
        this.setState({ answers: [...this.state.answers, a] });
        this.setState({ answerInput: '' });
    }


    render() {
        return (
            <div className="CreateQuestion">
                <h2>New Question: </h2>
                <h3>Text: {this.state.textInput}</h3>
                <input value={this.state.textInput} onChange={this.updateTextInput.bind(this)} />
                <h3>Answers: </h3>
                {this.state.answers.map((a, index) => {
                    return (
                        <div key={index}>
                            <p>{a}</p>
                            <button onClick={() => this.removeAnswer(index)}>Remove Answer</button>
                        </div>
                    );
                })}
                <h3>Add Answer: </h3>
                <input value={this.state.answerInput} onChange={this.updateAnswerInput.bind(this)} />
                <button onClick={() => this.addAnswer(this.state.answerInput)}>Add Answer</button>
                <NotificationContainer />
            </div>
        );
    }
}

export default CreateQuestion;