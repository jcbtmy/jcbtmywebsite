import { render } from "react-dom";

var renderNodes = null;
var map = null;

var xMapSize = 0;
var yMapSize = 0;


function rad2deg(rad)
{
    return (360 + 180 * rad / Math.PI) % 360;
}

function hsv2rgb(hue, saturation, value)
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

function rect2rgb(x, y)
{
    let magnitude = Math.sqrt(x*x + y*y);


    let hsv = [rad2deg(Math.atan(y,x)), magnitude, 1];
    let rgb = hsv2rgb(...hsv).map(Math.round);

    return rgb;
}


function createMap(){

    const {innerWidth : width, innerHeight: height} = window;

    xMapSize = Math.floor(width  / 50);
    yMapSize = Math.floor(height / 50);

    
    origin = {x: width / 2, y: height /2};

    const tempMap = new Array(xMapSize + 1);

    for(let i = 0; i < map.length; i++)
    {
        tempMap[i] = new Array(yMapSize + 1);

        for(let j = 0; j < map[i].length; j++)
        {
           tempMap[i][j] = false;
        }

    }

    return tempMap;
}


function updateEvent(){

    const newMap = [...map];
    const newUnexplored = [];

    const ns = [...renderNodes]
    const nodes = ns.filter((node) => {

        let neighbors = 0;

        for(let i = -1; i <=1 ; i++)
        {
            for(let j = -1; j <=1 ; j++)
            {
                if(!i && !j)
                    continue;

                const xMapPos = (node.x / 50) + i;
                const yMapPos = (node.y / 50) + j;

                if(xMapPos >= 0 && yMapPos >= 0 && yMapPos <= yMapSize && xMapPos <= xMapSize)
                {
                    if(map[xMapPos][yMapPos])
                    {
                        neighbors++;
                    }
                    else{
                    
                        const rgb = rect2rgb(((xMapPos*50) - origin.x) / origin.x , ((yMapPos*50) - origin.y) / origin.y);

                        const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

                        newUnexplored.push({x: xMapPos * 50 , y: yMapPos * 50, color: color});
                    }
                }
            }
        }

        if(neighbors >= 4)
        {
            newMap[node.x / 50][node.y / 50] = false;
            return false;
        }
        else if( neighbors >= 1) 
        {
            return true;
        }
        else{
            newMap[node.x / 50][node.y / 50] = false;
            return false;
        }

    });


    const explored = newUnexplored.filter((node) => {

        let neighbors = 0;

        for(let i = -1; i <=1 ; i++)
        {
            for(let j = -1; j <=1 ; j++)
            {
                if(!i && !j)
                    continue;

                const xMapPos = (node.x / 50 ) + i;
                const yMapPos = ( node.y / 50) + j;

                if(xMapPos >= 0 && yMapPos >= 0 && yMapPos <= yMapSize && xMapPos <= xMapSize)
                {
                    if(map[xMapPos][yMapPos])
                    {
                        neighbors++;
                    }
                }
            }
        }

        if(neighbors >= 4)
        {
            newMap[node.x / 50][node.y / 50] = false;
            return false;
        }
        else if( neighbors >= 1 ) 
        {
            newMap[node.x / 50][node.y / 50] = true;
            return true;
        }
        else{
            newMap[node.x / 50][node.y / 50] = false;
            return false;
        }
    });


    nodes.concat([explored]);

    renderNodes = nodes;
    map = newMap;
}



function init() {

    const {innerWidth : width, innerHeight: height} = window;
    const xMapSize = Math.floor(width  / 50);
    const yMapSize = Math.floor(height / 50);
    const step = 50;
    const nodes = [];


    for(let i = 0; i < 150; i++)
    {
        const xrand = Math.floor(Math.random() * width);
        const yrand = Math.floor(Math.random() * height);
        
        const x_pos = xrand - (xrand % step);
        const y_pos = yrand - (yrand % step);

        const xMapPos = Number(Math.floor(x_pos / 50));
        const yMapPos = Number(Math.floor(y_pos/ 50));

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
}



function render(){
    const element =  document.getElementById("background");
}


map = createMap();

init();


render();