import React, { Component } from 'react';
import { log } from 'util';

class UpdateUser extends Component{
    constructor(){
        super();
    }

 render(){
     const check=Object.keys(this.props.users).map(key=>this.props.users[key])
     console.log(check);
     const checker=Object.keys(check).map(key=>{
       return(
         <div className="userBlock">
           <h2>{check[key].email}</h2>
           <div className="day-counter"><button>&lt;</button><h4>{check[key].remainingTrips}</h4><button>&gt;</button></div>
        </div>
       )
     })
     
     console.log(checker);
     
  return(
    <div>
      {checker}
    </div>
  )
 }
}
export default UpdateUser