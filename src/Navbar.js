import React from 'react';
import {Link} from "react-router-dom";
import './Navbar.css';

class Navbar extends React.Component {
  constructor() {
    super();

    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
		// Move navBar from right(out) to left(in)
		let navLinks = document.querySelector(".nav-links");
		navLinks.classList.toggle("nav-links-active");
	
		//Move bars of nav-button
		let navButtonLines = document.querySelectorAll(".nav-button div");
		navButtonLines.forEach((line, index) => {
			line.classList.toggle("nav-button-line"+(index+1)+"-active");
		});
	}

  render() {
    return(
      <div className="Navbar">
        <Link className="logo-div" to="/">
          <span>9</span>
          <p>laugh</p>
        </Link>
        
        <div className="menu-div">
          <div className="notification-div">
            <i className="fa fa-notification">G</i>
          </div>
          
          <div className="nav-button" onClick={this.toggleNavbar}>
            <div />
            <div />
            <div />
          </div>

          <div className="nav-links">
            <div className="title">
              Categories
            </div>
            <div className="link">
              Hot
            </div>
            <div className="link">
              Trending
            </div>
            <div className="link">
              Fresh
            </div>
            <div className="title">
              Account
            </div>
            <Link className="link" to="/create" onClick={this.toggleNavbar}>
              Create New
            </Link>
            <Link className="link" to="/login" onClick={this.toggleNavbar}>
              Login
            </Link>
          </div>
        </div> 
      </div>
    );
  }
}

export default Navbar;
