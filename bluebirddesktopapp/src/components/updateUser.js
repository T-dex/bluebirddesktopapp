import React, { Component } from 'react'




let data
class UpdateUser extends Component{
    constructor(){
        super()
        this.removeDay=this.removeDay.bind(this)
        this.addDay=this.addDay.bind(this)
        this.deleteUser=this.deleteUser.bind(this)
    }
componentDidMount(){
data=this.props.users
}
removeDay(event){  
const remove= Object.keys(data).filter(key=>{
  if(data[key].email===event.target.value){
    return data[key]
  }
   // eslint-disable-next-line
  return
})
   this.props.removeUserDay(remove)
}

addDay=(event)=>{
   // eslint-disable-next-line
  const add= Object.keys(data).filter(key=>{
    if(data[key].email===event.target.value){
      return data[key] 
    }
  })
   this.props.addUserDay&&this.props.addUserDay(add)

  
 return
}
deleteUser=(event)=>{
  // eslint-disable-next-line
  const deleteUser = Object.keys(data).filter(key=>{
    if(data[key].email===event.target.value){
      return data[key]
  }})
  console.log(deleteUser, data);
  this.props.removeUser&&this.props.removeUser(deleteUser)
}

 render(){
     const check=Object.keys(this.props.users).map(key=>this.props.users[key])
     const checker=Object.keys(check).map(key=>{
       return(
         <div className="userBlock">
            <button className="removeUser" onClick={this.deleteUser} value={check[key].email}>Delete User</button>
           <h2>{check[key].email}</h2>
           <div className={check[key].access==='admin'?'day-counter-admin':'day-counter'}>
            <h3>Access Days</h3>
            <button className="userbutton removeDay" onClick={this.removeDay} value={check[key].email}>-</button>
            <h4>{check[key].remainingTrips}</h4>
            <button className="userbutton addDay" onClick={this.addDay} value={check[key].email}>+</button></div>
        </div>
       )
     })

     
  return(
    <div>
      {checker}
    </div>
  )
 }
}
export default UpdateUser