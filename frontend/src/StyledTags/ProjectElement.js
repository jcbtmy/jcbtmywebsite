import React from 'react';

import { Box, Collapse } from "@material-ui/core";
import { withStyles } from '@material-ui/styles';
import  IconButton from "@material-ui/core/IconButton";
import  Typography  from "@material-ui/core/Typography";
import  CodeIcon from "@material-ui/icons/Code";
import { ExpandMore } from '@material-ui/icons';
import  Tooltip from "@material-ui/core/Tooltip";
import  GitHub  from "@material-ui/icons/GitHub";
import { grey, purple } from '@material-ui/core/colors';

import {Prism  as SyntaxHighlighter} from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

import Body from "./Body";
import Element from "./Element";




const styles = ({

    elementHead : {
        display: "flex",
        width: "100%",
        alignItems: "center",
        flexWrap: 'wrap',
        borderBottom: "1px solid purple",
    },

    buttons : {
        display:"flex",
        marginLeft : "auto",
    },

    codeIcon : {
        color: purple[700],
    },

    elementWindow : {
        zIndex: 6, 
        position:"relative"
    },

    title : {
        fontWeight: 700, 
        color: purple[700],
    },

    libs: {
        display: "flex",
        gap: ".3vw", 
        flexWrap:"wrap",
    },

    libChild : {
       backgroundColor: grey[200],
       padding: "0.2em 1em 0.2em 1em",
       borderRadius: 15,
       alignItems:"center",
    },

});

class ProjectElement extends React.Component{

    constructor(props)
    {
        super(props);

        this.state = {
            showCode : false,
            code: null,
        }
    }

    componentDidMount(){
        fetch(this.props.project.src)
            .then((res) => {
                if(res.ok)
                {
                    return res.blob();
                }
            })
            .then((res) => {
                res.text().then((text) => this.setState({code:text}));
            })
            .catch((error) => console.log(error));
    }

    codeIconClick = (e) => {
        this.setState((prevState) => ({showCode: !prevState.showCode}));
    }

    render(){

        const {project, classes} = this.props;
        const {showCode, code} = this.state;

        return(
            <Element>
                <Box className={classes.elementHead}>
                    <Typography variant="h5" className={classes.title}>
                        {project.title}
                    </Typography>
                    <Box className={classes.buttons}>
                        <IconButton 
                            onClick={this.codeIconClick}    
                        >
                            <Tooltip title="See Code">
                                <CodeIcon  fontSize="small" className={classes.codeIcon} />
                            </Tooltip>
                        </IconButton>
                        <IconButton>
                            <Tooltip title="See Github">
                                <GitHub fontSize="small" />
                            </Tooltip>
                        </IconButton>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" style={{gap: ".5vh"}}>
                    {   project.libs && <Typography><b>Built With</b></Typography>}
                        {   project.libs && 
                             <Box className={classes.libs}>
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
                <Body>
                    {project.body}
                </Body>
                <Box className={classes.elementWindow}>
                    <Collapse in={!showCode}>
                            {project.component}
                    </Collapse>
                    <Collapse in={showCode} unmountOnExit={false}>
                            <Box display="flex" flexDirection="column">

                                <IconButton onClick={this.codeIconClick} size="small" className={classes.buttons}>
                                    <Tooltip title="Hide Code">
                                        <ExpandMore />
                                        </Tooltip>
                                </IconButton>
                                        
                                {code && 
                                
                                <SyntaxHighlighter 
                                    language="javascript" 
                                    style={tomorrow}
                                    showLineNumbers
                                    customStyle={{
                                        maxHeight: "45vh",
                                    }}
                                >
                                    {code}
                                </SyntaxHighlighter>
                                }
                            </Box>  
                    </Collapse>
                </Box>
                    
            </Element>
        );
    }
}


export default withStyles(styles)(ProjectElement);