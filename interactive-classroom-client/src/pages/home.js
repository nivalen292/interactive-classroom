import React, { Component } from 'react';
import RoomForm from '../components/room-form';
import CreateRoom from '../components/create-room';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <div className="Home">
        <RoomForm />
        <br />
        <CreateRoom />
      </div>
    );
  }
}

export default Home;