import React from 'react';
import './DisplayPost.css';
import {withRouter, Redirect} from "react-router-dom";

class DisplayPost extends React.Component {
  constructor() {
    super();

    if(localStorage.getItem("post") === null) {
      this.state = {
        post: {
            "postId": 0,
            "title": "",
            "mediaSource": "./test_img.png",
            "upvotes": 0,
            "downvotes": 0,
            "user": "",
            "category": ""
        },
        redirect: <Redirect push to={"/"} />
      };
    } else {
      let post = JSON.parse(localStorage.getItem("post"));
      this.state = {
        post: post,
        redirect: []
      };
    }

    this.handleMoveBack = this.handleMoveBack.bind(this);
    this.mappedPost = this.mappedPost.bind(this);
  }

  handleVote(e) {
    let args = e.target.id.split("_");
    let operation = args[0];
    let postId = args[1];
    let user = args[2];

    if(operation === "upvote") {
      console.log("up");
    } else if(operation === "downvote") {
      console.log("down");
    }

    //check if you can upvote-dwonvote the postId - user record in db
  }

  handleMoveBack() {
    this.props.history.goBack();
  }

  mappedPost() {
    return (
        <div className="post">
            {this.state.redirect}

            <p className="title">
                <button onClick={this.handleMoveBack}>
                  <i className="fa fa-arrow-left" />
                </button>
                {this.state.post.title}
            </p>

            <img src={require(`${this.state.post.mediaSource}`)} />
            
            <div className="vote-div">
                <button id={"upvote_"+this.state.post.postId+"_"+this.state.post.user} onClick={this.handleVote}>
                <p className="votes">{this.state.post.upvotes}</p>
                <i className="fa fa-thumbs-up"></i>
                </button>

                <button id={"downvote_"+this.state.post.postId+"_"+this.state.post.user} onClick={this.handleVote}>
                <p className="votes">{this.state.post.downvotes}</p>
                <i className="fa fa-thumbs-down"></i>
                </button>
            </div>

            <p className="uploader">{this.state.post.user}</p>

            <p className="category">{this.state.post.category}</p>
        </div>
    );
  }

  render() {
    let post = this.mappedPost();
    return(
      <div className="DisplayPost">
        {post}
      </div>
    );
  }
}

export default withRouter(DisplayPost);
