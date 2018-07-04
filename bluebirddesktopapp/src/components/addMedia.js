import React, { Component } from 'react';
import { log } from 'util';

class AddMedia extends Component{
    constructor(){
        super();
    }

addFile=event=>{
    console.log(event);
    this.props.fileUpload(event)
}
uploadFile=()=>{
   this.props.pictureUpload()
}
 render(){
     console.log(this.props);
     
  return(
    <div>
      <input type="file" onChange={this.addFile}/>
      <button onClick={this.uploadFile}>Upload</button>
      <img src={this.props.src}/>
    </div>
  )
 }
}
export default AddMedia