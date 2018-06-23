import React, { Component } from 'react';
import firebase,{auth} from './firebase/firebase';


class Header extends Component {
  constructor(){
    super();
  }
  
  render() {
    return (
      <div className="header font">
       <h1>Test</h1>
      </div>
    );
  }
}

export default Header;