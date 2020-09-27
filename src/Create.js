import React from 'react';
import './Create.css';

class Create extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div className="Create">
        <div>
          <div className="title">
            Create
          </div>
          <div className="error">
            error goes heere
          </div>
          <div className="input">
            <i className="fa fa-user">U</i>
            <input type="text" id="username" placeholder="username" />
          </div>
          <div className="input">
            <i className="fa fa-user">U</i>
            <input type="password" id="password" placeholder="user123" />
          </div>
          <button className="login-button">
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default Create;
