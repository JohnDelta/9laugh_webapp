import React from 'react';
import './Main.css';
import {withRouter} from "react-router-dom";

import DefaultResourseLinks from './DefaultRecourseLinks';

class Main extends React.Component {
  constructor() {
    super();
   
    this.state = {
      popularity: "popular",
      category: "",
      posts: []
    }

    this.getPosts = this.getPosts.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.changePopularity = this.changePopularity.bind(this);
    this.addPost = this.addPost.bind(this);
    this.displayPost = this.displayPost.bind(this);
  }

  componentDidMount() {
    this.setState({
      category: this.props.category
    });
  }

  componentDidUpdate(prevState) {
    if(this.props.category !== this.state.category) {
      this.setState({
        category: this.props.category
      });
    }
  }
  
  async getPosts() {
    
    let url = "http://localhost:8082/api/post/get";
    if(this.state.popularity === "new") {
      url += "/new";
    } else {
      url += "/popular";
    }

    let body = {"category": localStorage.getItem("category")};

    try {
      const response = await fetch(url, {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify(body)
      });
      
      if(response.status === 200) {
        response.json().then((ans)=>{
          this.setState({
            posts: ans
          });
          if(ans.length !== 0) return true;
        });
      } else {
        console.log("error fetching posts");
      }

    } catch (error) {
      console.log("error fetching posts : "+error);
    }
    return false;
  }

  changePopularity(e) {
    let popularity = e.target.id.split("_")[1];
    this.setState({
      popularity: popularity
    });

    let items = document.querySelectorAll(".popularity-div button");
    items.forEach((item, iIndex) => {
      if(item.id === e.target.id) {
        item.classList.add("popularity-div-button-active");
      } else {
        item.classList.remove("popularity-div-button-active");
      }
    });
    this.getPosts();
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

  addPost() {
    this.props.history.push("/add-post");
  }

  displayPost(e) {
    let post = this.state.posts[e.target.id.split("_")[1]];
    localStorage.setItem("post", JSON.stringify(post));
    this.props.history.push("/display-post");
  }

  render() {

    let postsDiv = [];

    this.state.posts.forEach((post, pIndex) => {

      let imagePath = "";
      if(post.mediaSource === "post_default.jpg") {
        imagePath = DefaultResourseLinks.getDefaultResourceLink() + "/" + post.mediaSource;
      } else {
        imagePath = DefaultResourseLinks.getUploadResourseLink() + "/" + post.mediaSource;
      }

      postsDiv.push(
        <div className="post" key={"post_"+pIndex}>
          <p className="title" onClick={this.displayPost} id={"post-title-id_"+pIndex} >
            {post.title}
          </p>

          <img src={imagePath} onClick={this.displayPost} id={"post-image-id_"+pIndex} />
          
          <div className="vote-div">
            <button id={"upvote_"+post.postId+"_"+post.user.userId} onClick={this.handleVote}>
              <p className="votes">{post.upvotes}</p>
              <i className="fa fa-thumbs-up"></i>
            </button>

            <button id={"downvote_"+post.postId+"_"+post.user.userId} onClick={this.handleVote}>
              <p className="votes">{post.downvotes}</p>
              <i className="fa fa-thumbs-down"></i>
            </button>
          </div>
          
          <button className="comments-button" onClick={this.displayPost} id={"comments-button-id_"+pIndex}>
            <p>Comments</p>
            <i className="fa fa-comments"></i>
          </button>

          <p className="uploader">{post.user.username}</p>

          <p className="category">{post.category}</p>
        </div>
      );
    });

    if(postsDiv.length === 0) {
      postsDiv = <div className="message" key={"post_msg_"}>No posts yet</div>;
    }

    let addPost = [];
    if(localStorage.getItem("token")) {
      addPost.push(
        <button className="add-post-button" key="add_post_button_key" onClick={this.addPost}>
          +
        </button>
      );
    }

    return(
      <div className="Main">
        
        <div className="popularity-div">
          <button className="popularity-div-button-active" id="popularity_popular" onClick={this.changePopularity}>Popular</button>
          <button id="popularity_new" onClick={this.changePopularity}>New</button>
        </div>

        <div className="posts-div">
          {postsDiv}
        </div>

        {addPost}

      </div>
    );
  }
}

export default withRouter(Main);
