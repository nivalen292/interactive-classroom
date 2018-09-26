import React, { Component } from 'react';
import RoomForm from '../components/room-form';

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
      </div>
    );
  }
}

export default Home;