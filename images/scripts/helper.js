import { replacePage } from './stop_continue.js';
// CHANGE THIS PART TO CHANGE WHAT IS BEING DISPLAYED ON THE SCREEN

export const questionDict = {"Niet Zwemmen! Heel gevaarlijk.": ["flags", "frames", "A1-6"],
                             "Pas op met zwemmen! Gevaarlijk.": ["flags", "frames", "C1-6"],
                             "Pas op! Er zitten gevaarlijke dieren of ongedierte in het water.": ["flags", "frames", "D1-6"],
                             "Pas op! Gebruik geen drijfmiddelen.": ["flags", "frames", "E1-6"],
                             "Hier zijn strandwachten.": ["flags", "frames", "F1-6"]};//,
                            //  "Question 6: Preferences B1-8": ["flags", "frames", "B1-8"]};

export const paragraphs = {"Niet Zwemmen! Heel gevaarlijk.": "Het wordt heel erg afgeraden om het water in te gaan.",
                           "Pas op met zwemmen! Gevaarlijk.": "Het wordt afgeraden om het water in te gaan. Wees extra voorzichtig als je toch het water ingaat.",
                           "Pas op! Er zitten gevaarlijke dieren of ongedierte in het water.": "Het wordt afgeraden om het water in te gaan.",
                           "Pas op! Gebruik geen drijfmiddelen.": "De wind blaast van de kust af. Het is niet veilig om het water in te gaan met drijfmiddelen zoals luchtbedden.",
                           "Hier zijn strandwachten.": "De reddingspost is geopend en er wordt toezicht gehouden door strandwachten."}


export const array_names = ["flags", 
                            "frames", 
                            "A1-6", 
                            // "B1-8", 
                            "C1-6", 
                            "D1-6", 
                            "E1-6", 
                            "F1-6"];


export function answersToCsv(iterations) {
    let csv = '';
    csv += 'iteration,category,question,optionLeft,optionRight,chosen,unchosen,timeToClick\n';
    for (let i = 0; i < iterations.length; i++) {
        let iteration = iterations[i];
        let category = iteration.type;
        let question = iteration.question;
        let optionLeft = iteration.optionLeft;
        let optionRight = iteration.optionRight;
        let chosen = iteration.chosen;
        let unchosen = iteration.unchosen;
        let timeToClick = iteration.timeToClick;
        csv += `${i},${category},${question},${optionLeft},${optionRight},${chosen},${unchosen},${timeToClick}\n`;     
    }
    return csv;
}
                            
export let iterations = [];



export function putBackground(source = "images/background/GUI_Background3.png") {
    // Check if there's already a background image
    document.getElementById('bg').innerHTML = '';
    let existingImage = document.getElementById('bg').querySelector('.image-background');

    if (existingImage) {
        // If there's an existing image, update its source
        existingImage.src = source;
    } else {
        // If there's no existing image, create a new one
        // Remove the previous background image (if any)
        document.getElementById('bg').innerHTML = '';

        // Create a new img element 
        let img_background = document.createElement('img');

        // Set the img attributes
        img_background.src = source;
        img_background.className = "image-background";

        // Append the img to the 'bg' element
        document.getElementById('bg').appendChild(img_background);
    }
}


export async function getImages(name) {

let images = [];
if (array_names.includes(name)) {
    if (name == "flags" || name == "frames") {
        // const response = await fetch(`../images/${name}/${name}_list.json`);
        const response = await fetch(`images/${name}/${name}_list.json`); //Jatos

        const data = await response.json();
        data.forEach(element => {
            images.push(element.name);
        });
    } else {
        const response  = await fetch(`images/pictos/${name}/${name}_list.json`);
        const responsex = await fetch(`images/pictos/X1-5/X1-5_list.json`);
        const responsey = await fetch(`images/pictos/Y1-5/Y1-5_list.json`);
        // const response = await fetch(`images/pictos/${name}/${name}_list.json`); //Jatos

        const data  = await response.json();
        const datax = await responsex.json();
        const datay = await responsey.json();
        const datax100 = datax.filter(element => element.name.includes("100"));
        const datay100 = datay.filter(element => element.name.includes("100"));
        
        if (datax100.length > 0) {
            const randomIndexX = Math.floor(Math.random() * datax100.length);
            data.push(datax100[randomIndexX]);
        }
        if (datay100.length > 0) {
            const randomIndexY = Math.floor(Math.random() * datay100.length);
            data.push(datay100[randomIndexY]);
        }


        data.forEach(element => {
            if (element.name.includes("100")){
                images.push(element.name);
            }
            
        });
    }

    // console.log(images);
}
return images;
}
                    

