import React, { Component } from 'react';

class QuestionResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="QuestionResults">
                <h2>{this.props.question.text}</h2>
                <ul>
                    {this.props.results.map((result, index) => {
                        if (this.props.question.answers[index].correct) {
                            return <li key={index} style={{color: 'green'}}>{this.props.question.answers[index].text} | {result} votes</li>
                        }
                        return <li key={index} style={{color: 'red'}}>{this.props.question.answers[index].text} | {result} votes</li>;
                    })}
                </ul>
            </div>
        );
    }
}

export default QuestionResults;