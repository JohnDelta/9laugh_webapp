import React from 'react';
import './DisplayPost.css';
import {withRouter, Redirect} from "react-router-dom";

import DefaultResourceLinks from './DefaultRecourseLinks';

class DisplayPost extends React.Component {
  constructor() {
    super();

    if(localStorage.getItem("post") === null) {
      this.state = {
        post: {
            "postId": 0,
            "title": "",
            "mediaSource": DefaultResourceLinks.getDefaultPostImageLink,
            "upvotes": 0,
            "downvotes": 0,
            "user": "",
            "category": ""
        },
        comments: [],
        redirect: <Redirect push to={"/"} />,
        userComment: ""
      };
    } else {
      let post = JSON.parse(localStorage.getItem("post"));
      this.state = {
        post: post,
        comments: [],
        redirect: [],
        userComment: ""
      };
    }

    this.onUserCommentChange = this.onUserCommentChange.bind(this);
    this.getComments = this.getComments.bind(this);
    this.handleMoveBack = this.handleMoveBack.bind(this);
    this.mappedPost = this.mappedPost.bind(this);
    this.mappedComments = this.mappedComments.bind(this);
    this.handleCommentUpload = this.handleCommentUpload.bind(this);
    this.handleSendToLogin = this.handleSendToLogin.bind(this);
  }

  componentDidMount() {
    this.getComments();
  }

  async getComments() {
    const url = "http://localhost:8082/api/comment/get/all";
    try {
      const response = await fetch(url, {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify({"postId":this.state.post.postId})
      });
      
      if(response.status === 200) {
        response.json().then((res)=>{
          this.setState({
            comments: res
          });
        });
        console.log("Fetched comments");
      } else {
        console.error("service post/get unavailable or bad fetch");
      }

    } catch (error) {
      console.log("error fetching posts : "+error);
    }
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

  handleCommentUpload() {
    console.log("upload comment");
    console.log("send: " + this.state.userComment);
  }

  onUserCommentChange(e) {
    this.setState({
      userComment: e.target.value
    });
  }

  handleSendToLogin() {
    this.props.history.push("/login");
  }

  mappedPost() {

    let imagePath = "";
    if(this.state.post.mediaSource === "post_default.jpg") {
      imagePath = DefaultResourceLinks.getDefaultResourceLink() + "/" + this.state.post.mediaSource;
    } else {
      imagePath = DefaultResourceLinks.getUploadResourseLink() + "/" + this.state.post.mediaSource;
    }

    return (
        <div className="post">
            {this.state.redirect}

            <p className="title">
                <button onClick={this.handleMoveBack}>
                  <i className="fa fa-arrow-left" />
                </button>
                {this.state.post.title}
            </p>

            <img src={imagePath} />
            
            <div className="vote-div">
                <button id={"upvote_"+this.state.post.postId+"_"+this.state.post.user.username} onClick={this.handleVote}>
                <p className="votes">{this.state.post.upvotes}</p>
                <i className="fa fa-thumbs-up"></i>
                </button>

                <button id={"downvote_"+this.state.post.postId+"_"+this.state.post.user.username} onClick={this.handleVote}>
                <p className="votes">{this.state.post.downvotes}</p>
                <i className="fa fa-thumbs-down"></i>
                </button>
            </div>

            <p className="uploader">{this.state.post.user.username}</p>

            <p className="category">{this.state.post.category}</p>
        </div>
    );
  }

  mappedComments() {
    let comments = [];

    if(this.state.comments.length < 1) {
      comments.push(
        <div className="comment-div" key="mapped_comment_0">
          <div className="message">No comments yet</div>
        </div>
      );
    } else {
      this.state.comments.forEach((comment, cIndex) => {
        comments.push(
          <div className="comment-div" key={"mapped_comment_key_"+this.state.post.postId+"_"+cIndex}>
            <img src={require(`${comment.mediaSource}`)} />
            <div className="date">
              {comment.date}
            </div>
            <div className="username">
              {comment.username}
            </div>
            <div className="comment">
              {comment.comment}
            </div>
          </div>
        );   
      });
    }

    comments.push(<div className="title" key="mapped_comment_key_title_0">New comment</div>);
    if(localStorage.getItem("token") !== null) {
      comments.push(
        <div className="new-comment-div" key="mapped_comment_key_last_0">
          <textarea className="comment" placeholder="comment" onChange={this.onUserCommentChange} ></textarea>
          <button onClick={this.handleCommentUpload} >upload</button>
        </div>
      );
    } else {
      comments.push(
        <div className="new-comment-div" key="mapped_comment_key_last_0">
          <button onClick={this.handleSendToLogin}>Login required</button>
        </div>
      );
    }

    return( 
      <div className="comments-div">
        <div className="title">Comments</div>
        {comments}
      </div>);
  }

  render() {
    let post = this.mappedPost();
    let comments = this.mappedComments();

    return(
      <div className="DisplayPost">
        {post}
        {comments}
      </div>
    );
  }
}

export default withRouter(DisplayPost);
