import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Box, Button, CircularProgress, TextField } from '@material-ui/core';
import { useState } from 'react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function CreateBlog(props) {

    const [blogTitle, setBlogTitle] = useState("");
    const [blogSubtitle, setBlogSubtitle] = useState("");
    const [blogBody, setBlogBody] = useState("");
    const [showLoading, setShowLoading] = useState(false);

    const post = async () => {
        setShowLoading(true)
        const db = getFirestore();
        const blogRef = await addDoc(collection(db, "blogs"), {
            title: blogTitle,
            subtitle: blogSubtitle,
            body: blogBody,
            likeCount: 0,
            publishDate: Date.now(),
            publisherEmailId: getAuth().currentUser.email
        })
        console.log("Blog written successfully with ID: ", blogRef.id);
        setShowLoading(false)
    }

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
                <Typography variant="h6" noWrap>
                    Create Blog
                </Typography>
                </Toolbar>
            </AppBar>
            
            <main className={props.classes.content}>
                <div className={props.classes.toolbar} />

                <TextField
                    label="Title"
                    value={blogTitle}
                    onChange={(event) => setBlogTitle(event.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                />

                <TextField
                    label="Subtitle"
                    value={blogSubtitle}
                    onChange={(event) => setBlogSubtitle(event.target.value)}
                    variant="outlined"
                    size="small"
                    style={{marginTop: "32px"}}
                    fullWidth
                />

                <TextField
                    label="Body"
                    value={blogBody}
                    onChange={(event) => setBlogBody(event.target.value)}
                    variant="outlined"
                    style={{marginTop: "32px"}}
                    fullWidth
                    multiline
                />

                <div style={{marginTop: "32px", display: "flex"}}>
                    <Box style={{flexGrow: "1"}} />

                    { showLoading ? <CircularProgress /> : <></> }

                    <Button variant="contained" onClick={post}>Post</Button>
                </div>
            </main>
        </>
    );
}

export default CreateBlog;