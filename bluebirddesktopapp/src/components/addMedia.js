import React, { Component } from 'react';

class AddMedia extends Component{
   

addFile=event=>{
    console.log(event);
    this.props.fileUpload(event)
}
uploadFile=(event)=>{
    let userId=this.refs.user.value
    const picData={userId, event}
    console.log(picData);
    
   this.props.pictureUpload(picData)
}
 render(){
     const users=Object.keys(this.props.users).map(key=>{
         return (
             <option key={key} value={this.props.users[key].uid}>
                 {this.props.users[key].email}
             </option>
         )
     })
     console.log(users);
     
     
  return(
    <div>
      <input type="file" multiple onChange={this.addFile}/>
      <button onClick={this.uploadFile}>Upload</button>
      <img src={this.props.src} alt=""/>
      <div>
          <select ref="user">
              {users}
          </select>
      </div>
    </div>
  )
 }
}
export default AddMedia