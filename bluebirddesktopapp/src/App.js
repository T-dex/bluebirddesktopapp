import React, { Component } from 'react';
import firebase, { auth } from './firebase/firebase';
import Header from './header';
import { EventEmitter } from 'events';
import AddUser from './components/addUser';
import AddMedia from './components/addMedia';
import UpdateUser from './components/updateUser';
import NavBar from './components/navBar';
import './styles/app.css';

// // let user;
const rootRef = firebase.database().ref();
const storageRef = firebase.storage().ref();
const mainRef = rootRef.child('staging');
const pictureId = Math.floor(Math.random() * 1000000000);
class App extends Component {
	constructor() {
		super();
		this.state = {
			production: {},
			user: null,
			uid: '',
			page: null,
			selectedPics: null
		};
	}
	componentDidMount() {
		mainRef.child('users').on('value', (snap) => {
			this.setState({ production: snap.val() });
		});
	}
	componentWillMount() {
		this.eventEmitter = new EventEmitter();
		this.eventEmitter.addListener('landingPage', ({ page }) => {
			this.userScreen({ newLandingPage: page });
		});
	}
	logIn(user) {
		const email = user.email;
		const pass = user.pass;
		const promise = auth.signInWithEmailAndPassword(email, pass);
		promise
			.then((snapshot) => {
				// eslint-disable-next-line
				const userCheck = Object.keys(this.state.production).filter((key) => {
					if (this.state.production[key].email == snapshot.user.email) {
						if (this.state.production[key].access === 'admin') {
							mainRef.on('value', (snap) => {
								const app = snap.val();
								const users = { ...app.users };
								const days = { ...app.days };
								const images = { ...app.images };
								this.setState({ production: { users: users, days: days, images: images } });
							});
							this.setState({ user: email, uid: snapshot.user.uid });
							return this.state.production[key];
						}
					}
				});
			})
			.catch((error) => {
				console.log('Failed');
			});
	}
	emptyFunction(newUserData) {
		const email = newUserData.email;
		const pass = newUserData.pass;
		const packages = newUserData.packages;
		const access = newUserData.admin;

		// eslint-disable-next-line
		const checkAuth = firebase
			.auth()
			.createUserWithEmailAndPassword(email, pass)
			.then((snap) => {
				let key = snap.user.uid;
				const buildUser = {
					email: email,
					uid: key,
					access: access,
					package: packages,
					remainingTrips: newUserData.trips
				};
				delete newUserData.pass;
				const newClient = {
					...this.state.production.users,
					[key]: buildUser
				};
				console.log(newClient);

				this.setState((prevState) => ({
					production: {
						...prevState.production,
						users: newClient
					}
				}));
				mainRef.child('users/').set(newClient);
			})
			.catch((err) => console.log(err));
	}

