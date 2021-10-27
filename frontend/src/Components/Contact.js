import React from 'react';
import { withStyles } from '@material-ui/styles';
import CircularProgress from "@material-ui/core/CircularProgress";

import {Box, Paper, TextField, Typography, Button, Fade} from "@material-ui/core";



const styles = ({
    root: {
        display:"flex",
        flexDirection:"column",
        marginLeft:"auto",
        marginRight: "auto",
        height:"auto",
        width: "100%",
        alignItems:"center",
        backgroundColor:"white",
        marginTop: "10vh", 
    },

    header: {
        color: "white",
        fontSize:18,
        fontWeight: 600,
        backgroundColor:"#E75480",
        width:"100%",
        padding: "1vw",
        display:"flex",
        flexGrow: 1,
    },

    content: {
        display:"flex",
        flexDirection:"column",
        padding: "2.5vw",
        gap:"1.5vh",
    },
    subject: {
        minWidth:"25vw",
        fontSize: 13,
    },

    nameContactContainer: {
        display:'flex',
        gap:"1.5vh",
        flexGrow: 1,
    },
    nameContact:{
        display:"flex",
        flexGrow: 1,
        fontSize:13,
    },
    message: {
        fontSize:13,
    }
});


class Contact extends React.Component{

    constructor(props)
    {
        super(props);

        this.state = {
            email: null,
            subject: null,
            name: null,
            message: null,
            error: null,
            success: null,
            loading: false,
            
        };
    }   
    initializeEmail = () => {
        this.setState({loading: true}, this.sendEmail);
    }

    sendEmail = async() => {
        const {email, subject, name, message} = this.state;

        const emailMessage = {
            message: (message) ? message : "",
            subject: (subject) ? subject : "",
            name : (name) ? name : "",
            email : (email) ? email : "",
        };

        const headers = {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(emailMessage),
        };


        fetch("/api/Contact", headers)
        .then(res => {
            if( res.ok)
            {
                this.setState({success:"Successfully sent! Ill get back to you soon :)", loading:false, error: null});
                return;
            }

             this.setState({error: "Error sending Email", success: null, loading: false});
        })
        .catch((err) => this.setState({error: err.message, loading: false}));

    }

    setEmail = (event) => {
        this.setState({email: event.target.value});
    }

    setName = (event) => {
        this.setState({name: event.target.value});
    }

    setSubject = (event) => {
        this.setState({subject: event.target.value});
    }

    setMessage = (event) => {
        this.setState({message: event.target.value});
    }

    render(){

        const {
            name,
            subject,
            email,
            message, 
            error,
            success,
            loading,

        } = this.state;

        const {classes}  = this.props;

        return(
            <Paper className={classes.root} square={true}>
                <Box className={classes.header}>
                     Contact Me
                </Box>
                <Box className={classes.content}> 
                    {!error && !success && <Typography style={{fontSize: 13}}>Leave me a message and I will get back to you soon!</Typography>}
                    {error && <Typography style={{fontSize: 13, color:"red"}}>{error}</Typography> } 
                    {!error &&  <Fade in={success}>
                                        <Typography style={{fontSize: 13, color:"green"}}>{success}
                                        </Typography>
                                </Fade>}
                    {loading && <CircularProgress style={{marginLeft:"auto", marginRight:"auto"}}/>}
                    {!success && !loading && 
                    <>
                    <Box className={classes.nameContactContainer}>
                        <TextField 
                                label="Name"
                                variant="filled"
                                value={(name) ? name : ""}
                                onChange={this.setName}
                                InputProps={{
                                    className: classes.nameContact,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                size="small"
                        />
                        <TextField
                                label="Email"
                                variant="filled"
                                value={(email) ? email : ""}
                                onChange={this.setEmail}
                                InputProps={{
                                    className: classes.nameContact,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                size="small"
                        />
                    </Box>
                   <TextField
                        label="Subject"
                        variant="filled"
                        value={(subject) ? subject : ""}
                        onChange={this.setSubject}
                        InputProps={{
                            className: classes.subject,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        size="small"
                    />
                   <TextField 
                        label="Message" 
                        variant="outlined"
                        value={(message) ? message : ""}
                        onChange={this.setMessage}
                        multiline
                        rows={8}
                        size="small"
                        InputProps={{
                            className: classes.message,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                   />
                   <Button variant="outlined" style={{color:"#E75480", borderColor: "#E75480"}} onClick={this.initializeEmail}> 
                        Send
                   </Button>
                    </>
                    }
                </Box>
            </Paper>
        );
    }
}

export default withStyles(styles)(Contact);