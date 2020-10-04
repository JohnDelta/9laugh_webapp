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
      defaultImg: require(`${"./default.png"}`)
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
          defaultImg: reader.result
        });
      }.bind(this);

    } else {
        URL.revokeObjectURL(this.state.defaultImg); // free memory from link
        this.setState({
            defaultImg: require(`${"./default.png"}`)
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
        error: "Passwords don't match"
      });
    } else {
      const url = 'http://localhost:8082/api/user/add';
      //const data = {"username":this.state.username, "password":this.state.password};
      const formData = new FormData();
      // let inputMIME = this.state.defaultImg.split(',')[0].split(':')[1].split(';')[0]; 
      // let fileExtension = this.state.defaultImg.split(";")[0].split("/")[1];
      // let fileToBinaryDecoded = unescape(this.state.defaultImg.split(",")[1]);
      // // Computation of new string in which hexadecimal 
      // // escape sequences are replaced by the character  
      // // it represents 

      // // Store the bytes of the string to a typed array 
      // let blobArray = []; 
      // for (let index = 0; index < fileToBinaryDecoded.length; index++) { 
      //     blobArray.push(fileToBinaryDecoded.charCodeAt(index)); 
      // } 

      // let blob = new Blob([blobArray], {type: inputMIME});

      var file = document.getElementById("create_image_id").files[0];
      var fileName = file.name;
      var extensions = ["png", "jpg", "jpeg"];
      var fileExtention = fileName.split(".").pop().toLowerCase();

      if(extensions.includes(fileExtention)) {
        formData.append("file", file, "image."+fileExtension);
        formData.append("username", this.state.username);
        formData.append("password", this.state.password);
        try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Authorization': null,
                  'Accept': 'application/json',
              },
              body: formData
          });
          
          if(response.status !== 200) {
              this.setState({
                error: "Unable to create user"
              });
          }
          else if (response.status === 200) {
              this.setState({
                error: "Account created"
              });
          }
        } catch (error) {
            console.error('Error:', error);
            this.setState({
              error: "Unable to create user"
            });
        } finally {
          this.setState({
            username: "",
            password: "",
            password2: ""
          });
        }
      } else {
        this.setState({
          error: "Wrong file format"
        });
      }
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
          <img id="create_img_id" src={this.state.defaultImg} />
          <input type="file" onChange={this.onImageChange} />
          <div className="error">
            {this.state.error}
          </div>
          <div className="input">
            <div className="icon">
              <i className="fa fa-user"></i>
            </div>
            <input type="text" id="create_username#1" value={this.state.username} placeholder="user" onChange={this.onInputChange} />
          </div>
          <div className="input">
            <div className="icon">
              <i className="fa fa-lock"></i>
            </div>
            <input type="password" id="create_password#1" value={this.state.password} placeholder="user123" onChange={this.onInputChange} />
          </div>
          <p>Please, type your password again</p>
          <div className="input">
            <div className="icon">
              <i className="fa fa-lock"></i>
            </div>
            <input type="password" id="create_password#2" value={this.state.password2} placeholder="user123" onChange={this.onInputChange} />
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
