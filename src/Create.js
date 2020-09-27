import React from 'react';
import './Create.css';

import {withRouter} from "react-router-dom";

class Create extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      password2: "",
      error: ""
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onInputChange(e) {
    let id = e.target.id.split("#")[0];
    let value = e.target.value;
    if(id === "create_email") {
      this.setState({
        email: value
      });
    } else if(id === "create_password") {
      this.setState({
        password: value
      });
    }
  }

  // Handle Submit of Create form
  async handleSubmit(e) {

    if(this.state.password !== this.state.password2) {
      this.setState({
        error: "Passwords doesn't match"
      });
    } else {

      const url = 'http://localhost:8082/user/create';
      const data = {"email":this.state.email, "password":this.state.password};
  
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
                email: "",
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
        email: "",
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
            <i className="fa fa-user">U</i>
            <input type="email" id="create_email#1" placeholder="user@server.reg" onChange={this.onInputChange} />
          </div>
          <div className="input">
            <i className="fa fa-user">U</i>
            <input type="password" id="create_password#1" placeholder="user123" onChange={this.onInputChange} />
          </div>
          <p>Please, type your password again</p>
          <div className="input">
            <i className="fa fa-user">U</i>
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
