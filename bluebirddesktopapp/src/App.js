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
// eslint-disable-next-line
const pictureId = Math.floor(Math.random() * 1000000000);
class App extends Component {
	constructor() {
		super();
		this.state = {
			production: {},
			user: null,
			uid: '',
			page: null,
			selectedPics: [],
			images: [],
			uploadimages: {}
		};
	}
	componentDidMount() {
		mainRef.child('users').on('value', (snap) => {
			this.setState({
				production: snap.val()
			});
		});
	}
	componentWillMount() {
		this.eventEmitter = new EventEmitter();
		this.eventEmitter.addListener('landingPage', ({ page }) => {
			this.userScreen({
				newLandingPage: page
			});
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
					if (this.state.production[key].email === snapshot.user.email) {
						if (this.state.production[key].access === 'admin') {
							mainRef.on('value', (snap) => {
								const app = snap.val();
								const users = {
									...app.users
								};
								const days = {
									...app.days
								};
								const images = {
									...app.images
								};
								this.setState({
									production: {
										users: users,
										days: days,
										images: images
									}
								});
							});
							this.setState({
								user: email,
								uid: snapshot.user.uid
							});
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
	// eslint-disable-next-line
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
			this.setState({
				page: newLandingPage
			});
		}
	}
	fileUpload = (event) => {
		this.setState({
			selectedPics: event.target.files
		});
	};
	pictureUpload = (picData) => {
		const userId = picData.userId;
		// eslint-disable-next-line
		const date = picData.day;
		let picName;
		let file;
		let refURL;
		let updatedURL = [];
		// eslint-disable-next-line
		const test1 = Object.keys(this.state.selectedPics).map((key) => {
			picName = this.state.selectedPics[key].name;
			file = this.state.selectedPics[key];
			const metadata = {
				contentType: 'image/jpeg'
			};

			let newPicKey = Math.floor(Math.random() * 10000000);
			// eslint-disable-next-line
			let newRef = storageRef.child(picName).put(file, metadata).then((snapshot) =>{
				let progress = snapshot.bytesTransferred / snapshot.totalBytes*100
					console.log('Upload is ' + progress + '% done');
				snapshot.ref.getDownloadURL().then((downloadURL) => {
					let testURL = {
						[newPicKey]: downloadURL
					};
					refURL = {
						...refURL,
						[key]: testURL,
						key: key
					};
					updatedURL.push(testURL);
					let picId;

					mainRef.child('images').on('value', (snap) => (picId = snap.val()));
					console.log(mainRef.bytesTransferred);

					const newUserId = Object.keys(picId).filter((key) => key === userId);
					let newObj;

					Object.keys(this.state.selectedPics).map((key) => {
						const refKey = Object.keys(updatedURL[key] || {}).map((key) => {
							return key;
						});

						let date = refKey[0];
						if (refKey.length !== 0) {
							newObj = {
								...newObj,
								[refKey]: {
									date: date,
									url: updatedURL[key][refKey]
								}
							};
						} else {
							return;
						}
						return newObj;
					});

					if (newUserId.length === 0) {
						const pictures = {
							[date]: newObj
						};

						const newPicUpload = {
							...this.state.production.images,
							[userId]: pictures
						};
						console.log(newPicUpload);

						this.setState((prevState) => ({
							production: {
								...prevState.production,
								images: newPicUpload
							}
						}));

						mainRef.child('images').set(newPicUpload);
						setTimeout(()=>alert("Images uploaded!"),3000)
					} else {
						const newPicUpload = {
							...this.state.production.images[userId],
							[date]: newObj
						};
						console.log(newPicUpload);
						const newUserImageObj = {
							...this.state.production.images,
							[userId]: newPicUpload
						};
						console.log(newUserImageObj);

						this.setState((prevState) => ({
							production: {
								...prevState.production,
								images: newUserImageObj
							}
						}));
						mainRef.child('images').set(newUserImageObj);
						setTimeout(()=>alert("Images uploaded!"),3000)
					}
				})
			});
		});
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
						/>{' '}
					</div>{' '}
				</div>
			);
		} else if (this.state.user !== null && this.state.page === 1) {
			mainArea = (
				<div className="mainArea">
					<div>
						<AddUser emptyFunction={this.emptyFunction.bind(this)} />{' '}
					</div>{' '}
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
						/>{' '}
					</div>{' '}
				</div>
			);
		}
		return (
			<div className="App">
				<Header className="header" user={this.state.user} logIn={this.logIn.bind(this)} />{' '}
				<NavBar eventEmitter={this.eventEmitter} landingPage={this.state.page} /> {mainArea}{' '}
			</div>
		);
	}
}

export default App;
