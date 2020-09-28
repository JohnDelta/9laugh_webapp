import React from 'react';
import './AddPost.css';
import {withRouter} from "react-router-dom";

class AddPost extends React.Component {
  constructor() {
    super();
    this.state = {
        defaultImg: "./test_img.png",
        category: "funny",
        user: "user",
        title: "photo title"
    };
    this.onImageChange = this.onImageChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload() {
      //upload post and gtfo
      this.props.history.push("/");
  }

  onFieldChange(e) {
      let field = e.target.id.split("_")[2];
      let state = this.state;
      state[field] = e.target.value;
      this.setState(state);
  }

  onImageChange(e) {
    if(e.target.value) {

        // have to upload to blob the photo somehow

        this.setState({
            defaultImg: e.target.value
        });
    } else {
        this.setState({
            defaultImg: "./test_img.png"
        });
    }
  }

  render() {
    return(
      <div className="AddPost">
        
        <div className="post">
          <textarea id="new_post_title" className="title" defaultValue={this.state.title} onChange={this.onFieldChange} />

          <img src={require(`${this.state.defaultImg}`)} />

          <p className="uploader">{this.state.user}</p>

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
