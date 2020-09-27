import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';
import Create from './Create';
import Login from './Login';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends React.Component {

  constructor() {
    super();
  }

  render() {
    return(
      <Router>
        <div className="App">
          
          <Navbar />

          <Switch>
            <Route exact path="/create">
              <Create />
            </Route>

            <Route exact path="/login">
              <Login />
            </Route>

            <Route path="/">
              <Main />
            </Route>
          </Switch>

        </div>
      </Router>
    );
  }

}

export default App;
