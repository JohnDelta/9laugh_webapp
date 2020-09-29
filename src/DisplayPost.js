import React from 'react';
import './DisplayPost.css';
import {withRouter} from "react-router-dom";

class DisplayPost extends React.Component {
  constructor() {
    super();

    if(!this.props) {
        console.log("GTFO");
    }

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

  mappedPost() {
    return (
        <div className="post">
            <p className="title">
                {this.props.post.title}
            </p>

            <img src={require(`${this.props.post.mediaSource}`)} />
            
            <div className="vote-div">
                <button id={"upvote_"+this.props.post.postId+"_"+this.props.post.user} onClick={this.handleVote}>
                <p className="votes">{this.props.post.upvotes}</p>
                <i className="fa fa-thumbs-up"></i>
                </button>

                <button id={"downvote_"+this.props.post.postId+"_"+this.props.post.user} onClick={this.handleVote}>
                <p className="votes">{this.props.post.downvotes}</p>
                <i className="fa fa-thumbs-down"></i>
                </button>
            </div>

            <p className="uploader">{this.props.post.user}</p>

            <p className="category">{this.props.post.category}</p>
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
