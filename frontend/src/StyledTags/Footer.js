import {makeStyles, Box} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({

    footer : {
        height: "30vh",
        marginTop: "20vh",
        zIndex: 999, 
        position:"absolute"
    },
}));


export default function Footer (props) 
{
    const classes = useStyles();

    return (
        <Box 
            className={classes.footer} 
            width={1}
        >
            {props.children}
        </Box>
    )
}