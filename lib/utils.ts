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

// const calculateProfileStats = (profile) => {
//   // Basic stats
//   const totalQuizzes = profile.quizResults.length;
//   const createdQuizzes = profile.createdQuizzes.length;

//   // Calculate average score across all quizzes
//   const averageScore = profile.quizResults.length > 0
//     ? (profile.quizResults.reduce((acc, result) =>
//         acc + (result.score / result.totalPossibleScore) * 100, 0
//       ) / totalQuizzes).toFixed(1)
//     : 0;

//   // Calculate performance by difficulty
//   const performanceByDifficulty = profile.quizResults.reduce((acc, result) => {
//     const difficulty = result.quiz.difficulty;
//     if (!acc[difficulty]) {
//       acc[difficulty] = {
//         total: 0,
//         count: 0
//       };
//     }
//     acc[difficulty].total += (result.score / result.totalPossibleScore) * 100;
//     acc[difficulty].count += 1;
//     return acc;
//   }, {});

//   // Calculate average score for each difficulty
//   const difficultyAverages = Object.entries(performanceByDifficulty).reduce((acc, [difficulty, data]) => {
//     acc[difficulty] = (data.total / data.count).toFixed(1);
//     return acc;
//   }, {});

//   // Calculate best performance
//   const bestScore = profile.quizResults.length > 0
//     ? Math.max(...profile.quizResults.map(result =>
//         (result.score / result.totalPossibleScore) * 100
//       ))
//     : 0;

//   // Calculate recent performance trend (last 5 quizzes)
//   const recentQuizzes = [...profile.quizResults]
//     .sort((a, b) => new Date(b.completed) - new Date(a.completed))
//     .slice(0, 5);

//   const recentAverage = recentQuizzes.length > 0
//     ? (recentQuizzes.reduce((acc, result) =>
//         acc + (result.score / result.totalPossibleScore) * 100, 0
//       ) / recentQuizzes.length).toFixed(1)
//     : 0;

//   // Calculate category performance
//   const categoryPerformance = profile.quizResults.reduce((acc, result) => {
//     const category = result.quiz.category.name;
//     if (!acc[category]) {
//       acc[category] = {
//         total: 0,
//         count: 0
//       };
//     }
//     acc[category].total += (result.score / result.totalPossibleScore) * 100;
//     acc[category].count += 1;
//     return acc;
//   }, {});

//   // Calculate average score for each category
//   const categoryAverages = Object.entries(categoryPerformance).reduce((acc, [category, data]) => {
//     acc[category] = (data.total / data.count).toFixed(1);
//     return acc;
//   }, {});

//   // Calculate activity streak
//   const streak = profile.quizResults.reduce((acc, result) => {
//     const today = new Date();
//     const completed = new Date(result.completed);
//     const diffDays = Math.floor((today - completed) / (1000 * 60 * 60 * 24));
//     return diffDays <= 7 ? acc + 1 : acc;
//   }, 0);

//   return {
//     basic: {
//       averageScore,
//       totalQuizzes,
//       createdQuizzes,
//       memberSince: new Date(profile.createdAt).toLocaleDateString(),
//       bestScore: bestScore.toFixed(1),
//       recentAverage,
//       streak
//     },
//     detailed: {
//       difficultyAverages,
//       categoryAverages
//     }
//   };
// };

// // Usage in component:
// const stats = calculateProfileStats(profile);
