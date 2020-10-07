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
    this.handleMoveBack = this.handleMoveBack.bind(this);
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
    const url = 'http://localhost:8082/api/authenticate';
    const data = {"username":this.state.username, "password":this.state.password};

    try {
        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if(response.status !== 200) {
            this.setState({
              error: "Wrong username or password"
            });
        }
        else if (response.status === 200) {
          response.json().then((res)=>{
            localStorage.setItem("token", res["token"]);  
            this.setState({
              error: "",
              username: "",
              password: ""
            });
            this.handleMoveBack();
          });
        }
    } catch (error) {
        this.setState({
          error: "Unable to login"
        });
    } finally {
      this.setState({
        username: "",
        password: ""
      });
    }
  }

  handleMoveBack() {
    this.props.history.goBack();
  }

  render() {
    return(
      <div className="Login">
        <div>
          <div className="title">
            <button onClick={this.handleMoveBack}>
              <i className="fa fa-arrow-left" />
            </button>
            Login
          </div>
          <div className="error">
            {this.state.error}
          </div>
          <div className="input">
            <div className="icon">
              <i className="fa fa-user"></i>
            </div>
            <input type="text" id="login_username" value={this.username} placeholder="user" onChange={this.onInputChange} />
          </div>
          <div className="input">
            <div className="icon">
              <i className="fa fa-lock"></i>
            </div>
            <input type="password" id="login_password" value={this.password} placeholder="user123" onChange={this.onInputChange} />
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
