import React, { Component } from 'react';
import './App.css';
import Home from './pages/home';
import { Switch, Route } from 'react-router-dom';
import Room from './components/room';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <main>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/room/:roomID' render={(props) => { // or just component
              return (<Room {...props} />);
            }} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
