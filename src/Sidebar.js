import React, { useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import Typography from '@material-ui/core/Typography';
import { Avatar, ListItemAvatar } from '@material-ui/core';
import { useState } from 'react';
import { collection, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import functions from './functions';
import { CollectionsBookmarkOutlined } from '@material-ui/icons';

function Sidebar(props) {
    return (
        <div>
            <div className={props.classes.toolbar} >
                <Typography variant="h5" noWrap className={props.classes.brand}>
                    Bloggy
                </Typography>
            </div>
            <Divider />
            <List>
                <ListItem button selected={props.sI === null} onClick={(event) => {
                    props.sSI(null)
                }}>
                    <ListItemIcon><AddCircleIcon /></ListItemIcon>
                    <ListItemText>Create</ListItemText>
                </ListItem>
            </List>
            <Divider />
            <List>
                { props.blogs.map((blog) => {
                    return <BlogTile blog={blog} key={blog.id} sI={props.sI} sSI={props.sSI} />
                }) }
            </List>
        </div>
    );
}

function BlogTile({ blog, sI, sSI }) {
    return (
        <ListItem button selected={sI ? sI.id === blog.id : false} onClick={(event) => {
            sSI(blog)
        }}>
            <ListItemAvatar>
                { <Avatar src={blog.user.photoUrl} /> }
            </ListItemAvatar>
            <ListItemText primary={blog.title} secondary={blog.subtitle + "\n(" + functions.getPublishDate(blog.publishDate) + ")"} />
        </ListItem>
    );
}

export default Sidebar