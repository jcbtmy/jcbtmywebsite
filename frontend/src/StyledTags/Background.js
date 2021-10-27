import React from 'react';
import { withStyles } from '@material-ui/styles';
import {Box } from '@material-ui/core';




const styles = ({
    root: {
            zIndex: 999,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width:"100%",
            overflow:"hidden",
    },
    svg: {
        backgroundColor: "primary",
        position: "fixed",
        zIndex: 7,  
    }
})

class Background extends React.Component{

    constructor(props)
    {
        super(props);

        this.step = 10;

        this.state = {
            nodes: null,
            map: this.createMap(),
            running: false,

        };
    }

    createMap = () => {

        const step = this.step;

        const {innerWidth : width, innerHeight: height} = window;


        const xMapSize = Math.floor(width  / step);
        const yMapSize = Math.floor(height / step);
    
        this.xMapSize = xMapSize;
        this.yMapSize = yMapSize;
        this.origin = {x: width / 2, y: height / 2};

        const map = new Array(xMapSize + 1);

        for(let i = 0; i < map.length; i++)
        {
            map[i] = new Array(yMapSize + 1);

            for(let j = 0; j < map[i].length; j++)
            {
               map[i][j] = false;
            }

        }

        return map;
    }

    componentDidMount()
    {

        const step = this.step;
        const {innerWidth : width, innerHeight: height} = window;
        
        let nodes = [];
        const origin = this.origin;
        let map = JSON.parse(JSON.stringify(this.state.map));


        for(let i = 0; i < 150; i++)
        {
            const xrand = Math.floor(Math.random() * width);
            const yrand = Math.floor(Math.random() * height);
            
            const x_pos = xrand - (xrand % step);
            const y_pos = yrand - (yrand % step);

            const xMapPos = Number(Math.floor(x_pos / step));
            const yMapPos = Number(Math.floor(y_pos/ step));

            if( map[xMapPos][yMapPos] === true)
            {
                i--;
                continue;
            }

            const rgb = this.rect2rgb((x_pos - origin.x) / origin.x , (y_pos - origin.y) / origin.y);
            
            const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

            nodes.push({x: x_pos, y: y_pos, color: color});

            map[xMapPos][yMapPos] = true;
           
        }

        this.setState({nodes: nodes, map: map}, (this.props.showAutomata) ? this.updateEvent : null);
    }   

    componentDidUpdate(prevProps)
    {
        if(this.props !== prevProps)
        {
            this.props.showAutomata && this.updateEvent();
        }
    }

