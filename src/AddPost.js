import React from 'react';
import './AddPost.css';
import {Redirect, withRouter} from "react-router-dom";

class AddPost extends React.Component {
  constructor() {
    super();

    if(localStorage.getItem("token") !== null) { // CHANGE IT LATER
      this.state = {
        redirect: <Redirect push to={"/"} />
      };
    } else {
      this.state = {
        defaultImg: require(`${"./test_img.png"}`),
        category: "funny",
        user: "user",
        title: "photo title",
        redirect: []
      };
    }

    this.onImageChange = this.onImageChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleMoveBack = this.handleMoveBack.bind(this);
  }

  handleUpload() {
      console.log("upload");
      //upload post and gtfo
      //this.props.history.push("/");
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
            defaultImg: require(`${"./test_img.png"}`)
        });
    }
  }

  handleMoveBack() {
    this.props.history.goBack();
  }

  render() {
    return(
      <div className="AddPost">

        {this.state.redirect}
        
        <div className="post">
          <button className="go-back" onClick={this.handleMoveBack}>
            <i className="fa fa-arrow-left" />
          </button>
          
          <textarea id="new_post_title" className="title" defaultValue={this.state.title} onChange={this.onFieldChange} />

          <img src={this.state.defaultImg} />

          <select className="category" id="new_post_category" defaultValue={this.state.category} onChange={this.onFieldChange}>
              <option value="news">news</option>
              <option value="funny">funny</option>
              <option value="wtf">wtf</option>
              <option value="random">random</option>
          </select>

          <input className="file" type="file" name="file" onChange={this.onImageChange} />
        </div>

        <button className="upload-button" onClick={this.handleUpload}>Upload</button>

      </div>
    );
  }
}

export default withRouter(AddPost);
