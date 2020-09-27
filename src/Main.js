import React from 'react';
import './Main.css';

class Main extends React.Component {
  constructor() {
    super();
   
    this.state = {
      popularity: "popular"
    }

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


  render() {
    return(
      <div className="Main">
        
        <div className="popularity-div">
          <button id="popularity_popular" onClick={this.changePopularity}>Popular</button>
          <button id="popularity_new" onClick={this.changePopularity}>New</button>
        </div>

      </div>
    );
  }
}

export default Main;
