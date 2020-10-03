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
      error: "",
      defaultImg: require(`${"./test_img.png"}`)
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMoveBack = this.handleMoveBack.bind(this);
  }

  onImageChange(e) {
    if(e.target.files[0]) {

      var file = e.target.files[0];
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);

      reader.onloadend = function (e) {
        this.setState({
          defaultImg: [reader.result]
        });
      }.bind(this);

    } else {
        URL.revokeObjectURL(this.state.defaultImg); // free memory from link
        this.setState({
            defaultImg: require(`${"./test_img.png"}`)
        });
    }
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
              //this.props.history.push("/login"); // account created
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

  handleMoveBack() {
    this.props.history.goBack();
  }

  render() {
    return(
      <div className="Create">
        <div>
          <div className="title">
            <button onClick={this.handleMoveBack}>
              <i className="fa fa-arrow-left" />
            </button>
            Create Account
          </div>
          <img src={this.state.defaultImg} />
          <input type="file" onChange={this.onImageChange} />
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
