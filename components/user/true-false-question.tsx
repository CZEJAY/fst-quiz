import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TrueFalseQuestionProps {
  question: {
    id: string;
    text: string;
  };
  onAnswer: (answer: boolean) => void;
  currentAnswer: boolean | undefined;
}

export function TrueFalseQuestion({
  question,
  onAnswer,
  currentAnswer,
}: TrueFalseQuestionProps) {
  return (
    <RadioGroup
      onValueChange={(value) => onAnswer(value === "true")}
      value={currentAnswer?.toString()}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id="true" />
        <Label htmlFor="true">True</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id="false" />
        <Label htmlFor="false">False</Label>
      </div>
    </RadioGroup>
  );
}
