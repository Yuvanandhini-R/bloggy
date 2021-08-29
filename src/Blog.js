import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import TextField from '@material-ui/core/TextField';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { Avatar, Box, ListItemAvatar, ListItemText } from '@material-ui/core';
import functions from './functions';
import { arrayRemove, arrayUnion, collection, doc, getFirestore, increment, onSnapshot, query, updateDoc, where, addDoc, getDocs, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function Blog(props) {

    // const [comment, setComment] = useState("");
    // const [comments, setComments] = useState([]);

    // const postComment = async () => {
    //     console.log("cstart")
    //     const commentRef = await addDoc(collection(getFirestore(), "comments"), {
    //         user: (await getDoc(props.userRef)).data().email,
    //         blog: props.blog.id,
    //         comment: comment
    //     })
    //     console.log("Comment written successfully with ID: ", commentRef.id);

    //     setComments(comments.concat(await loadComment(commentRef)))
    // }

    const toggleBlogLike = (blogId) => {
        const newBlogs = props.blogs.map((blog) => {
            if(blog.id == blogId) {
                if(blog.liked) {
                    blog.likeCount = blog.likeCount - 1
                } else {
                    blog.likeCount = blog.likeCount + 1
                }

                blog.liked = !blog.liked
                return blog
            } else {
                return blog
            }
        })

        props.setBlogs(newBlogs)
    }

    const likeBlog = () => {
        if(props.blog.liked) {
            updateDoc(doc(getFirestore(), 'users', props.userRef.id), {
                likedBlogs: arrayRemove(props.blog.id)
            })

            updateDoc(doc(getFirestore(), 'blogs', props.blog.id), {
                likeCount: increment(-1)
            })

            console.log("here")
            toggleBlogLike(props.blog.id)
            console.log("heree")
        } else {
            updateDoc(doc(getFirestore(), 'users', props.userRef.id), {
                likedBlogs: arrayUnion(props.blog.id)
            })

            updateDoc(doc(getFirestore(), 'blogs', props.blog.id), {
                likeCount: increment(1)
            })

            console.log("here2")
            toggleBlogLike(props.blog.id)
            console.log("heree2")
        }
    }

    // const loadComment = async (commentRef) => {
    //     var comment = commentRef.data()
    //     comment.id = commentRef.id
    //     var nuser = await functions.getUserData(comment.user)
    //     comment.userPhotoUrl = nuser.photoUrl
    //     comment.userDisplayName = nuser.displayName
    //     return comment
    // }

    // useEffect(() => {
    //     const getComments = async () => {
    //         const blogId = props.blog.id
    //         var comments = await getDocs(query(collection(getFirestore(), "comments"), where("blog", '==', blogId)))
    //             comments = await Promise.all(comments.docs.map(loadComment))
            
    //         setComments(blogId)
    //     }

    //     getComments()
    // }, [])

    return (
        <>
            <AppBar position="fixed" className={props.classes.appBar}>
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    className={props.classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                <div>
                <Typography variant="h6" noWrap>
                    {props.blog.title}
                </Typography>
                <Typography variant="subtitle1" noWrap>
                    {props.blog.subtitle}
                </Typography>
                </div>
                </Toolbar>
            </AppBar>
            
            <main className={props.classes.content}>
                <div className={props.classes.toolbar} />
                <Typography paragraph>
                {props.blog.body}
                </Typography>

                <Divider />

                <Box display="flex" style={{marginTop: "16px"}}>
                    <div style={{alignSelf: "center"}}>
                        { <Avatar src={props.blog.user.photoUrl} /> }
                    </div>

                    <div style={{paddingLeft: "8px"}}>
                        <Typography variant="body1">
                        { props.blog.user.displayName }
                        </Typography>
                        <Typography variant="body2">
                        { functions.getPublishDate(props.blog.publishDate) }
                        </Typography>
                    </div>

                    <Box flexGrow={1}></Box>

                    <Box display="Flex" style={{alignSelf: "center"}}>
                        <IconButton onClick={likeBlog}>
                            { props.blog.liked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
                        </IconButton>
                        <Typography variant="caption" style={{alignSelf: "center", marginLeft: "8px"}}>
                        { props.blog.likeCount }
                        </Typography>
                    </Box>
                </Box>

                {/* <Divider style={{marginTop: "16px"}} />

                <Box display="flex" style={{marginTop: "16px"}}>
                    <TextField
                        label="Write a comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                    />

                    <Button variant="contained" onClick={postComment} style={{marginLeft: "16px"}}>Comment</Button>
                </Box>

                <List>
                    { !comments
                    ? comments.map((comment) => {
                        return <>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar src={comment.userPhotoUrl} /> 
                                </ListItemAvatar>
                                <ListItemText primary={comment.userDisplayName} secondary={comment.comment} />
                            </ListItem>
                            <Divider />
                        </>
                    })
                    : <ListItemText primary={"No comments yet"} /> } 
                    
                </List> */}
            </main>
        </>
    );
}

export default Blog;