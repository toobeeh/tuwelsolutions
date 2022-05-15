import { question } from "./interfaces";

/** base class for tuwel multichoice questions */
export class TuwelMultichoice {

    /** the question text */
    protected text: string;

    /** optional question image */
    protected image?: string;

    /** answer texts and checkbox elements */
    protected answers: Array<{text: String, element: HTMLInputElement}>;

    constructor(protected question: HTMLDivElement) {

        this.text = (question.querySelector(".qtext") as HTMLParagraphElement).innerText;
        this.image = question.querySelector("img")?.src.slice(0, 10000);
        this.answers = [];
        question.querySelectorAll(".answer > div").forEach((answer) => {
            this.answers.push({
                text: (answer as HTMLDivElement).innerText,
                element: answer.querySelector("input:nth-child(2)")!
            });
        });
    }

    /**
     * evaluates if this question is equal to another
     * @param question 
     */
    matches(question: question): boolean {
        return question.type == "multichoice" && question.text == this.text && question.imgHash == this.image;
    }

    /**
     * ticks the provided correct solutions of an questions answer
     * @param solution the solutions for this question
     */
    solve(solution: question){

        /* loop through available answers */
        this.answers.forEach(answer => {

            /* if answer is in correct answers, click it */
            if((solution.answers as Array<String>).some(text => answer.text == text)){
                answer.element.click();
            }
        });
    }
}

/** class to handle a multichoice result */
export class TuwelMultichoiceSolved extends TuwelMultichoice {

    /** the correct answers for this question */
    private correctAnswers: Array<string>;

    constructor(question: HTMLDivElement) {
        super(question);
        let solution = (question.querySelector(".rightanswer") as HTMLDivElement).innerText;
        this.correctAnswers = solution
            .substring(solution.indexOf(":") + 1)
            .trim()
            .split(",")
            .map(a => a.trim());
    }

    /**
     * converts this question to the db json interface
     * @returns question object
     */
    toJSON(): question {
        return {
            type: "multichoice",
            text: this.text,
            imgHash: this.image,
            answers: this.correctAnswers
        }
    }
}