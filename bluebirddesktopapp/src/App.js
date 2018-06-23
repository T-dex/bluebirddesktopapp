import React, { Component } from 'react';
import firebase,{auth} from './firebase/firebase';
import Header from './header'
import './styles/app.css';

class App extends Component {
  constructor(){
    super();
      this.state={
        production:{}
      }
  }
  componentDidMount(){
    const rootRef=firebase.database().ref();
    const mainRef=rootRef.child('staging');
    mainRef.on('value', snap=>{
      this.setState({production:snap.val()})
    })
  }
  render() {

    return (
      <div className="App">
        <Header className="header"/>
      </div>
    );
  }
}

export default App;
