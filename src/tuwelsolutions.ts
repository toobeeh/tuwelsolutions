import { getSolutions, setSolution } from "./api";
import { question, quizSolutions } from "./interfaces";
import { TuwelMultianswer, TuwelMultianswerSolved } from "./multianswer";
import { TuwelMultichoice, TuwelMultichoiceSolved } from "./multichoice";

async function solveQuiz() {

    // get the quiz ID
    // @ts-ignore
    const quizID: string = window.location.search
        .replace("?", "")
        .split("&")
        .find(param => param.indexOf("cmid") >= 0)
        .replace("cmid=", "");

    // get other solutions from server
    let currentSolution: quizSolutions | undefined = undefined;
    try {
        currentSolution = await getSolutions(quizID);
    }
    catch {
        console.timeLog("No solutions for this quiz :/");
        return;
    }
    console.log("found solutions for this quiz: ", currentSolution);

    // get questions from document and solve them
    document.querySelectorAll(".que").forEach(question => {

        // if it's a multiple choice question
        if (question.classList.contains("multichoice")) {
            let checkQuestion = new TuwelMultichoice(question as HTMLDivElement);

            // search for matching solutions
            currentSolution?.questions.forEach(solution => {
                if (checkQuestion.matches(solution)) {
                    checkQuestion.solve(solution);
                    console.log("solved a question:", checkQuestion);
                }
            });
        }

        // if it's a multianswer question
        if (question.classList.contains("multianswer")) {
            let selectquestion = new TuwelMultianswer(question as HTMLDivElement);

            // search for matching solutions
            currentSolution?.questions.forEach(solution => {
                if (selectquestion.matches(solution)) {
                    selectquestion.solve(solution);
                    console.log("solved a question:", selectquestion);
                }
            });
        }
    });

    console.log("solved all known questions");
}

/**
 * Process a quiz result on the "TUWEL result page"
 * gets the correct answers, merges with current answers on the server and posts the merge
 */
async function processQuizResult() {

    // get the quiz ID
    // @ts-ignore
    const quizID: string = window.location.search
        .replace("?", "")
        .split("&")
        .find(param => param.indexOf("cmid") >= 0)
        .replace("cmid=", "");

    // get solutions from document
    let solutions: Array<question> = [];
    document.querySelectorAll(".que").forEach(question => {

        // if it's a multiple choice question
        if (question.classList.contains("multichoice")) {
            solutions.push(
                new TuwelMultichoiceSolved(question as HTMLDivElement).toJSON()
            );
        }

        // if it's a select question
        else if (question.classList.contains("multianswer")) {
            solutions.push(
                new TuwelMultianswerSolved(question as HTMLDivElement).toJSON()
            );
        }

    });

    // build quiz object
    const solvedQuiz: quizSolutions = {
        quiz: quizID,
        questions: solutions
    }

    // post to server
    await setSolution(solvedQuiz);

    console.log("posted solutions to server: ", solveQuiz);
}

/** connects tuwelsolution functions to the UI */
export function setup(){

    const nav = (document.querySelector(".othernav") as HTMLDivElement);
    const actionElem = document.createElement("a");
    actionElem.href = "#";
    const mode = window.location.pathname.split("/").reverse()[0];
    
    if(mode == "attempt.php"){
        actionElem.innerText = "Load from tuwelsolutions";
        actionElem.addEventListener("click", () => {
            solveQuiz();
            actionElem.removeAttribute("href");
            actionElem.innerText = "Solved known questions";
            actionElem.style.pointerEvents = "none";
        });
        nav.appendChild(actionElem);
    }
    else if(mode == "review.php"){
        actionElem.innerText = "Upload to tuwelsolutions";
        actionElem.addEventListener("click",() => {
            processQuizResult();
            actionElem.removeAttribute("href");
            actionElem.innerText = "Uploaded solutions";
            actionElem.style.pointerEvents = "none";
        });
        nav.appendChild(actionElem);
    }

}