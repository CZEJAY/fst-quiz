import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Question } from "@prisma/client";

interface QuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  answeredQuestions: Record<string, any>;
  onNavigate: (index: number) => void;
}

export function QuestionNavigation({
  questions,
  currentQuestionIndex,
  answeredQuestions,
  onNavigate,
}: QuestionNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {questions.map((val, index) => {
        const questionId = val.id;
        const isAnswered = answeredQuestions[questionId] !== undefined;
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={cn(
              "w-10 h-10 p-0 relative",
              index === currentQuestionIndex && "border-primary",
              isAnswered && "bg-secondary"
            )}
            onClick={() => onNavigate(index)}
          >
            {index + 1}
            {isAnswered && (
              <Check className="w-3 h-3 absolute top-0.5 right-0.5 text-primary" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
