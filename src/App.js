import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';
import Create from './Create';
import Login from './Login';
import AddPost from './AddPost';
import DisplayPost from './DisplayPost';
import AccountSettings from './AccountSettings';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      category: ""
    };
    this.updateCategory = this.updateCategory.bind(this);
  }

  updateCategory(category) {
    this.setState({
      category: category
    });
  }

  render() {

    return(
      <Router>
        <div className="App">
          
          <Navbar updateCategory={this.updateCategory} />

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

            <Route exact path="/account/settings">
              <AccountSettings />
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
