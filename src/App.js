import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';
import Create from './Create';
import Login from './Login';
import AddPost from './AddPost';
import DisplayPost from './DisplayPost';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends React.Component {

  constructor() {
    super();

    if(localStorage.getItem("category") !== null) {
      this.state = {
        category: localStorage.getItem("category")
      };
    } else {
      this.state = {
        category: "funny"
      };
    }

  }

  componentDidUpdate() {
    if(localStorage.getItem("category") !== this.state.category) {
      this.state = {
        category: localStorage.getItem("category")
      };
    }
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

            <Route exact path="/add-post">
              <AddPost />
            </Route>

            <Route exact path="/display-post">
              <DisplayPost />
            </Route>

            <Route path="/">
              <Main category={this.state.category} />
            </Route>
          </Switch>

        </div>
      </Router>
    );
  }

}

export default App;
