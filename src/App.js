import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useState } from "react";
import Home from "./Home";
import Login from "./Login";

function App({ firebaseApp }) {

  const [login, setLogin] = useState(true);
  const [userRef, setUserRef] = useState();

  onAuthStateChanged(getAuth(), async (user) => {
    if(user) {
      setLogin(false)
      const qRes = await getDocs(query(collection(getFirestore(), 'users'), where("email", "==", user.email)));
      setUserRef(doc(getFirestore(), 'users', qRes.docs[0].id))
    } else {
      setLogin(true)
    }
  })

  return (
    login
    ? <Login firebaseApp={firebaseApp} setUserRef={setUserRef} />
    : <Home userRef={userRef} />
  );
}

export default App;
