import { quizSolutions } from "./interfaces";

export async function getSolutions(id: string): Promise<quizSolutions> {
    const response = await fetch("https://tuwelsolution.xerus.at/solution/" + id);
    const solutions = await response.json();
    return solutions;
}

export async function setSolution(quiz: quizSolutions) {
    await fetch('https://tuwelsolution.xerus.at/solution/save/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
    });
}