import React from 'react';
import './Login.css';

import {withRouter} from "react-router-dom";

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      error: ""
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onInputChange(e) {
    let id = e.target.id;
    let value = e.target.value;
    if(id === "login_username") {
      this.setState({
        username: value
      });
    } else if(id === "login_password") {
      this.setState({
        password: value
      });
    }
  }

  // Handle Submit of login form
  async handleSubmit(e) {
    const url = 'http://localhost:8082/user/login';
    const data = {"username":this.state.username, "password":this.state.password};

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if(response.status !== 200) {
            // not ok
            console.log('Error:', await response.json());
            this.setState({
              error: "error"
            });
        }
        else if (response.status === 200) {
            const json = await response.json();
            localStorage.setItem("jwt", json["token"]);
            this.setState({
              error: "",
              username: "",
              password: "",
              password2: ""
            });
            this.props.history.push("/");
        }
    } catch (error) {
        console.error('Error:', error);
        this.setState({
          error: "error"
        });
    }

    this.setState({
      username: "",
      password: ""
    });
}

  render() {
    return(
      <div className="Login">
        <div>
          <div className="title">
            Login
          </div>
          <div className="error">
            {this.state.error}
          </div>
          <div className="input">
            <i className="fa fa-user">U</i>
            <input type="text" id="login_username" placeholder="user" onChange={this.onInputChange} />
          </div>
          <div className="input">
            <i className="fa fa-user">U</i>
            <input type="password" id="login_password" placeholder="user123" onChange={this.onInputChange} />
          </div>
          <button className="login-button" onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
