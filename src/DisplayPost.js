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
            "mediaSource": "./default.png",
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
  }

  componentDidMount() {
    this.setState({
      comments: this.getComments()
    });
  }

  getComments() {
    return([{
      "commentId": 0,
      "username": "user",
      "comment": "hahahah wtf is this omg and i thought in the begining that someone was on the phone",
      "date": 234,
      "mediaSource": "./default.png"
    },
    {
      "commentId": 1,
      "username": "user2",
      "comment": "I don't like it",
      "date": 23432,
      "mediaSource": "./default.png"
    }]);
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

  mappedComments() {
    let comments = [];

    if(this.state.comments.length < 1) {
      comments.push(
        <div className="comment-div" key="mapped_comment_0">
          <div className="date" style={{"marginTop":"5px"}}>No comments yet</div>
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
    comments.push(
      <div className="new-comment-div" key="mapped_comment_key_last_0">
        <textarea className="comment" placeholder="comment" onChange={this.onUserCommentChange} ></textarea>
        <button onClick={this.handleCommentUpload} >upload</button>
      </div>
    );

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
