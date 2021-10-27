import { makeStyles, Paper } from "@material-ui/core";



const useStyles = makeStyles((theme) => ({

    element : {
        padding: "3vh 3vw 3vh 3vw",
        display: "flex",
        flexDirection: "column",
        gap: "2vh",
        zIndex: 9,
        height: "auto",
        maxHeight: "auto",
      },
      

}));


export default function Element(props){
    const classes = useStyles();

    return (
        <Paper width={1}  className={classes.element} square={true}>
            {props.children}
        </Paper>
    );
}