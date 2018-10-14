import React, { Component } from 'react';
import { putRequest as put } from '../utils/requests';

// material-ui
import { List, ListItem, ListItemText, Checkbox, AppBar, Typography, Toolbar } from '@material-ui/core';
import Button from '@material-ui/core/Button';

// react notifications
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';

// config
import config from '../utils/constants';

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
            // return this.props.question.answers
            //     .map((ans, i) => <li style={{ color: i === this.state.selectedAnswerIndex ? 'coral' : 'black' }} onClick={() => this.setState({ selectedAnswerIndex: i })} key={i}>{ans.text}</li>);
            return (<List>
                {this.props.question.answers.map((answer, i) => (
                    <ListItem key={i} role={undefined} dense button onClick={() => this.setState({ selectedAnswerIndex: i })}>
                        <Checkbox checked={this.state.selectedAnswerIndex === i} tabIndex={-1} disableRipple />
                        <ListItemText primary={answer.text} />
                    </ListItem>
                ))}
            </List>);
        }
        return 'No answers';
    }

    sendAnswer() {
        if (this.state.selectedAnswerIndex === -1) {
            NotificationManager.error('Select an answer first!', 'Error!', 3000);
            return;
        }
        put(`${config.endpoint}/api/room/` + this.props.roomID + '/current-question/' + this.state.selectedAnswerIndex)
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
                    {this.getQuestionAnswers()}
                    <Button variant="contained" color="primary" style={{ width: '100%' }} onClick={this.sendAnswer.bind(this)}>Submit</Button>
                </div>
            );
        }
        return <h2>Waiting for results</h2>;
    }


    render() {
        return (
            <div className="Question">
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            {this.getQuestionText()}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {this.showContent()}
            </div>
        );
    }
}

export default Question;