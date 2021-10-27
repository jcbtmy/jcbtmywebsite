import { 
        makeStyles, 
        createTheme,
        Box,
        ThemeProvider,
        Typography,
        responsiveFontSizes,
        IconButton,
        Tooltip,
        Fade,
        Button,
        Link
        } from "@material-ui/core";


        
import CssBaseline from "@material-ui/core/CssBaseline";

import { GitHub, ExpandMore, LinkedIn, } from "@material-ui/icons";

import {Nav, NavTab, NavTabs} from "./StyledTags/Nav";

import Footer from "./StyledTags/Footer";


import {ProjectList} from "./ProjectList";


import React from "react";


import Resume from "./Components/Resume";
import About from "./Components/About";
import ProjectCard from "./StyledTags/ProjectCard";
import Contact from "./Components/Contact"


let theme = createTheme({

  palette : {
    primary: {
      main: "#2196f3",
    }
  },


});

theme = responsiveFontSizes(theme);

const useStyles = makeStyles((theme) => ({
    display: {
      display : "flex",
      flexDirection: "column",
      minWidth: "70vw",
      width: "70vw",
      height: "auto",
      marginTop : "10vh",
      gap:"3vh",
      zIndex: 8,
      marginBottom: "1vh",
      marginLeft:"auto",
      marginRight:"auto",
    },

    name: {
      marginLeft: "5vw",
      fontWeight: 600,
    },

    aboutMe: {
      display:"flex",
      flexDirection:"column",
      alignItems: "center",
      color:"grey",
      marginBottom: "20vh",
      textTransform:"none",
      borderColor: "#E75480",
      width:"10vw",
      marginLeft:"auto",
      marginRight: "auto",
      marginTop: "auto",
    },

}));




function Display(props) {

  const classes= useStyles();

  return(
    <Box className={classes.display}>
      {props.children}
    </Box>
  );
}

function GoToButton(props)
{
  const classes = useStyles();

  return(
    <Button className={classes.aboutMe} onClick={props.onClick} variant="outlined">
      <Box style={{textTransform: "none", color: "#E75480"}}>
        {props.children}
      </Box>
      <ExpandMore style={{color:"#E75480"}} />
    </Button>
  )
}


class UserInterface extends React.Component {

  constructor(props){
      super(props);

      this.state = {
        backgroundOn: false,  
        page: null,
        transform: null,
      }

      this.aboutRef = React.createRef();
      this.projectRef = React.createRef();
      this.homeRef = React.createRef();
      this.resumeRef = React.createRef();
      this.contactRef = React.createRef();
  }


  setPage = (index) => {
    this.setState({page: index, backgroundOn: false});
    
    switch(index){
      case 0:
        window.scrollTo({behavior:"smooth", top: this.aboutRef.current.offsetTop});
        break;

      case 1:
        window.scrollTo({ behavior: 'smooth', top: this.projectRef.current.offsetTop });
        break;
      
      case 2:
        window.scrollTo({ behavior: 'smooth', top: this.resumeRef.current.offsetTop });
        break;
      
      case 3:
        window.scrollTo({ behavior: 'smooth', top: this.contactRef.current.offsetTop});
        break;

      default:
        break;

    }
  }

  render(){

    const {page, transform}  = this.state;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />     
          <Nav>
              <NavTabs>
                <NavTab 
                    isPage={(page === 0)}
                    onClick={() => this.setPage(0)}
                  >
                    <div>About</div>
                </NavTab>
                <NavTab 
                  isPage={(page === 1)}
                  onClick={() => this.setPage(1)}
                >
                  <div>Projects</div>
                </NavTab>
                <NavTab 
                  isPage={(page === 2)}
                  onClick={() => this.setPage(2)}
                >
                  <div variant="h6">Resume</div>
                </NavTab>
                <NavTab
                  isPage={(page === 3)}
                  onClick={() => this.setPage(3)}
                >
                  <div>Contact</div>
                </NavTab>
              </NavTabs>
              <Tooltip title="Github Account">
                <IconButton>
                    <GitHub />
                </IconButton>
              </Tooltip>               
          </Nav>
          <Box width={1} height="100%" overflow="hidden">
            <Fade
              mountOnEnter
              unmountOnExit
              timeout={{ enter: 900, exit: 500 }}
              in={true}
            >
              <Box minHeight="115vh" display="flex" flexDirection="column" ref={this.homeRef} style={{gap:"1.5vh"}}>
                <Typography variant="h2" style={{marginLeft: "5vw", marginTop: "30vh", fontWeight: 800, display:"inline-block"}}>
                  Jacob Toomey 
                </Typography>
                <Typography variant="h6" style={{marginLeft: "5vw", fontWeight: 800, color: "#E75480"}}>Applications Engineer</Typography>
                <Typography variant="body1" style={{marginLeft: "5vw", fontWeight: 550}}>Solving human problems with technical solutions</Typography>
                <GoToButton onClick={() => this.setPage(0)}>
                  About Me
                </GoToButton>
              </Box>
            </Fade>
              <Display>
                    <Box minHeight="115vh" display="flex" flexDirection="column" mx="auto" ref={this.aboutRef}>
                      <About />
                      <GoToButton onClick={() => this.setPage(1)}>
                        Projects
                      </GoToButton>
                    </Box>
                    <Box minHeight="115vh" display="flex" flexDirection="column" ref={this.projectRef} position="relative" >
                      <Typography variant="h3" style={{marginTop: "7vh", fontWeight: 800, color:"#E75480", marginLeft: "14vw"}}>Projects</Typography>
                      <Box
                        width={1} minHeight="100vh" mb="4vh" display="flex" flexWrap="wrap" style={{gap: "1vw", justifyContent:"center", padding:"6vh",}}>
                        {
                          ProjectList.map((project, index) => <ProjectCard transform={transform} index={index} key={index} project={project}/>)
                        }
                      </Box>
                      <GoToButton onClick={() => this.setPage(2)}>
                        Resume
                      </GoToButton>
                    </Box>
                    <Box minHeight="115vh" display="flex" flexDirection="column" position="relative" ref={this.resumeRef}>
                      <Resume />
                      <GoToButton onClick={() => this.setPage(3)}>
                        Contact
                      </GoToButton>
                    </Box>
                    <Box height="auto" style={{gap: "3vh"}}display="flex" flexDirection="column" mx="auto" ref={this.contactRef}>
                        <Contact />
                        <Box display="flex" style={{gap: "1.5vw"}}>
                          <Link href="https://github.com/jcbtmy?tab=repositories">
                            <IconButton>
                              <GitHub style={{color: "#E75480"}}/>
                            </IconButton>
                          </Link>
                          <Link href="https://www.linkedin.com/in/jacob-toomey-722b551b2/">
                            <IconButton>
                              <LinkedIn style={{color: "#E75480"}}/>
                            </IconButton>
                          </Link>
                        </Box>
                    </Box>
              </Display>
          </Box>
        <Footer>
        </Footer>
      </ThemeProvider>
    );
  }
}

export default UserInterface;

