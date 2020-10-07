import React from 'react';
import './DisplayPost.css';
import {withRouter, Redirect} from "react-router-dom";

import DefaultResourceLinks from './DefaultRecourseLinks';

class DisplayPost extends React.Component {
  constructor() {
    super();

    if(localStorage.getItem("postId") === null) {
      this.state = {
        postId: -1,
        comments: [],
        post: {
          "postId":-1,
          "title":"",
          "category":"",
          "user": {
            "userId": "",
            "username":"",
            "mediaSource":""
          },
          "upvotes": 0,
          "downvotes": 0
        },
        redirect: <Redirect push to={"/"} />,
        userComment: ""
      };
    } else {
      this.state = {
        postId: localStorage.getItem("postId"),
        comments: [],
        post: {user:{}},
        redirect: [],
        userComment: ""
      };
    }

    this.onUserCommentChange = this.onUserCommentChange.bind(this);
    this.getComments = this.getComments.bind(this);
    this.getPost = this.getPost.bind(this);
    this.handleMoveBack = this.handleMoveBack.bind(this);
    this.mappedPost = this.mappedPost.bind(this);
    this.mappedComments = this.mappedComments.bind(this);
    this.handleCommentUpload = this.handleCommentUpload.bind(this);
    this.handleSendToLogin = this.handleSendToLogin.bind(this);
  }

  componentDidMount() {
    this.getPost();
    this.getComments();
  }

  async getPost() {
    const url = "http://localhost:8082/api/post/get";
    try {
      const response = await fetch(url, {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify({"postId":this.state.postId})
      });
      
      if(response.status === 200) {
        response.json().then((res)=>{
          this.setState({
            post: res
          });
        });
        console.log("Fetched post");
      } else {
        console.error("service post/get unavailable or bad fetch");
      }

    } catch (error) {
      console.log("error fetching posts : "+error);
    }
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
          body: JSON.stringify({"postId":this.state.postId})
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

  async handleVote(e) {
    if(localStorage.getItem("token") !== null) {
      let args = e.target.id.split("_");
      let operation = args[0];
      //let postId = args[1];
      //let user = args[2];

      let url = "http://localhost:8082/api/post";
      if(operation === "upvote") {
        url += "/upvote";
      } else {
        url += "/downvote";
      }

      let body = {"postId": localStorage.getItem("postId")};

      try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("token"),
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if(response.status === 200) {
          this.getPost();
        } else {
          console.error("service post/get unavailable or bad fetch");
        }

      } catch (error) {
        console.log("error fetching posts : "+error);
      }
    }
  }

  handleMoveBack() {
    this.props.history.goBack();
  }

  async handleCommentUpload() {
    if(localStorage.getItem("token") !== null && this.state.userComment !== "") {

      let url = "http://localhost:8082/api/comment/add";
      let body = {"postId":this.state.post.postId, "comment":this.state.userComment};

      try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("token"),
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if(response.status === 200) {
          this.getComments();
        } else {
          console.error("service post/get unavailable or bad fetch");
        }

      } catch (error) {
        console.log("error fetching posts : "+error);
      }
    }
    this.setState({
      userComment: ""
    });
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
                <button id={"upvote_"+this.state.post.postId+"_In"} onClick={this.handleVote}>
                  <p className="votes">{this.state.post.upvotes}</p>
                  <i className="fa fa-thumbs-up"></i>
                </button>

                <button id={"downvote_"+this.state.post.postId+"_In"} onClick={this.handleVote}>
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
        
        let imagePath = "";
        if(comment.user.mediaSource === "user_default.png") {
          imagePath = DefaultResourceLinks.getDefaultResourceLink() + "/" + comment.user.mediaSource;
        } else {
          imagePath = DefaultResourceLinks.getUploadResourseLink() + "/" + comment.user.mediaSource;
        }

        comments.push(
          <div className="comment-div" key={"mapped_comment_key_"+this.state.post.postId+"_"+cIndex}>
            <img src={imagePath} />
            <div className="date">
              {comment.date}
            </div>
            <div className="username">
              {comment.user.username}
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
          <textarea className="comment" value={this.state.userComment} placeholder="comment" onChange={this.onUserCommentChange} ></textarea>
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
