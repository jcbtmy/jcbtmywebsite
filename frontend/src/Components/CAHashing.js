import React from 'react';
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { withStyles } from '@material-ui/styles';
import { Button, TextField, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = ({
    root: {
        display:"flex",
        flexDirection: "column",
        gap: "1vh",
        margin: "10vh",
    },
    hashChild: {
        padding: "1em",
        display:"flex",
        flexDirection:"column",
        gap: "1vh",
    },
    hashImg:{
        overflowY:"scroll",
        maxHeight: 300,
    },

    hashText: {
        fontSize: "13px", 
        color:"green",
    },

    rulesContainer: {
        display:"flex",
        flexDirection:"row",
        flexWrap:"wrap",
        marginBottom: "2vh",
    },

    rule: {
        border: "1px solid black",
        width:"2vh",
        height: "2vh"
    },

    ruleSetText: {
        fontSize: "17px",
        color: "grey",
        width: "100%",
    },
});


class CAHashing extends React.Component{
    constructor(props)
    {
        super(props);

        this.state = {
            hashData: null,
            input: null,
            rules: null,
            iterations: null,
            loading: false,
        };
    }

    componentDidMount(){
        fetch("api/CAHashing/Rule/")
        .then((res) => {
            if(res.ok)
            {
                return res.json();
            }

            res.json().then((err) => console.log(err));
        })
        .then((data) => {
            if(data)
                this.setState({rules: data});
        })
        .catch((err) => console.log(err));

    }

    setInput = (event) => {
        this.setState({input: event.target.value});
    }

    setIterations = (event) => {
        const number = Number(event.target.value);

        if(Number.isInteger(number) && number > 0)
        {
            this.setState({iterations: number});
        }       
        else
        {
            this.setState({iterations: null});
        }
    }

    submitHash = () => {
        const {input, iterations} = this.state;

        if(!input || !iterations || iterations <= 0)
        {
            return;
        }

        this.setState({loading: true}, this.fetchHash);
    }
    fetchHash = () => {

        const {input, iterations} = this.state;

        fetch(`api/CAHashing/?input=${input}&iterations=${iterations}`)
        .then((res) => {
            if(res.ok)
            {
                return res.json();
            }
            res.json().then((err) => console.log(err));
        })
        .then((data) => {
            if(data)
                this.setState({hashData: data, loading: false});
        })
        .catch(err => console.log(err)); 
    }


    getRules = (ruleNumber) =>{

        let ruleSet;

        this.state.rules.forEach((rule) => {
            if(ruleNumber === rule.ruleNumber)
            {
                ruleSet = rule.ruleSet.map((r) => {
                    return (
                        <Box padding={1} display="flex" width="auto" flexDirection="column">
                            <Box display="flex" flexDirection="row"  width="auto">
                                <Box className={this.props.classes.rule} bgcolor={(r[0]) ? "black" : "white"}></Box>
                                <Box className={this.props.classes.rule} bgcolor={(r[1]) ? "black" : "white"}></Box>
                                <Box className={this.props.classes.rule} bgcolor={(r[2]) ? "black" : "white"}></Box>
                            </Box>
                            <Box display="flex"  width="auto">
                                <Box width="2vh" height="2vh"></Box>
                                <Box className={this.props.classes.rule} bgcolor={(r[3]) ? "black" : "white"}></Box>
                                <Box width="2vh" height="2vh"></Box>     
                            </Box>
                        </Box>
                    );
                })
            }
        });

        return ruleSet;

    }


    render(){

        const {hashData, input, iterations, loading, rules} = this.state;
        const {classes} = this.props;

        return (
            <Box className={classes.root}>
                <Typography variant="h4">Cellular Automata Hashing</Typography>
                <Box display="flex"
                    style={{gap: "1vw"}}
                    alignItems="center"
                >
                    <TextField
                        label="Input To Hash"
                        width="30vw"
                        variant="outlined"
                        value={input ? input : ""}
                        onChange={this.setInput}
                    />
                    <TextField
                        label="Iterations"
                        style={{width: "6vw"}}
                        variant="outlined"
                        value={iterations ? iterations : ""}
                        onChange={this.setIterations}
                    />
                    <Button 
                        variant="contained"
                        color="primary"
                        style={{display:"flex", alignSelf:"stretch"}}
                        onClick={this.submitHash}
                    >
                        Hash
                    </Button>
                </Box>
                {(loading || (hashData && rules)) &&
                    <Card className={classes.hashChild}>

                        {loading && <CircularProgress size={75} style={{marginLeft: "auto", marginRight:"auto"}}/>}
                        {   hashData && 
                            hashData.map((hash) => {
                                return (
                                    <Box my={2}>
                                        <Typography variant="h6">
                                            <b style={{borderBottom:"1px solid black"}}>Rule Number: {hash.ruleNumber}</b>
                                        </Typography>
                                        <Box className={classes.rulesContainer}>
                                            <div className={classes.ruleSetText}>Rule Set:</div>
                                            {
                                                this.getRules(hash.ruleNumber)
                                            }
                                        </Box>
                                        <Typography><b>Output</b>: <div className={classes.hashText}>{hash.outputHash.toLowerCase()}</div></Typography>
                                        <Typography variant="body1"><b>Hashing produced image</b></Typography>
                                        <Box className={classes.hashImg}>
                                            <img    style={{width: 256, height: hash.iterations}} 
                                                    src={`data:image/png;base64,${hash.imageData}`}
                                                    alt={hash.outputHash}
                                            />
                                        </Box>
                                    </Box>
                                );
                            })
                        }
                    </Card>
                }
            </Box>
        );
    }
}

export default withStyles(styles)(CAHashing);
