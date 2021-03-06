import React, { Component } from 'react';

class NavBar extends Component{
  

 render(){
  return(
    <div className="top-bar">
        <p
          className="navigation font"
          onClick={event => {
            this.props.eventEmitter.emit('landingPage', { page: 1 });
          }}
        >
          Update User
        </p>
        <p
          className="navigation font"
          onClick={event => {
            this.props.eventEmitter.emit('landingPage', { page: 2 });
          }}
        >
          Upload photos
        </p>
      </div>
  )
 }
}
export default NavBar
