import firebase from 'firebase'
import { log } from 'util';

const config = {
  apiKey: "AIzaSyAM0DL6QzhVONFmxP5OHWGi9Vj4lS2RbbM",
  authDomain: "bluebirdheli-dd1f5.firebaseapp.com",
  databaseURL: "https://bluebirdheli-dd1f5.firebaseio.com",
  storageBucket: "bluebirdheli-dd1f5.appspot.com",
};
firebase.initializeApp(config)



export const auth = firebase.auth();
export default firebase;
