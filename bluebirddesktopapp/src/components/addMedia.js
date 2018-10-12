import React, { Component } from 'react';
import Calendar from './calendar'
import { log } from 'util';

class AddMedia extends Component{
   state={
       selectedDay:'Click here to Select Day',
       show:false,
       files:[]
   }

addFile=event=>{
   // eslint-disable-next-line
   const files=[...event]
    this.props.fileUpload(event)
}
uploadFile=(event)=>{
    let userId=this.refs.user.value
    let day= this.state.selectedDay
    const picData={userId, event, day }
    if(day!='Click here to Select Day'){
   this.props.pictureUpload(picData)
    }else{
       alert("Please Select Day!")
   }
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