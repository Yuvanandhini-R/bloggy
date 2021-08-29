import { Button, Typography } from "@material-ui/core";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc } from "firebase/firestore"


function Login({ firebaseApp, setUserRef }) {
    
    const signInUser = async () => {
        const provider = new GoogleAuthProvider();
        const db = getFirestore();
        const auth = getAuth();

        try {
            const userCredential = await signInWithPopup(auth, provider)
            const user = userCredential.user;
    
            try {
                const qRes = await getDocs(query(collection(db, 'users'), where("email", "==", user.email)));

                var docRef = null;
    
                if(qRes.docs.length === 0) {
                    docRef = await addDoc(collection(db, "users"), {
                        displayName: user.displayName,
                        email: user.email,
                        photoUrl: user.photoURL,
                        likedBlogs: []
                    });
                    console.log("Document written with ID: ", docRef.id);
                } else {
                    docRef = await doc(db, 'users', qRes.docs[0].id)
                    console.log("Document already written with ID: ", docRef.id);
                }

                setUserRef(docRef)
            } catch (e) {
                console.error("Error adding document: ", e);
            }
    
        } catch (e) {
            console.error("Error signing in user: ", e);
        }    
    };

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
            <div>
                <Typography variant="h3" align="center">
                    Bloggy
                </Typography>

                <div style={{marginTop: "16px"}}>
                <Button variant="contained" onClick={ signInUser }>
                    Sign In With Google
                </Button>
                </div>
            </div>
        </div>
    );
}

export default Login;