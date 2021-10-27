import { makeStyles, Typography } from "@material-ui/core";
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from "@material-ui/core/Box";

import "../css/NavAnimations.css";





const useStyles = makeStyles((theme) => ({

    nav: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "5vh",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        padding: "0 1vw 0 1vw",
        backgroundColor: "#fafafa"
        
    },

    navFade : {
        height: "2vh",
        width: "100%",
        backgroundImage: "linear-gradient(to bottom, rgba(250,250,250,1), rgba(250,250,250, 0) 80%)",
    },

    navbar: {
        width: "auto",
        maxWidth:"12vw",
        zIndex: 999, 
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        marginLeft: "-13vw",
        border: "1px solid lightgrey",
    },

    navItem: {
        textAlign: "left",
        padding: "0 2vw 0 1vw",
        width: "auto",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
        }
    },

    navItemText: {
        display: "flex",
        margin: "5px",
        color:"black",
    },

    navTab: {
        display:"flex",
        alignItems:"center",
        userSelect:"none",
        height: "100%",
        padding: "0 1vw 0 1vw",
    },

    navTabs : {
        display: "flex",
        flexDirection: "row",
        width:"auto",
        marginRight: "2vw",
        height: "100%",
    }

}));


export function Nav(props) {

    const classes = useStyles();

    return (
        <div style={{position: "fixed", width:"100%",  zIndex: 999,}}>
            <nav className={classes.nav}>
                {props.children}
            </nav>
            <div className={classes.navFade}></div>
        </div>
    );
}

export function NavItem(props) {

    const classes = useStyles();

    return (
        <ListItem button className={classes.navItem}>
            <ListItemText className={classes.navItemText}>
                <Typography style={{ fontSize: ".9em" }}><b style={{borderBottom:"1px solid lightgrey",}}>{props.children}</b></Typography>
            </ListItemText>
        </ListItem>
    );
}


export const NavBar = React.forwardRef((props, ref) => {

    const classes = useStyles();

    return (
        <List className={classes.navbar}>
            <ListItem className={classes.navItem}>
                <ListItemText className={classes.navItemText}>
                    <Typography variant="h6">
                        <b>{props.label}</b>
                    </Typography>
                </ListItemText>
            </ListItem>
            {props.children}
        </List>
    );

})

export function NavTabs(props) {

    const classes = useStyles();

    return (
        <Box
            className={classes.navTabs}
        >
            {props.children}
        </Box>
    )
}

export function NavTab(props) {

    const classes = useStyles();

    return (
        <Box
            className={`${classes.navTab} NavTabAnim`}
            onClick={props.onClick}
            style={{
                boxShadow: (props.isPage) ? "0px 3px 1px rgba(255, 8, 157, 0.6)" : null,
                clipPath: "inset(0px 1px -5px 1px)",
            }}
        >
            {props.children}
        </Box>
    );
}