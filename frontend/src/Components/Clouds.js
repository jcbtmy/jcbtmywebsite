import React from 'react';
import Box from "@material-ui/core/Box";
import { withStyles } from '@material-ui/core';



const styles = (theme) => ({
    root :{
        backgroundRepeat: "no-repeat",
	    backgroundImage: "linear-gradient( #87cefa, #ffffff)",
        borderRadius: 3,  
        overflow: "hidden", 
        position: "relative", 
        height: "100vh",
    }
});


class CloudComponent extends React.Component{


    componentDidMount()
    {
        const exists = document.getElementById("cloud");

        if(exists){
            window.startClouds();
            return;
        }

        
        const script = document.createElement("script");
        script.src = "/src/clouds.js";
        script.async = false;
        script.id = "cloud";
        document.body.appendChild(script);
    }

    render(){

        const {classes} = this.props;

        return(
            <Box 
                id="cloud-container" 
                width={1} 
                height={1} 
                className={classes.root}
            >
            </Box>
        );
    }
}

export default withStyles(styles)(CloudComponent);