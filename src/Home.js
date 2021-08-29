import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CreateBlog from './CreateBlog';
import Blog from './Blog';
import Sidebar from './Sidebar';
import functions from './functions';
import { collection, getDocs, getFirestore, query, where } from '@firebase/firestore';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  brand: {
      paddingLeft: '24px',
      paddingRight: '24px',
      paddingTop: '16px'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Home(props) {
  const { window } = props;
  const [blogs, setBlogs] = useState([]);
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  useEffect(() => {
    // onSnapshot(collection(getFirestore(), "blogs"), async (querySnapshot) => {
    //     querySnapshot.docChanges().forEach((change) => {
    //         console.log(change.doc.data());
    //       });

    //     setBlogs(await Promise.all(querySnapshot.docs.map(async (doc) => {
    //         var blog = doc.data()
    //         blog.id = doc.id

    //         var nuser = await functions.getUserData()

    //         blog.liked = (nuser.likedBlogs && nuser.likedBlogs.includes(props.id))

    //         var puser = await functions.getUserData(blog.publisherEmailId)

    //         blog.user = puser

    //         return blog
    //     })))
    // })

    const processDoc = async (doc) => {
        var blog = doc.data()
        blog.id = doc.id
        var nuser = await functions.getUserData()
        blog.liked = (nuser.likedBlogs && nuser.likedBlogs.includes(blog.id))
        console.log({
            likedBlogs: nuser.likedBlogs,
            includes: nuser.likedBlogs.includes(blog.id),
            blogId: blog.id
        })
        var puser = await functions.getUserData(blog.publisherEmailId)
        blog.user = puser
        return blog
    }

    const getBlogs = async () => {
        const documents = await getDocs(collection(getFirestore(), "blogs"))

        setBlogs(await Promise.all(documents.docs.map(processDoc)))
    }

    // const getCurrBlogs = () => {
    //     return blogs
    // }

    // console.log("eff")
    // onSnapshot(collection(getFirestore(), "blogs"), async (snapshot) => {
    //     for(var change of snapshot.docChanges()) {
    //         console.log({ t: change.type })
    //         if(change.type == "added") {
    //             const added = await processDoc(change.doc)
    //             console.log({ t: change.type, blogs, gonna: added})
    //             setBlogs([...(getCurrBlogs()), added])
    //         }
    //     }
    // })
    getBlogs()
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <Sidebar sI={selectedIndex} sSI={setSelectedIndex} classes={classes} blogs={blogs} setBlogs={setBlogs} />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <Sidebar sI={selectedIndex} sSI={setSelectedIndex} classes={classes} blogs={blogs} setBlogs={setBlogs} />
          </Drawer>
        </Hidden>
      </nav>

      { selectedIndex === null
      ? <CreateBlog classes={classes} handleDrawerToggle={handleDrawerToggle} />
    : <Blog classes={classes} handleDrawerToggle={handleDrawerToggle} blogs={blogs} setBlogs={setBlogs} blog={selectedIndex} userRef={props.userRef} />}
    </div>
  );
}

export default Home;
