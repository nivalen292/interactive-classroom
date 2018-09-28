import React, { Component } from 'react';
import RoomForm from '../components/room-form';
import CreateRoom from '../components/create-room';
import OwnerForm from '../components/join-as-owner';

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
        <br />
        <OwnerForm />
      </div>
    );
  }
}

export default Home;