	removeUserDay = (remove) => {
		// eslint-disable-next-line
		const user = Object.keys(this.state.production.users).filter((key) => {
			if (key === remove) {
				const removeUsersDay = this.state.production.users[key];
				const subDay = removeUsersDay.remainingTrips - 1;
				const updatedUser = {
					...removeUsersDay,
					remainingTrips: subDay
				};
				const newUsers = {
					...this.state.production.users,
					[key]: updatedUser
				};
				this.setState((prevState) => ({
					production: {
						...prevState.production,
						users: newUsers
					}
				}));
				console.log(newUsers, updatedUser);
				mainRef.child('users/').set(newUsers);
				return key;
			}
		});
	};
	addUserDay = (add) => {
		// eslint-disable-next-line
		const user = Object.keys(this.state.production.users).filter((key) => {
			if (key === add) {
				const addUsersDay = this.state.production.users[key];
				const addDay = addUsersDay.remainingTrips + 1;
				const updatedUser = {
					...addUsersDay,
					remainingTrips: addDay
				};
				const newUsers = {
					...this.state.production.users,
					[key]: updatedUser
				};
				this.setState((prevState) => ({
					production: {
						...prevState.production,
						users: newUsers
					}
				}));
				mainRef.child('users/').set(newUsers);
				return key;
			}
		});
	};
	userScreen({ newLandingPage }) {
		if (this.state.user !== null) {
			this.setState({ page: newLandingPage });
		}
	}
	fileUpload = (event) => {
		this.setState({ selectedPics: event.target.files });
	};
	pictureUpload = (picData) => {
		const userId = picData.userId;
		const date = picData.day;
		let picName;
		let file;
		let refURL;
		let picId;
		const fd = new FormData();
		const test1 = Object.keys(this.state.selectedPics).forEach((key) => {
			picName = this.state.selectedPics[key].name;
			file = this.state.selectedPics[key];
			fd.append('image', this.state.selectedPics[key], this.state.selectedPics[key].name);
			const metadata = {
				contentType: 'image/jpeg'
			};
			let newRef = storageRef.child(picName).put(file, metadata).then((snapshot) =>
				snapshot.ref.getDownloadURL().then((downloadURL) => {
					refURL = downloadURL;
          let picId;
          
          
          mainRef.child('images').on('value', (snap) => (picId = snap.val()));
					const newUserId = Object.keys(picId).filter((key) => key == userId);
			
					if (newUserId.length == 0) {
            //Total brain fart today and can't figure out what to do when then data gets here. Need to loop over all of the pictures coming in through state and create new state.
            //This sections is when the user does not exsit
						console.log('not in today', this.state.selectedPics[key].name);
					} else {
            //This is the section where the user does have photos
            //need a second conditional in here to choose wether to create new or add to old state. Should write down what the structure is in the firebase to make sure this is all right
            
						console.log('the user exsits', this.state.selectedPics[key].name);
					}

					//Getting somewhere. If length = 0 user does not exsit and need to build new "state" and insert into images

					// Need to take users and photos and loop over them. If they match then push to a previous state, if not build a new state with new user.

					//  const test=Object.keys(picId).map(key=>{
					//   console.log(refURL, [key],"inside");
					//   const url=refURL
					//  if(userId===key){
					//    // would rather not go through another loop to get here but might need to.
					//    ///causing many issues with inserting photos with out loopping over object
					//   const newPicture={
					//     ...this.state.production.images[key],
					//     [pictureId]:{
					//     [pictureId]:{
					//         [date]:[date],
					//       url:url}}
					//   }
					//   console.log(newPicture,[key]);

					//   const updatedImageState={
					//     ...this.state.production.images[key],
					//     [key]:{[date]:newPicture}
					//   }

					//   this.setState(prevState=>({
					//     ...prevState.production.images[key],
					//     images:updatedImageState
					//   }))
					//  }else{
					//    const newUserPics={
					//       [date]:{
					//        [pictureId]:{
					//          date:pictureId,
					//        url:url}}
					//    }
					//    const updatedImageState={
					//      ...this.state.production.images,
					//      [userId]:newUserPics
					//    }
					//    this.setState(prevState=>({
					//      production:{
					//        ...prevState.production,
					//       images:updatedImageState
					//      }
					//    }))
					//   //  mainRef.child('images/').set(updatedImageState)

					//  }
					// })
        })
  
        
      );
		});

		const metadata = {
			contentType: 'image/jpeg'
		};

		// eslint-disable-next-line
		let newRef = storageRef.child(picName).put(file, metadata).then(
			(snapshot) =>
				snapshot.ref.getDownloadURL().then((downloadURL) => {
					refURL = downloadURL;
					// Images files are being uploaded in buckets Need to map over them and individually create new objects to pump into state
					// eslint-disable-next-line
				})

			//Logic needs to get figured out here. Just need to set the images up correctly. Will also need to adjust main page as it is not set up right
			//Listening to Aha at sunset coffee if you need help with the head space
		);
	};
	render() {
		let mainArea;
		if (this.state.user !== null && this.state.page === 2) {
			mainArea = (
				<div className="mainArea">
					<div>
						<UpdateUser
							addUserDay={this.addUserDay}
							removeUserDay={this.removeUserDay}
							users={this.state.production.users}
						/>
					</div>
				</div>
			);
		} else if (this.state.user !== null && this.state.page === 1) {
			mainArea = (
				<div className="mainArea">
					<div>
						<AddUser emptyFunction={this.emptyFunction.bind(this)} />
					</div>
				</div>
			);
		} else if (this.state.user !== null && this.state.page === 3) {
			mainArea = (
				<div className="mainArea">
					<div>
						<AddMedia
							fileUpload={this.fileUpload}
							pictureUpload={this.pictureUpload}
							src={this.state.selectedPics}
							users={this.state.production.users}
						/>
					</div>
				</div>
			);
		}
		return (
			<div className="App">
				<Header className="header" user={this.state.user} logIn={this.logIn.bind(this)} />
				<NavBar eventEmitter={this.eventEmitter} landingPage={this.state.page} />
				{mainArea}
			</div>
		);
	}
}

export default App;
