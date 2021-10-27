import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import Box from "@material-ui/core/Box";

import PythonLogo from "../images/Python_logo_and_wordmark.svg";

import MongoLogo from "../images/MongoDB_Logo.svg.png";

import ReactLogo from  "../images/React_logo_wordmark.png";

import JenkinsLogo from "../images/jenkins-logo.png";

import DockerLogo from "../images/docker-logo.png";

import CSharpLogo from "../images/csharp.svg";

import SQLServer from "../images/microsoft-sql-server-logo.svg";

import NodeJSLogo from "../images/nodejs-new-pantone-black.svg"

import CLogo from "../images/C_.svg.png";


const useStyles = makeStyles((theme) => ({

    root: {
        display:"flex",
        flexDirection: "column",
        gap: "2vh",
        marginLeft:"auto",
        marginRight:"auto",
    },

    logo: {
        width: "5vw",
        height: "auto",
        position:"absolute",
        margin:"auto",
    },

    section: {
        fontSize: 13,
    },
    
    csharpLogo: {
        width:"3vw",
        height: "auto",
        position:"absolute",
        margin:"auto",
    },

    jenkinsLogo: {
        width:"3vw",
        height: "auto",
        position:"absolute",
        margin:"auto",
    },
}));

function getImageLayout(logos){

    const height = (window.innerHeight / 100);
    const offsetY = (window.innerHeight / 4);
    const width = (window.innerWidth / 100) * 70;
    const offsetX = (width / 5);
    let radius = (Math.sqrt(Math.pow(width,2) + Math.pow(height,2)) / (logos.length - 1));
    let ang = 360 / (logos.length);

    return logos.map((logo, index) => {
        if(index === 0)
           return <img className={logo.className} src={logo.src} style={{top: offsetY, left: offsetX}}  alt={logo.alt}/>

        let angle = ang * index;
        let x = radius * Math.sin(Math.PI * 2 * angle / 360);
        let y = radius * Math.cos(Math.PI * 2 * angle / 360);
        return <img className={logo.className} src={logo.src} style={{top: y + offsetY, left: x + offsetX}} alt={logo.alt}/>
    })


    
}


const About = React.forwardRef((props, ref) =>
{
    const classes = useStyles();   

    const logos = [ 
                    {src: PythonLogo, className: classes.logo, alt: "python"},
                    {src: JenkinsLogo, className: classes.jenkinsLogo, alt: "jenkins"},
                    {src: DockerLogo, className: classes.logo, alt: "docker"},
                    {src: CSharpLogo, className:classes.csharpLogo, alt:"Csharp"},
                    {src: MongoLogo, className: classes.logo, alt: "mongodb"},
                    {src: ReactLogo, className: classes.logo, alt: "react"},
                    {src: SQLServer, className: classes.logo, alt: "sqlserver"},
                    {src: NodeJSLogo, className: classes.logo, alt: "nodejs"},
                    {src: CLogo, className: classes.logo, alt: "c"}
                ];

    return (
        <Box 
            className={classes.root} 
            width={1} 
            minHeight="100vh" 
            padding={6}
            pb={10}
            pt={0}
            ref={ref}
        >
            <Box width="35vw" display="flex" mt="2vh" flexDirection="column"> 
                <Typography variant="h3" style={{marginBottom: "2vh", paddingTop: "5vh", color: "#E75480", fontWeight: 800}}>Hello!</Typography>
                <Typography variant="body1" className={classes.section}>
                    My name is Jacob and I currently live in San Diego, California. In my free time I enjoy programming, surfing, and skateboarding.
                    I got my first taste of writing code when I was 17, doing my calculus homework in the Wolfram Alpha programming language. 
                    From there I majored in computer science at the University of Colorado Boulder. Now I work as an applications engineer,
                    building data capture systems for lean manufacturing. Thanks for coming to check out my website, I hope you like what I have to offer :)
                </Typography>
            </Box>
            <Box width={1}>
                <Typography variant="body1" className={classes.section} ><b>Technical skills</b> include but not limited to...</Typography>
                <Box width={1} position="relative">
                   {
                       getImageLayout(logos)
                   }
                </Box>
            </Box> 
        </Box>
    );
});

export default About;