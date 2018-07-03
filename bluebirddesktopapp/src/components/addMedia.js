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
 render(){
  return(
    <div>
      <input type="file" onChange={this.addFile}/>
    </div>
  )
 }
}
export default AddMedia