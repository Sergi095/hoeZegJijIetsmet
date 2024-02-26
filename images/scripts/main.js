// import { getImages, displayImages, displayWinnerImages, questionDict, iterations, putBackground, combineImages } from "./helper.js";
// import { replacePage } from "./stop_continue.js";
import {runExperiment, questionDict} from "./helper.js";




// export let originalExperimentPage = document.documentElement.outerHTML;

// export function resetExperiment() {
    // document.open();
    // document.write(originalExperimentPage);
    // document.close();
// }



export async function startExperiment() {

jatos.onLoad(async function () {
    let keys = Object.keys(questionDict);

    // Check if there is a saved state in local storage
    if (localStorage.getItem('experimentState') === null) {
        // No saved state, start fresh
        await runExperiment(keys);
    } else {
        // Continue from saved state
        let experimentState = JSON.parse(localStorage.getItem('experimentState'));
        let currentIndex = experimentState.currentIndex;
        await runExperiment(keys.slice(currentIndex));
    }

}); // jatos.onLoad

}






startExperiment();


