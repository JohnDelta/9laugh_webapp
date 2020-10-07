import React from 'react';
import {Link, withRouter} from "react-router-dom";
import './Navbar.css';

class Navbar extends React.Component {
  
  constructor() {
    super();

    this.state = {
      categories: []
    };

    this.updateCategory = this.updateCategory.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.mappedCategories = this.mappedCategories.bind(this);
    this.validateUser = this.validateUser.bind(this);
  }

  componentDidMount() {
    this.getCategories();
    if(localStorage.getItem("token") !== null) {
      this.validateUser();
    }
  }

  async validateUser() {
    let url = "http://localhost:8082/api/user/get";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        
        if(response.status !== 200) {
          console.log("token validation failed");
          this.handleLogout();
        }
        else if (response.status === 200) {
          console.log("token ok");
        }
    } catch (error) {
      console.log("token validation failed : " + error);
      this.handleLogout();
    }
  }

  async getCategories() {
    let url = "http://localhost:8082/api/post/get/categories";
    try {
        const response = await fetch(url, {
            method: 'POST'
        });
        
        if(response.status !== 200) {
            console.log("error fetching categories");
        }
        else if (response.status === 200) {
          response.json().then((res)=>{
            console.log("Fetched categories");
            this.setState({
              categories: res
            });
            this.props.updateCategory(res[0]);
            localStorage.setItem("categories", JSON.stringify(res));
          });
        }
    } catch (error) {
      console.log("error fetching categories : "+error);
    }
  }

  mappedCategories() {
    let links = [];
    this.state.categories.forEach((category, cIndex) => {
      
      let activeCategory = "";
      if(cIndex === 0) {
        activeCategory = "tag-active";
      }

      links.push(
        <div className={"link tag "+activeCategory} id={"navbar_"+category} onClick={this.updateCategory} key={"link_nv_category_"+cIndex}>
            {category}
        </div>
      );
    });
    return links;
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

    this.props.updateCategory(category);
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
    localStorage.removeItem("token");
    this.props.history.push("/");
  }

  render() {
    let accountMenu = [];
    if(localStorage.getItem("token")) {
      accountMenu.push(
        <Link className="link" to="/account/settings" onClick={this.toggleNavbar} key="link_update_set_form_key">
          Settings
        </Link>
      );
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

    let categories = [];
    categories = this.mappedCategories();

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
            {categories}
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
