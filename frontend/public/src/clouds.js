

const addListeners = (cloudAnim, element) => {

    cloudAnim.addEventListener('finish', function (e) {

        let anim = addAnimation(element);

        addListeners(anim, element);

    }, false);
}

const randomNumber = (max, min) => {
    return Math.floor((Math.random() * (max - min)) + min);
}

const addAnimation = (ele) => {


    const cloudContainer = document.getElementById("cloud-container");

    if(!cloudContainer)
        return;

    const width = cloudContainer.clientWidth;
    const height = cloudContainer.clientHeight;
    
    const top = Math.floor((Math.random() * height));
    ele.style.top = top  + "px";


    let anim = ele.animate([
        { transform: 'translate(0px)', opacity: 0 },
        { opacity: 1},
        { transform: 'translate( -' + (width + 300) + 'px)', opacity: 0}
    ],
        {
            duration: randomNumber(width*1.5, width * 2) * 10,
            iterations: 1,
            easing: "linear",
            delay: randomNumber(0, width * 2) * 20,
        });
    return anim;
}

const start = () => {

    const cloudContainer = document.getElementById("cloud-container");

    for (let i = 1; i <= 40; i++) {

        let cloudDiv = document.createElement("div");

        let image = document.createElement("img");

        cloudDiv.style.width = "auto";
        cloudDiv.style.right =  "-250px";
        cloudDiv.style.position = "absolute";
        cloudDiv.style.opacity = 0;
        cloudDiv.style.height = "auto";

        let cloud_counter = ( (i % 12) !== 0) ? i % 12 : 1;

        image.src = "/images/Clouds/Cloud" + cloud_counter + ".png";

        cloudDiv.appendChild(image);

        cloudDiv.setAttribute("class", "cloud");

        let cloudAnim = addAnimation(cloudDiv);

        addListeners(cloudAnim, cloudDiv);

        cloudContainer.appendChild(cloudDiv);

    }
}

start();

window.startClouds = start;