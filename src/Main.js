import React from 'react';
import './Main.css';

class Main extends React.Component {
  constructor() {
    super();
   
    this.state = {
      popularity: "popular",
      posts: [
        {
          "postId": 0,
          "title": "random title",
          "mediaSource": "./test_img.png",
          "upvotes": 12,
          "downvotes": 23,
          "user": "johndelta",
          "category": "funny"
        },
        {
          "postId": 2,
          "title": "other title",
          "mediaSource": "./test_img.png",
          "upvotes": 347,
          "downvotes": 233,
          "user": "johndelta",
          "category": "funny"
        },
      ]
    }

    this.mappedPosts = this.mappedPosts.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.changePopularity = this.changePopularity.bind(this);
  }

  /*
    make fake post data
    populate the main page with them
    leave functions for comment upvotedownvote out for now
  */

  changePopularity(e) {
    let popularity = e.target.id.split("_")[1];
    this.setState({
      popularity: popularity
    });
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

  mappedPosts() {
    let postsDiv = [];

    this.state.posts.forEach((post, pIndex) => {
      postsDiv.push(
        <div className="post" key={"post_ind_"+pIndex}>
          <p className="title">
            {post.title}
          </p>

          <img src={require(`${post.mediaSource}`)} />
          
          <div className="vote-div">
            <p className="votes">{post.upvotes}</p>
            <button id={"upvote_"+post.id+"_"+post.user} onClick={this.handleVote}>
              <i className="fa fa-up">UP</i>
            </button>

            <p className="votes">{post.downvotes}</p>
            <button id={"downvote_"+post.id+"_"+post.user} onClick={this.handleVote}>
              <i className="fa fa-up">DO</i>
            </button>
          </div>
          
          <button className="comments-button">
            <i className="fa fa-comments">CO</i>
          </button>

          <p className="uploader">{post.user}</p>

          <p className="category">{post.category}</p>
        </div>
      );
    });

    if(postsDiv.length === 0) {
      postsDiv = "No posts yet";
    }

    return postsDiv;
  }

  render() {

    let posts = this.mappedPosts();

    return(
      <div className="Main">
        
        <div className="popularity-div">
          <button id="popularity_popular" onClick={this.changePopularity}>Popular</button>
          <button id="popularity_new" onClick={this.changePopularity}>New</button>
        </div>

        <div className="posts-div">
          {posts}
        </div>

      </div>
    );
  }
}

export default Main;
