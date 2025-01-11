import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const questionTypes = ["multiple-choice", "true-false", "short-answer"];

export function randomizeQuestionTypes(questions: any[]) {
  return questions.map((question) => {
    const randomType =
      questionTypes[Math.floor(Math.random() * questionTypes.length)];
    if (randomType === question.type) return question;

    const newQuestion = { ...question, type: randomType };
    if (randomType === "multiple-choice" && !newQuestion.options) {
      newQuestion.options = [
        newQuestion.correctAnswer,
        "Incorrect Option 1",
        "Incorrect Option 2",
        "Incorrect Option 3",
      ];
      shuffleArray(newQuestion.options);
    } else if (randomType !== "multiple-choice") {
      delete newQuestion.options;
    }

    if (randomType === "true-false") {
      newQuestion.correctAnswer = Math.random() < 0.5;
      newQuestion.text = `${newQuestion.text} (True/False)`;
    }

    return newQuestion;
  });
}
