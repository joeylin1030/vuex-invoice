import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTb2Y5rblTFv1Bt87WNljRdlPuDXqHkUY",
  authDomain: "invoice-app-62e95.firebaseapp.com",
  projectId: "invoice-app-62e95",
  storageBucket: "invoice-app-62e95.appspot.com",
  messagingSenderId: "430812424860",
  appId: "1:430812424860:web:2cbcaaeeaaaabc8820db59",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();
