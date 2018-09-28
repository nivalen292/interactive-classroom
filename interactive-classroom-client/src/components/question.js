import React, { Component } from 'react';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    getQuestionText() {
        if (this.props.question) {
            return this.props.question.text;
        }
        return 'No question';
    }

    getQuestionAnswers() {
        if (this.props.question) {
            return this.props.question.answers.map((ans, i) => <li key={i}>{ans}</li>);
        }
        return 'No answers';
    }


    render() {
        return (
            <div className="Question">
                <h2>{this.getQuestionText()}</h2>
                <ul>
                    {this.getQuestionAnswers()}
                </ul>
            </div>
        );
    }
}

export default Question;