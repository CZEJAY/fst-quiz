import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface ShortAnswerQuestionProps {
  question: {
    id: string;
    text: string;
  };
  onAnswer: (answer: string) => void;
  currentAnswer: string | undefined;
}

export function ShortAnswerQuestion({
  question,
  onAnswer,
  currentAnswer,
}: ShortAnswerQuestionProps) {
  const [answer, setAnswer] = useState(currentAnswer || "");

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (answer) {
        onAnswer(answer);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [answer, onAnswer]);

  return (
    <div className="space-y-2">
      <Label htmlFor={`question-${question.id}-${question.text}`}>
        Your Answer
      </Label>
      <Input
        id={`question-${question.id}-${question.text}`}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here"
      />
    </div>
  );
}
