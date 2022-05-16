import { question } from "./interfaces";

/** base class for tuwel multianswer questions */
export class TuwelMultianswer {

    /** the question text */
    protected text: string;

    /** optional question image */
    protected image?: string;

    /** answer texts and checkbox elements */
    protected answers: Array<Array<{option: HTMLOptionElement, select: HTMLSelectElement}>>;

    constructor(protected question: HTMLDivElement) {

        const formulation = (question.querySelector(".formulation") as HTMLDivElement).cloneNode(true) as HTMLDivElement;
        formulation.querySelectorAll(".subquestion").forEach(s => s.remove());

        this.text = formulation.textContent!;
        this.image = question.querySelector("img")?.src.slice(0, 10000);
        this.answers = [];
        question.querySelectorAll(".subquestion select").forEach((select) => {

            const opts: Array<{option: HTMLOptionElement, select: HTMLSelectElement}> = [];

            select.querySelectorAll("option").forEach(option => {
                opts.push({
                    option: option as HTMLOptionElement,
                    select: select as HTMLSelectElement
                });
            });

            this.answers.push(opts);
        });
    }

    /**
     * evaluates if this question is equal to another
     * @param question 
     */
    matches(question: question): boolean {
        return question.type == "multianswer" && question.text == this.text && question.imgHash == this.image;
    }

    /**
     * ticks the provided correct solutions of an questions answer
     * @param solution the solutions for this question
     */
    solve(solution: question){

        /* loop through available answers */
        this.answers.forEach((subquestion, index) => {

            /* set select value */
            subquestion.forEach(s => {
                s.option.selected = s.option.innerText == solution.answers[index];
                if(s.option.selected) s.select.value = s.option.value;
            });
        });
    }
}

/** class to handle a multichoice result */
export class TuwelMultianswerSolved extends TuwelMultianswer {

    /** the correct answers for this question */
    private correctAnswers: Array<string>;

    constructor(question: HTMLDivElement) {
        super(question);
        let solution: Array<string> = [];
        question.querySelectorAll(".feedbackspan").forEach(subq => {
            solution.push(subq.innerHTML.split("<br>")[1].split(": ")[1]);
        });
        this.correctAnswers = solution;
    }

    /**
     * converts this question to the db json interface
     * @returns question object
     */
    toJSON(): question {
        return {
            type: "multianswer",
            text: this.text,
            imgHash: this.image,
            answers: this.correctAnswers
        }
    }
}