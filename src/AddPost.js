import React from 'react';
import './AddPost.css';
import {Redirect, withRouter} from "react-router-dom";

import DefaultResourseLinks from './DefaultRecourseLinks';

class AddPost extends React.Component {
  constructor() {
    super();

    if(localStorage.getItem("token") === null) {
      this.state = {
        redirect: <Redirect push to={"/"} />
      };
    } else {
      this.state = {
        defaultImg: DefaultResourseLinks.getDefaultPostImageLink(),
        categories: JSON.parse(localStorage.getItem("categories")),
        category: JSON.parse(localStorage.getItem("categories"))[0],
        user: "user",
        title: "Add an interesting title...",
        error: "",
        redirect: []
      };
    }

    this.onImageChange = this.onImageChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleMoveBack = this.handleMoveBack.bind(this);
  }

  async handleUpload() {
      
    const url = 'http://localhost:8082/api/post/add';
    const formData = new FormData();

    // Only if user gives image read it. Else the default will be used by the API
    if(document.getElementById("file_create_post_id").files[0] !== undefined) {
      var file = document.getElementById("file_create_post_id").files[0];
      var fileName = file.name;
      var extensions = ["png", "jpg", "jpeg"];
      var fileExtension = fileName.split(".").pop().toLowerCase();
      if(extensions.includes(fileExtension)) {
        formData.append("file", file, "image."+fileExtension);
      }
    }

    formData.append("category", this.state.category);
    formData.append("title", this.state.title);

    try {
      let bearer = 'Bearer ' + `${localStorage.getItem("token")}`;
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': bearer
          },
          body: formData
      });
      
      if(response.status !== 200) {
          this.setState({
            error: "Unable to upload post"
          });
      }
      else if (response.status === 200) {
        document.getElementById("file_create_post_id").value = null;
        this.setState({
          error: "",
          redirect: <Redirect push to={"/"} />
        });
      }
    } catch (error) {
      this.setState({
        error: "Unable to upload post"
      });console.log(error);
    } finally {
      this.setState({
        title: "",
      });
    }
  }

  onFieldChange(e) {
      let field = e.target.id.split("_")[2];
      let state = this.state;
      state[field] = e.target.value;
      this.setState(state);
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
            defaultImg: DefaultResourseLinks.getDefaultPostImageLink()
        });
    }
  }

  handleMoveBack() {
    this.props.history.goBack();
  }

  render() {

    let categories = [];
    this.state.categories.forEach((category, cIndex) => {
      categories.push(
        <option value={category} key={"category_key_"+cIndex}>{category}</option>
      );
    });

    return(
      <div className="AddPost">

        {this.state.redirect}

        <div className="error">{this.state.error}</div>
        
        <div className="post">
          <button className="go-back" onClick={this.handleMoveBack}>
            <i className="fa fa-arrow-left" />
          </button>
          
          <textarea id="new_post_title" className="title" defaultValue={this.state.title} onChange={this.onFieldChange} />

          <img src={this.state.defaultImg} />

          <select className="category" id="new_post_category" defaultValue={this.state.category} onChange={this.onFieldChange}>
              {categories}
          </select>

          <input id="file_create_post_id" className="file" type="file" name="file" onChange={this.onImageChange} />
        </div>

        <button className="upload-button" onClick={this.handleUpload}>Upload</button>

      </div>
    );
  }
}

export default withRouter(AddPost);
