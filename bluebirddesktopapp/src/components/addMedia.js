import React, { Component } from 'react';
import Calendar from './calendar'

class AddMedia extends Component{
   state={
       selectedDay:'08-09-2018',
       show:false,
       files:[]
   }

addFile=event=>{
    console.log(event);
   const files=[...event]
   console.log(files);
   
    this.props.fileUpload(event)
}
uploadFile=(event)=>{
    let userId=this.refs.user.value
    let day= this.state.selectedDay
    const picData={userId, event, day }
    console.log(picData);
    
   this.props.pictureUpload(picData)
}
updateDay=(day)=>{
    this.setState({
        selectedDay:day
    })
}
showCalendar=(e)=>{
    this.setState({
        show:!this.state.show
    })

}
 render(){
     const users=Object.keys(this.props.users).map(key=>{
         return (
             <option key={key} value={this.props.users[key].uid}>
                 {this.props.users[key].email}
             </option>
         )
     })
     
     
  return(
    <div>
      <input type="file" multiple onChange={this.addFile}/>
      <button onClick={this.uploadFile}>Upload</button>
      <a onClick={e=>this.showCalendar(e)}><p>{this.state.selectedDay}</p></a>
      {this.state.show && <Calendar  class={this.state.show}updateDay={this.updateDay}/>}
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