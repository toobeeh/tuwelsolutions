export interface question {

    /** supported question type, determined by the input method */
    type: "multianswer" | "multichoice";

    /** the question text, including main instructions */
    text: string;

    /** the question solution */
    answers: any;

    /** image added to the question text */
    imgHash?: string;

}

/** quiz solution representation */
export interface quizSolutions {

    /** id of the quiz */
    quiz: string;

    /** questions and their solutions */
    questions: Array<question>;

}
