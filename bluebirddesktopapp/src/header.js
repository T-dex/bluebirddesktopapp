import React, { Component } from 'react';
import Logo from './styles/images/mainlogo.png'


class Header extends Component {
  constructor(){
    super();
    this.logIn=this.logIn.bind(this);
  }

  logIn(){
    const email= this.refs.email.value;
    const pass= this.refs.pass.value;
    const user= {email, pass};
    this.props.logIn(user);
  }
  
  render() {
    if(this.props.user == null){
      return (<div className="header font">
      <div className="header">
      <div>
        <form className="loginArea" onSubmit={(e)=>{this.logIn(),e.preventDefault()}}>
          <input className="loginField"type="text" placeholder="Email" ref="email"></input>
          <input className="loginField" type="password" placeholder="Password" ref="pass"></input>
          <button>Submit</button>
        </form>
        </div>
       </div>
       <img className="logo" src={Logo} alt="logo"/>
      </div>)
    }else{
    return (
      <div className="header font">
      <div>
       Welcome Back
       </div>
       <img className="logo" src={Logo} alt="Logo"/>
      </div>
    );
  }
  }
}

export default Header;