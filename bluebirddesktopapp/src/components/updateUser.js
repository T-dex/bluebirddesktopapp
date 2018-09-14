import React, { Component } from 'react'



let data
class UpdateUser extends Component{
    constructor(){
        super()
        this.removeDay=this.removeDay.bind(this)
        this.addDay=this.addDay.bind(this)
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

 render(){
     const check=Object.keys(this.props.users).map(key=>this.props.users[key])
     const checker=Object.keys(check).map(key=>{
       return(
         <div className="userBlock">
          
           <h2>{check[key].email}</h2>
           <h3>Access Days</h3>
           <div className={check[key].access==='admin'?'day-counter-admin':'day-counter'}><button onClick={this.removeDay} value={check[key].email}>&lt;</button><h4>{check[key].remainingTrips}</h4><button onClick={this.addDay} value={check[key].email}>&gt;</button></div>
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