import { getAuth } from "firebase/auth"
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"

const getPublishDate = (timestamp) => {
    const date = new Date(timestamp)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
}

const getUserData = async (email) => {
    const userEmail = email ? email : getAuth().currentUser.email
    const users = await getDocs(query(collection(getFirestore(), 'users'), where("email", "==", userEmail)))

    return users.docs[0].data()
}

const getBlogData = async (blogId) => {
    const blog = await getDoc(doc(getFirestore(), 'blogs', blogId))
    return blog.data()
}

export default {getUserData, getBlogData, getPublishDate}