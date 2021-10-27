import { withStyles, Card, Box, Typography, Tooltip} from "@material-ui/core";
import {Link} from "react-router-dom";
import { GitHub, OpenInNew } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
import React from "react";



const styles = ({

    card: {
        minHeight: "37vh", 
        width:"17vw",
        padding: "1.2vw",
        transition: ".3s ease-in-out",
        position:"relative",
        border: "1px solid transparent",
        "&:hover": {
            borderColor: "#E75480",
            transform: "translateY(-3px)",
            boxShadow: '0 10px 5px -6px gray',          
        },
    },

    picture: {
        borderRadius:3,
        float:"right",
        align: "top",
        margin: ".3vw",

    },

    links : {
        color: "black", 
        fontSize: "20px",
        "&:hover":{
            color: "#2196f3",
        }
    },

    libs: {
        display: "flex",
        gap: ".3vw", 
        flexWrap:"wrap",
    },

    libChild : {
       padding: "0.2em 1em 0.2em 1em",
       borderRadius: 15,
       fontSize: 11,
       alignItems:"center",
       fontWeight:550,
    },
    
    header: {
        display:"flex",
        marginBottom:"3vh",
    },

    footer: {
        display:"flex",
        gap: "1vw",
        position:"absolute",
        bottom: "1.2vw",
        textAlign:"center",
    },

    description: {
        fontSize: 13,
        color: grey[700],
    }

});

class ProjectCard extends React.Component{
    
    constructor(props){
        super(props);

        this.state = {
            mouseOver: null,
        }
    }

    onMouseEnter = () => {
        this.setState({mouseOver: true});
    }

    onMouseExit = () => {
        this.setState({mouseOver: false});
    }

    render(){

        const {mouseOver} = this.state;

        const {classes, project} = this.props;

        return(
            <Card 
                className={classes.card}
                square={true}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseExit}
            >
            <Box className={classes.header}>
                <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 24 24" width="30"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
                <Box display="flex" ml="auto" style={{gap: ".5vw"}}>
                    { project.github && 
                    <Tooltip title={project.github}>
                        <Link href={project.github}  underline="hover">
                                <GitHub className={classes.links}/>
                        </Link>
                    </Tooltip>
                    }
                    { project.demo && 
                        <Tooltip title="Demo">
                            <Link to={project.demo}>     
                                <OpenInNew className={classes.links}/>
                            </Link>
                        </Tooltip>
                    }
                </Box>
            </Box>
            <Typography variant="body1" style={{fontWeight: 700 , marginBottom: "1.7vh", color: (mouseOver) ? "#E75480" : "black", fontSize: "16px"}}>{project.title}</Typography>
            <div style={{display:"inline-block", marginBottom: "2vh"}}>
                <p><img className={classes.picture} src={project.thumbnail} width="76" height="auto" alt={project.title}/></p>
                <p className={classes.description}>
                      {project.description}
                </p>
            </div>
                <Box className={classes.footer}>
                        {   project.libs && 
                                <Box className={classes.libs} style={{color: (mouseOver) ?  "#E75480": grey[700]}}>
                                    {
                                        project.libs.map((lib) => (
                
                                            <Box className={classes.libChild}>
                                                {lib}
                                            </Box>
                                        
                                        ))
                                    }
                                </Box>
                            }
                </Box>
            </Card>
        );
    }
}


export default withStyles(styles)(ProjectCard);