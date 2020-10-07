import React from 'react';
import './AccountSettings.css';
import {withRouter, Redirect} from "react-router-dom";

import DefaultResourceLinks from './DefaultRecourseLinks';

class AccountSettings extends React.Component {
  constructor() {
    super();
    this.state = {
        username: "",
        mediaSource: "",
        newMediaSource: "",
        redirect: []
    };
    this.getUser = this.getUser.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMoveBack = this.handleMoveBack.bind(this);
  }

  componentDidMount() {
      if(localStorage.getItem("token") === null) {
        this.setState({
            redirect: <Redirect push to={"/"} />
        });
      } else {
          this.getUser();
      }
  }

  onImageChange(e) {
    if(e.target.files[0]) {

      var file = e.target.files[0];
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);

      reader.onloadend = function (e) {
        this.setState({
          newMediaSource: reader.result
        });
      }.bind(this);

    } else {
        URL.revokeObjectURL(this.state.newMediaSource); // free memory from link
        this.setState({
            newMediaSource: ""
        }, () => {
            this.getUser();
        });
    }
  }

  async getUser() {
    let url = "http://localhost:8082/api/user/get";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        
        if(response.status !== 200) {
            console.log("token validation failed");
        }
        else if (response.status === 200) {
            console.log("got user data");
            response.json().then((res)=>{
                this.setState({
                    username: res.username,
                    mediaSource: res.mediaSource
                });
            });
        }
    } catch (error) {
      console.log("token validation failed : " + error);
      //this.handleLogout();
    }
  }

  async handleSubmit(e) {
    const url = 'http://localhost:8082/api/user/update/image';
    const formData = new FormData();

    // Only if user gives image read it.
    if(document.getElementById("file_update_image_id").files[0] !== undefined) {
        var file = document.getElementById("file_update_image_id").files[0];
        var fileName = file.name;
        var extensions = ["png", "jpg", "jpeg"];
        var fileExtension = fileName.split(".").pop().toLowerCase();
        
        if(extensions.includes(fileExtension)) {
            formData.append("file", file, "image."+fileExtension);
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token"),
                        'Accept': 'application/json',
                    },
                    body: formData
                });
                
                if(response.status !== 200) {
                    this.setState({
                        error: "Unable to update account"
                    });
                }
                else if (response.status === 200) {
                    this.setState({
                        error: "Account updated"
                    }, () => {
                        this.getUser();
                    });
                }
            } catch (error) {
                this.setState({
                    error: "Unable to update user"
                });
            }
        } else {
            this.setState({
                error: "Unable to update user"
            });
        }
    } else {
        this.setState({
            error: "Unable to update user"
        });
    }
  }

  handleMoveBack() {
    this.props.history.goBack();
  }

  render() {

    let imagePath = "";
    if(this.state.newMediaSource === "" && this.state.mediaSource !== "") {
        if(this.state.mediaSource === "user_default.png") {
            imagePath = DefaultResourceLinks.getDefaultResourceLink() + "/" + this.state.mediaSource;
        } else {
            imagePath = DefaultResourceLinks.getUploadResourseLink() + "/" + this.state.mediaSource;
        }
    } else {
        imagePath = this.state.newMediaSource;
    }

    return(
      <div className="AccountSettings">
        {this.state.redirect}
        <div>
          <div className="title">
            <button onClick={this.handleMoveBack}>
              <i className="fa fa-arrow-left" />
            </button>
            Account
          </div>
          <img src={imagePath} />
          <input id="file_update_image_id" type="file" onChange={this.onImageChange} />
          <div className="error">
            {this.state.error}
          </div>
          <div className="input">
            <div className="icon">
              <i className="fa fa-user"></i>
            </div>
            <input type="text" value={this.state.username} readOnly={true} />
          </div>
          <button className="update-button" onClick={this.handleSubmit}>
            Update
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(AccountSettings);
