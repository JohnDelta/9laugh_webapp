import React from 'react';
import {Link, withRouter} from "react-router-dom";
import './Navbar.css';

class Navbar extends React.Component {
  
  constructor() {
    super();
    this.updateCategory = this.updateCategory.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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
  
  updateCategory(e) {
    let category = e.target.id.split("_")[1];
    localStorage.setItem("category", category);
    this.toggleNavbar();
    this.props.history.push("/");

    let items = document.querySelectorAll(".tag");
    items.forEach((item, iIndex) => {
      if(item.id === e.target.id) {
        item.classList.add("tag-active");
      } else {
        item.classList.remove("tag-active");
      }
    });
  }

  handleLogout() {
    localStorage.clear();
    this.props.history.push("/");
  }

  render() {
    let accountMenu = [];
    if(localStorage.getItem("token")) {
      accountMenu.push(
        <div className="link" onClick={this.handleLogout} key="menu_logout_key">
          Logout
        </div>
      );
    } else {
      accountMenu.push(
        [<Link className="link" to="/create" onClick={this.toggleNavbar} key="link_create_form_key">
          Create New
        </Link>],
        [<Link className="link" to="/login" onClick={this.toggleNavbar} key="link_login_form_key">
          Login
        </Link>]
      );
    }

    return(
      <div className="Navbar">
        <Link className="logo-div" to="/">
          <span>9</span>
          <p>laugh</p>
        </Link>
        
        <div className="menu-div">
          <button className="notification-div">
            <i className="fa fa-bell"></i>
          </button>
          
          <div className="nav-button" onClick={this.toggleNavbar}>
            <div />
            <div />
            <div />
          </div>

          <div className="nav-links">
            <div className="title">
              Categories
            </div>
            <div className="link tag tag-active" id="navbar_funny" onClick={this.updateCategory}>
              funny
            </div>
            <div className="link tag" id="navbar_news" onClick={this.updateCategory}>
              news
            </div>
            <div className="link tag" id="navbar_random" onClick={this.updateCategory}>
              random
            </div>
            <div className="link tag" id="navbar_wtf" onClick={this.updateCategory}>
              wtf
            </div>
            <div className="title">
              Account
            </div>
            {accountMenu}
          </div>
        </div> 
      </div>
    );
  }
}

export default withRouter(Navbar);