function getRandomImage(images) {
    // Get a random index
    let randomIndex = Math.floor(Math.random() * images.length);
    // delete the image from the array
    let image = images[randomIndex];
    images.splice(randomIndex, 1);
    return image;
}
function takeOutPng(String_){
    let nameNum = String_.length - 4;
   return String_.slice(0, nameNum);
  }
// functions to display the images and select the winner
export async function displayImages(question, 
                                    name, 
                                    currentImages, 
                                    selectedImages,
                                    winnerImages) {

    putBackground();
    let imageDiv   = document.getElementById("image-container");
    let imageDiv1  = document.querySelector("#image-container-1");
    let imageDiv2  = document.querySelector("#image-container-2");


    // Display the winner image if there is one but only after the currentImages array is exhausted
    if (winnerImages.length !== 0) {
        // displayWinnerImages(winnerImages[winnerImages.length - 1], name);
        await displayWinnerImages(winnerImages, name);
        // console.log("No more images to select from.");
    } else { 
        await displayWinnerImages();
    }
    // Initialize selectedImages with 2 random images
    if (selectedImages.length == 0) {
        selectedImages.push(getRandomImage(currentImages));
        selectedImages.push(getRandomImage(currentImages));
    }

    // let loadingImage = new Image(); // preloading gif animation
    // loadingImage.src = '../images/loading_gif/loading-icon.gif'; 
    let startTime = new Date();
    // loadingImage.src = 'images/loading_gif/loading-icon.gif'; //Jatos
    if (selectedImages.length == 1) { selectedImages = []; } // reset selectedImages if there is only one image left

    let image1 = document.createElement("img");
    let image2 = document.createElement("img");

    if (selectedImages[0].includes("X")) {
        name = "X1-5";
    } else if (selectedImages[0].includes("Y")) {
        name = "Y1-5";
    } else if (selectedImages[0].includes("A")) {
        name = "A1-6";
    } else if (selectedImages[0].includes("C")) {
        name = "C1-6";
    } else if (selectedImages[0].includes("D")) {
        name = "D1-6";
    } else if (selectedImages[0].includes("E")) {
        name = "E1-6";
    } else if (selectedImages[0].includes("F")) {
        name = "F1-6";
    }    
    // image1.src = `../images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${selectedImages[0]}`;
    image1.src = `images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${selectedImages[0]}`; //Jatos
    image1.id = selectedImages[0];
    image1.alt = takeOutPng(selectedImages[0]);
    image1.title = takeOutPng(selectedImages[0]);
    image1.addEventListener("click", handleClick(question, name, currentImages, selectedImages, winnerImages, startTime));
    image1.addEventListener("touchend", handleClick(question, name, currentImages, selectedImages, winnerImages, startTime));
    
    if (selectedImages[1].includes("X")) {
        name = "X1-5";
    } else if (selectedImages[1].includes("Y")) {
        name = "Y1-5";
    } else if (selectedImages[1].includes("A")) {
        name = "A1-6";
    } else if (selectedImages[1].includes("C")) {
        name = "C1-6";
    } else if (selectedImages[1].includes("D")) {
        name = "D1-6";
    } else if (selectedImages[1].includes("E")) {
        name = "E1-6";
    } else if (selectedImages[1].includes("F")) {
        name = "F1-6";
    }
    // image2.src = `../images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${selectedImages[1]}`;
    image2.src = `images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${selectedImages[1]}`; //Jatos
    image2.id = selectedImages[1];
    image2.alt = takeOutPng(selectedImages[1]);
    image2.title = takeOutPng(selectedImages[1]);
    image2.addEventListener("click", handleClick(question, name, currentImages, selectedImages, winnerImages, startTime));
    image2.addEventListener("touchend", handleClick(question, name, currentImages, selectedImages, winnerImages, startTime));

    // gif animation4
    // imageDiv.appendChild(loadingImage);
    setTimeout(() => {
    imageDiv1.appendChild(image1);
    imageDiv2.appendChild(image2);
    // loadingImage.remove();
    }
    , 500); // Add a delay of 0.55 seconds before displaying the images
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function handleClick(question, name, currentImages, selectedImages, winnerImages, startTime) {

    // const currentTime = new Date().getTime(); TODO: add timing functionality
    return async  function (event) {
        // Get the id of the clicked image
        if (event.target.getAttribute('disabled') !== null) {
            return;
        }

        let id = event.target.id;
        // console.log(id);
        let unselectedImageIndex = selectedImages.findIndex(img => img !== event.target.id);
        let unselectedImage = selectedImages[unselectedImageIndex];
        let data = {
            type: name,
            question: question,
            optionRight: takeOutPng(selectedImages[0]),
            optionLeft: takeOutPng(selectedImages[1]),
            chosen: takeOutPng(id),
            unchosen: takeOutPng(unselectedImage),
            timeToClick: `${((new Date() - startTime - 500) / 1000)}`, // -500 to account for the 0.5 second delay
        };
        // console.log(data);
        iterations.push(data);
        // Add the image to the winnerImages array
        if (currentImages.length <= 0) {
            winnerImages.push(id);
        }


        // Remove the image from selectedImages
        if (currentImages.length > 0) {
            selectedImages[unselectedImageIndex] = getRandomImage(currentImages);

        } 
        else {
            selectedImages.splice(unselectedImageIndex, 1);
        }
        shuffleArray(selectedImages);

        

        document.querySelectorAll("img").forEach(img => img.remove());
        await displayImages(question, name, currentImages, selectedImages, winnerImages);
        // iterations.push(data);
    }
    
}




export async function displayWinnerImages(winnerImages, name) {

    let image2Div = document.querySelector("#winner-image-container");
    if (!image2Div) {
        image2Div = document.createElement("div");
        image2Div.id = "winner-image-container";
        document.body.appendChild(image2Div);
    }

    let image2 = document.createElement("img");
    while (image2Div.firstChild) {
        image2Div.removeChild(image2Div.firstChild);
    }
    image2Div.appendChild(image2);
    
    
    let loadingImage = new Image();
    // loadingImage.src = '../images/loading_gif/loading-icon.gif'; 
    loadingImage.src = 'images/loading_gif/loading-icon.gif'; //Jatos
    if (!winnerImages || winnerImages.length === 0) { 
        // Set the source to an empty image placeholder
        // console.log(`There are no winner images: ${winnerImages}`)
        // image2.src = `../images/empty_flag/empty_flag.png`;
        image2.src = `images/empty_flag/empty_flag.png`; //Jatos
        image2.alt = "empty flag";
        image2.title = "empty flag";
    }
    if (winnerImages && winnerImages.length === 1) {
        // Display the single image
        // console.log(`This is the winner image: ${winnerImages}`)
        let winnerImage = winnerImages[0];
        if (winnerImage.includes("flag")) {
            name = "flags";}

        // image2.src = `../images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${winnerImage}`;
        image2.src = `images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${winnerImage}`; //Jatos
        image2.alt = winnerImage.slice(5, -4);
        image2.title = winnerImage.slice(5, -4);
    }
    if (winnerImages && winnerImages.length > 1) {
        // Combine the images
        // console.log(`These are the winner images: ${winnerImages}`)
        // Show loading animation
        image2.src = loadingImage.src;

        let combinedImageSrc = await combineImages(winnerImages);
        // Hide loading animation
        // loadingAnimation.style.display = 'none';
        image2.src = combinedImageSrc;
        image2.alt = 'Combined image';
        image2.title = 'Combined image';
}
image2Div.appendChild(image2);

}


let imageCache = {};

export async function combineImages(imageFileNames) {
    let cacheKey = imageFileNames.join(',');
    if (imageCache[cacheKey]) {
        return imageCache[cacheKey];
    }

    // Create new image elements
    let images = await Promise.all(imageFileNames.map(async fileName => {
        let img = new Image();
        let name = "";
        if (fileName.includes("flag")) {
            name = "flags";
        } else if (fileName.includes("frame")) {
            name = "frames";
        } else if (fileName.includes("A")) {
            name = "A1-6";
        } else if (fileName.includes("B")) {
            name = "B1-8";
        } else if (fileName.includes("C")) {
            name = "C1-6";
        } else if (fileName.includes("D")) {
            name = "D1-6";
        } else if (fileName.includes("E")) {
            name = "E1-6";
        } else if (fileName.includes("F")) {
            name = "F1-6";
        } else if (fileName.includes("X")) {
            name = "X1-5";
        } else if (fileName.includes("Y")) {
            name = "Y1-5";
        }
        // img.src = `../images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${fileName}`;
        img.src = `images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${fileName}`; //Jatos
        await new Promise(resolve => { img.onload = resolve; }); // Wait for image to load
        return img;
    }));


 
    // Create a canvas element
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // Adjust the size of the images
    let bigImage = images[0];
    bigImage.width *= 1.5; // Double the size of the first image
    bigImage.height *= 1.5;

    let mediumImage = images[1];
    if (mediumImage) {
        if (imageFileNames[1].includes("125")) {
            mediumImage.width *= 1.25; 
            mediumImage.height *= 1.25;
        } else {
            mediumImage.width *= 1; 
            mediumImage.height *= 1;
        }
    }

    

    let smallImage = images[2]; // The third image remains the same size
    if (smallImage) {
        if (imageFileNames[2].includes("125")) {
            smallImage.width *= 1.25; 
            smallImage.height *= 1.25;
        } else {
            smallImage.width *= 1; 
            smallImage.height *= 1;
        }
    }
    // Calculate the total width and maximum height of the images
    let totalWidth = Math.max(bigImage.width, mediumImage.width, smallImage ? smallImage.width : 0);
    let maxHeight = Math.max(bigImage.height, mediumImage.height, smallImage ? smallImage.height : 0);

    // Increase the size of the canvas
    let scale = 1; // Change this to increase or decrease the size of the canvas
    canvas.width = totalWidth * scale;
    canvas.height = maxHeight * scale;

    // Draw the images onto the canvas
    for (let img of [bigImage, mediumImage, smallImage]) {
        if (img) {
            let xOffset = (canvas.width - img.width * scale) / 2;
            let yOffset = (canvas.height - img.height * scale) / 2;
            if (img === smallImage){
                ctx.globalCompositeOperation = "source-over";
            }
            if (img === mediumImage){
                ctx.globalCompositeOperation = "source-atop";
            }
            ctx.drawImage(img, xOffset, yOffset, img.width * scale, img.height * scale);
        }
    }

    // Return the data URL of the canvas as the combined image
    const dataUrl = canvas.toDataURL(0.5);
    imageCache[cacheKey] = dataUrl;
    return dataUrl;
}

export function clearImageCache() {
    imageCache = {};
}


// EXPERIMENT

export async function runExperiment(questions) {

    for (let question of questions) {
        let categories = questionDict[question];
        let winnerImages = [];
        let keys = Object.keys(questionDict);


        putBackground();

        // create an H1 element
        let h1 = document.createElement("h1");
        // clear previous question

        let p_question_h1 = document.createElement("p");
        p_question_h1.innerHTML = paragraphs[question];
        p_question_h1.id = "paragraph-question";
        
        document.getElementById("question").innerHTML = '';
        h1.innerHTML = question;
        document.getElementById("question").appendChild(h1);
        document.getElementById("question").appendChild(p_question_h1);

        for (let name of categories) {
            await displayWinnerImages();

            let p_select2 = document.createElement("p");
            p_select2.innerHTML = "Welke van de twee vind jij hier het best bij passen?";
            p_select2.style.position = "fixed"; // was relative
            p_select2.style.top = "30%";
            p_select2.style.zIndex = "-1";
            document.body.appendChild(p_select2);

            let currentImages = await getImages(name);

            document.getElementById('image-container').innerHTML = '';
            let selectedImages = [];
            await displayImages(question, name, currentImages, selectedImages, winnerImages);

            // Wait for currentImages to be exhausted
            // document.body.removeChild(p);

            while (currentImages.length >= 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (currentImages.length === 0 && selectedImages.length === 1) {
                    document.body.removeChild(p_select2);
                //     putBackground('images/background/GUI_Background2.png');

                //     // add a paragraph
                //     let p = document.createElement("p");
                //     p.innerHTML = "Deze heb je gekozen!";
                //     p.style.position = "fixed";
                //     p.style.top = "30%";
                //     p.style.zIndex = "-1";
                //     document.body.appendChild(p);
                //     if (winnerImages[winnerImages.length - 1].includes("X")) {
                //         name = "X1-5";
                //     } else if (winnerImages[winnerImages.length - 1].includes("Y")) {
                //         name = "Y1-5";
                //     } else if (winnerImages[winnerImages.length - 1].includes("A")) {
                //         name = "A1-6";
                //     } else if (winnerImages[winnerImages.length - 1].includes("C")) {
                //         name = "C1-6";
                //     } else if (winnerImages[winnerImages.length - 1].includes("D")) {
                //         name = "D1-6";
                //     } else if (winnerImages[winnerImages.length - 1].includes("E")) {
                //         name = "E1-6";
                //     } else if (winnerImages[winnerImages.length - 1].includes("F")) {
                //         name = "F1-6";
                //     }
                //     // display winner
                //     let winner = `images/${name == "flags" || name == "frames" ? name : "pictos/" + name}/${winnerImages[winnerImages.length - 1]}`;
                //     let img = document.createElement('img');
                //     img.src = winner;
                //     img.id = "final-image";
                //     img.style.width = "20%";
                //     img.style.height = "20%";
                //     document.body.appendChild(img);

                    // Create a button
                    // let button = document.createElement("button");
                    // button.innerHTML = "Klik om verder te gaan";
                    // document.body.appendChild(button);

                    // // Wait for the button to be clicked before continuing
                    // await new Promise(resolve => button.onclick = () => {
                    //     // Remove the button when clicked
                    //     document.body.removeChild(p);
                    //     document.body.removeChild(button);
                    //     document.body.removeChild(img);
                    //     resolve();
                    // });
                    break;
                }
            }
        }

        // Show the button and wait for it to be clicked before continuing
        let currentIndex = keys.indexOf(question);
        let experimentState = {
            question: question,
            categories: categories,
            currentIndex: currentIndex + 1,
            iterations: iterations,
            winnerImages: winnerImages
        };

        localStorage.setItem('experimentState', JSON.stringify(experimentState));

        let div_finalQ = document.createElement('div');
        div_finalQ.id = "final-question";

        let p_finalQ = document.createElement("p");
        p_finalQ.innerHTML = "Dankjewel, deze vlag is klaar.";
        p_finalQ.style.position = "fixed";
        p_finalQ.style.top = "25%";
        p_finalQ.style.zIndex = "-1";


        let img_final_Q = document.createElement('img');
        img_final_Q.id = "final-image";
        let combinedImageSrc = await combineImages(winnerImages);
        img_final_Q.src = combinedImageSrc;

        let button1 = document.createElement("button");
        let button2 = document.createElement("button");
        // button.textContent = "Next Question";
        if (currentIndex === keys.length - 1) {
            button1.textContent = " Exit ";
            button1.id = "exit-button";
            putBackground('images/background/GUI_Background2.png');
            // button1.style.top = "80%";
        } else {
            button1.textContent = "Klik om verder te gaan";
            button2.textContent = " Stoppen ";
            button1.id = "next-button";
            button2.id = "stop-button";
            // button1.style.top = "80%";s
            putBackground('images/background/GUI_Background2.png');
        }
        if (currentIndex === keys.length - 1 ){
            div_finalQ.appendChild(button1);
            // div_finalQ.style.transform = "translate(10px, 60px)"
            
        } else {
            div_finalQ.appendChild(button1);
            div_finalQ.appendChild(button2);
        }
        // div_finalQ.appendChild(button1);
        // div_finalQ.appendChild(button2);

        document.body.appendChild(div_finalQ);
        document.body.appendChild(p_finalQ);
        document.body.appendChild(img_final_Q);

        // div_finalQ.appendChild(p_finalQ);
        // div_finalQ.appendChild(img_final_Q);
        // document.body.appendChild(div_finalQ);

        let images = document.querySelectorAll('img');
        images.forEach(img => img.setAttribute('disabled', ''));
        
        // await new Promise(resolve => button.onclick = resolve);
        await new Promise(resolve => {
            button1.onclick = () => {
                resolve();
                // If it's the last question, redirect to end_experiment.html
                if (currentIndex === keys.length - 1) {
                    // jatos.endStudy(answersToCsv(iterations)); // jatos.onLoad uncomment !!
                    jatos.startNextComponent(answersToCsv(iterations));
                    // localStorage.clear()
                    // div_finalQ.removeChild(button2)
                    // window.location.href = 'end_experiment.html';
                }
            };

            button2.onclick  = async () => {
                // resolve();
                
                replacePage('html/stop_continue.html');
            }
            // replacePage('html/stop_continue.html');
        });

        // Remove the button when clicked
        document.body.removeChild(div_finalQ);
        p_finalQ.remove();
        img_final_Q.remove();


    }

}



