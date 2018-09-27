import React, { Component } from 'react';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }




    render() {
        return (
            <div className="Question">
                <h2>{this.props.question.text}</h2>
                <ul>
                    {this.props.question.answers.map((ans, i) => <li key={i}>ans</li>)}
                </ul>
            </div>
        );
    }
}

export default Question;