    updateEvent = async() => {

        const yMapSize = this.yMapSize;
        const xMapSize = this.xMapSize;
        const origin = this.origin;
        const step = this.step;

        const contextThis = this;


        setTimeout(function(){

            contextThis.setState((state) => {
               
                let newUnexplored = [];

                let nodes = [...state.nodes];
                let newMap = [...state.map].map((row) => [...row]);

                const results = nodes.filter((node) => {

                    let neighbors = 0;

                    for(let i = -1; i <=1 ; i++)
                    {
                        for(let j = -1; j <=1 ; j++)
                        {
                            if(i === 0 && j === 0)
                                continue;

                            const xMapPos = Math.floor(node.x / step) + i;
                            const yMapPos = Math.floor(node.y / step) + j;

                            if(xMapPos >= 0 && yMapPos >= 0 && yMapPos <= yMapSize && xMapPos <= xMapSize)
                            {
                                if(state.map[xMapPos][yMapPos] === true)
                                {
                                    neighbors++;
                                }
                                else{

                                    if(!newUnexplored.find((item) => item.x === xMapPos *step && item.y === yMapPos * step )){
                                        newUnexplored.push({x: xMapPos * step , y: yMapPos * step});
                                    }
                                }
                            }
                        }
                    }

                    if(neighbors >= 4)
                    {
                        newMap[Math.floor(node.x / step)][Math.floor(node.y / step)] = false;
                        return false;
                    }
                    else if( neighbors >= 2) 
                    {
                        return true;
                    }
                    else{
                        newMap[Math.floor(node.x / step)][Math.floor(node.y / step)] = false;
                        return false;
                    }

                });

                let explored = newUnexplored.filter((node,index, arr) => {

                    let neighbors = 0;

                    for(let i = -1; i <=1 ; i++)
                    {
                        for(let j = -1; j <=1 ; j++)
                        {
                            if( i === 0 && j === 0)
                                continue;

                            const xMapPos = Math.floor( node.x / step) + i;
                            const yMapPos = Math.floor( node.y / step) + j;

                            if(xMapPos >= 0 && yMapPos >= 0 && yMapPos <= yMapSize && xMapPos <= xMapSize)
                            {
                                if(state.map[xMapPos][yMapPos] === true)
                                {
                                    neighbors++;
                                }
                            }
                        }
                    }

                    if(neighbors >= 4)
                    {
                        newMap[Math.floor(node.x / step)][Math.floor(node.y / step)] = false;
                        return false;
                    }
                    else if( neighbors >= 2 ) 
                    {
                        const rgb = contextThis.rect2rgb(((node.x) - origin.x) / origin.x , ((node.y) - origin.y) / origin.y);
            
                        const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

                        arr[index].color = color;

                        newMap[Math.floor(node.x / step)][Math.floor(node.y / step)] = true;

                        return true;
                    }
                    else{

                        newMap[Math.floor(node.x / step)][Math.floor(node.y / step)] = false;
                        return false;
                    }
                });

                let allNodes = results.concat(explored);

                return ({map: newMap, nodes: allNodes});
                

            }, (contextThis.props.showAutomata) ? contextThis.updateEvent : null);
        },
        700 );
    }


    rad2deg(rad)
    {
        return (360 + 180 * rad / Math.PI) % 360;
    }

    hsv2rgb(hue, saturation, value)
    {
        hue /= 60;

        let chroma = value * saturation;
        let x = chroma * (1 - Math.abs((hue%2) - 1));

        let rgb =   hue <= 1 ? [chroma, x ,0]:
                    hue <= 2 ? [x, chroma, 0]:
                    hue <= 3 ? [0, chroma, x]:
                    hue <= 4 ? [0, x, chroma]:
                    hue <= 5 ? [x, 0, chroma]:
                               [chroma, 0, x];

        return rgb.map(v => (v + value - chroma)* 255); 
    }

    rect2rgb(x, y)
    {
        let magnitude = Math.sqrt(x*x + y*y);
        let hsv = [this.rad2deg(Math.atan(y,x)), magnitude, 1];
        let rgb = this.hsv2rgb(...hsv).map(Math.round);

        return rgb;
    }

    renderMap = (node, map) =>{

        const step = this.step;

        const renderItems = [<circle cx={node.x} cy={node.y} r="4" fill={node.color}/>];

        const xMapPos = Math.floor(node.x / step);
        const yMapPos = Math.floor(node.y / step);

        for(let i = -1 ; i <= 1; i++)
        {
            for(let j = -1; j <= 1; j++)
            {   
            
                let xIndex = xMapPos + i;
                let yIndex = yMapPos + j;

                if(!i && !j)
                    continue;
                

                if(xIndex >= 0 && yIndex >= 0 &&  xIndex <= this.xMapSize && yIndex <= this.yMapSize && map[xIndex][yIndex] === true)
                {
                    const destX = (xMapPos + i) * step;
                    const destY = (yMapPos + j) * step;
                    renderItems.push(<line x1={node.x} y1={node.y} x2={destX} y2={destY} stroke={node.color} strokeWidth={2}/>)
                }
            }
        }

        return renderItems;
    }   

    render () {
        const {classes, children} = this.props;

        const {nodes, map} = this.state;

        return(
            <Box bgcolor="background" className={classes.root}>
                {children}
                <svg height="100vh" width="100vw" className={classes.svg}>
                    { 
                        nodes && map && 
                        nodes.map((node) =>  this.renderMap(node, map))
                    }
                </svg>
            </Box>
        )

    }
}

export default withStyles(styles)(Background);