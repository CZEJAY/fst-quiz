import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MultipleChoiceQuestionProps {
  question: {
    id: string;
    text: string;
    options: string[];
  };
  onAnswer: (answer: string) => void;
  currentAnswer: string | undefined;
}

export function MultipleChoiceQuestion({
  question,
  onAnswer,
  currentAnswer,
}: MultipleChoiceQuestionProps) {
  return (
    <RadioGroup onValueChange={onAnswer} value={currentAnswer}>
      {question.options.map((option, index) => (
        <div key={option} className="flex items-center space-x-2">
          <RadioGroupItem
            value={index.toString()}
            id={`option-${option}-${index}`}
          />
          <Label htmlFor={`option-${option}-${index}`}>{option}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
