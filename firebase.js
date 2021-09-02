import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBU7FiZcYF5XF1BDp-MRJ5GFiCdDnN1xXg",
  authDomain: "signal-clone-d7aef.firebaseapp.com",
  projectId: "signal-clone-d7aef",
  storageBucket: "signal-clone-d7aef.appspot.com",
  messagingSenderId: "979861989884",
  appId: "1:979861989884:web:dc64e606a377803922ea79",
};
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
