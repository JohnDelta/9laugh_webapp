import React from 'react';
import './Create.css';

import {withRouter} from "react-router-dom";

class Create extends React.Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      password2: "",
      error: ""
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onInputChange(e) {
    let args = e.target.id.split("#");
    let id = args[0];
    let number = Number(args[1]);
    let value = e.target.value;
    if(id === "create_username") {
      this.setState({
        username: value
      });
    } else if(id === "create_password") {
      if(number === 1) {
        this.setState({
          password: value
        });
      } else if(number === 2) {
        this.setState({
          password2: value
        });
      }
    }
  }

  // Handle Submit of Create form
  async handleSubmit(e) {

    if(this.state.password !== this.state.password2) {
      this.setState({
        error: "Passwords doesn't match"
      });
    } else {

      const url = 'http://localhost:8082/api/user/add';
      const data = {"username":this.state.username, "password":this.state.password};
  
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Authorization': null,
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
              this.setState({
                error: "",
                username: "",
                password: "",
                password2: ""
              });
              this.props.history.push("/login");
          }
      } catch (error) {
          console.error('Error:', error);
          this.setState({
            error: "error"
          });
      }
  
      this.setState({
        username: "",
        password: "",
        password2: ""
      });

    }

}

  render() {
    return(
      <div className="Create">
        <div>
          <div className="title">
            Create Account
          </div>
          <div className="error">
            {this.state.error}
          </div>
          <div className="input">
            <div className="icon">
              <i className="fa fa-user"></i>
            </div>
            <input type="text" id="create_username#1" placeholder="user" onChange={this.onInputChange} />
          </div>
          <div className="input">
            <div className="icon">
              <i className="fa fa-lock"></i>
            </div>
            <input type="password" id="create_password#1" placeholder="user123" onChange={this.onInputChange} />
          </div>
          <p>Please, type your password again</p>
          <div className="input">
            <div className="icon">
              <i className="fa fa-lock"></i>
            </div>
            <input type="password" id="create_password#2" placeholder="user123" onChange={this.onInputChange} />
          </div>
          <button className="create-button" onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Create);
