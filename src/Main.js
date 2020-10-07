import React from 'react';
import './Main.css';
import {withRouter} from "react-router-dom";

import DefaultResourceLinks from './DefaultRecourseLinks';

class Main extends React.Component {
  constructor() {
    super();
   
    this.state = {
      popularity: "",
      category: "",
      posts: [],
      pageNumber: 0
    }

    this.getPosts = this.getPosts.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.changePopularity = this.changePopularity.bind(this);
    this.addPost = this.addPost.bind(this);
    this.displayPost = this.displayPost.bind(this);
    this.handlePageMove = this.handlePageMove.bind(this);
  }

  componentDidMount() {
    if(localStorage.getItem("popularity") !== null) {
      this.setState({
        popularity: localStorage.getItem("popularity"),
        category: this.props.category
      }, () => {
        this.getPosts();
      });
    } else {
      this.setState({
        popularity: localStorage.setItem("popularity"),
        category: this.props.category
      }, () => {
        this.getPosts();
      });
      localStorage.setItem("popularity", "popular");
    }

    if(localStorage.getItem("pageNumber") === null) {
      localStorage.setItem("pageNumber", "0");
    } else {
      this.setState({
        pageNumber: Number(localStorage.getItem("pageNumber"))
      });
    }
  }

  componentDidUpdate() {
    if(this.props.category !== this.state.category) {
      this.setState({
        category: this.props.category
      }, () => {
        this.getPosts();
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

    let body = {"category": this.state.category};

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
        response.json().then((res)=>{
          this.setState({
            posts: res
          });
        });
        console.log("Fetched posts");
      } else {
        console.error("service post/get unavailable or bad fetch");
      }

    } catch (error) {
      console.log("error fetching posts : "+error);
    }
  }

  changePopularity(e) {
    let popularity = e.target.id.split("_")[1];
    this.setState({
      popularity: popularity,
      pageNumber: 0
    }, () => {
      localStorage.setItem("pageNumber", this.state.pageNumber);
      localStorage.setItem("popularity", popularity);
      this.getPosts();
    });

    let items = document.querySelectorAll(".popularity-div button");
    items.forEach((item, iIndex) => {
      if(item.id === e.target.id) {
        item.classList.add("popularity-div-button-active");
      } else {
        item.classList.remove("popularity-div-button-active");
      }
    });
  }

  async handleVote(e) {
    if(localStorage.getItem("token") !== null) {
      let args = e.target.id.split("_");
      let operation = args[0];
      let postId = args[1];
      //let user = args[2];

      let url = "http://localhost:8082/api/post";
      if(operation === "upvote") {
        url += "/upvote";
      } else {
        url += "/downvote";
      }

      let body = {"postId":postId};

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
          this.getPosts();
        } else {
          console.error("service post/get unavailable or bad fetch");
        }

      } catch (error) {
        console.log("error fetching posts : "+error);
      }
    }
  }

  addPost() {
    this.props.history.push("/add-post");
  }

  displayPost(e) {
    let post = this.state.posts[e.target.id.split("_")[1]];
    localStorage.setItem("postId", post.postId);
    this.props.history.push("/display-post");
  }

  handlePageMove(e) {
    let operation = e.target.id.split("_")[2];
    if(operation === "left") {
      this.setState({
        pageNumber: (Number(this.state.pageNumber) < 1) ? 0 : Number(this.state.pageNumber) - 1
      }, ()=>{
        localStorage.setItem("pageNumber", this.state.pageNumber);
      });
    } else if(operation === "right") {
      let postStart = (Number(this.state.pageNumber) + 1) * 10;
      
      if(postStart < Number(this.state.posts.length)) {
        this.setState({
          pageNumber: Number(this.state.pageNumber) + 1
        }, ()=>{
          localStorage.setItem("pageNumber", this.state.pageNumber);
        });
      }
    }
  }

  render() {

    let postsDiv = [];

    // pagination - find the range of posts to show - each page has 10 posts
    let postStart = Number(this.state.pageNumber) * 10;
    let postEnd = Number(postStart) + 10;

    this.state.posts.forEach((post, pIndex) => {
      
      if((pIndex >= postStart) && (pIndex < postEnd)) {
        let imagePath = "";
        if(post.mediaSource === "post_default.jpg") {
          imagePath = DefaultResourceLinks.getDefaultResourceLink() + "/" + post.mediaSource;
        } else {
          imagePath = DefaultResourceLinks.getUploadResourseLink() + "/" + post.mediaSource;
        }

        postsDiv.push(
          <div className="post" key={"post_"+pIndex}>
            <p className="title" onClick={this.displayPost} id={"post-title-id_"+pIndex} >
              {post.title}
            </p>

            <img src={imagePath} onClick={this.displayPost} id={"post-image-id_"+pIndex} />
            
            <div className="vote-div">
              <button id={"upvote_"+post.postId+"_"+post.user.userId} onClick={this.handleVote}>
                <p className="votes" key={post.upvotes}>{post.upvotes}</p>
                <i className="fa fa-thumbs-up"></i>
              </button>

              <button id={"downvote_"+post.postId+"_"+post.user.userId} onClick={this.handleVote}>
                <p className="votes" key={post.downvotes}>{post.downvotes}</p>
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
      }
    });

    if(postsDiv.length === 0) {
      postsDiv = <div className="message" key={"post_msg_"}>No posts yet</div>;
    } else {
      if(postEnd > this.state.posts.length) {
        postsDiv.push(
          <div className="pagination-div" key={"pagination_id_123"}>
            <button id="pagination_move_left" onClick={this.handlePageMove}>
              <i className="fa fa-arrow-left"/>
            </button>
            <p>Page: {Number(this.state.pageNumber)+1}</p>
            <button id="pagination_move_right" onClick={this.handlePageMove}>
              <i className="fa fa-arrow-right" />
            </button>
          </div>
        );
      }
    }

    let addPost = [];
    if(localStorage.getItem("token")) {
      addPost.push(
        <button className="add-post-button" key="add_post_button_key" onClick={this.addPost}>
          +
        </button>
      );
    }

    let popularityButtons = [];
    if(this.state.popularity === "popular") {
      popularityButtons.push(<button key={"mpb1"} className="popularity-div-button-active" id="popularity_popular" onClick={this.changePopularity}>Popular</button>);
      popularityButtons.push(<button key={"mpb2"} id="popularity_new" onClick={this.changePopularity}>New</button>);
    } else {
      popularityButtons.push(<button key={"mpb1"} id="popularity_popular" onClick={this.changePopularity}>Popular</button>);
      popularityButtons.push(<button key={"mpb2"} className="popularity-div-button-active" id="popularity_new" onClick={this.changePopularity}>New</button>);
    }

    return(
      <div className="Main">
        
        <div className="popularity-div">
          {popularityButtons}
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
