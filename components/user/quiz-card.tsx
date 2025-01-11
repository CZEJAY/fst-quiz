import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizWithRelations } from "@/actions/quiz-actions";

interface QuizCardProps {
  quiz: QuizWithRelations;
  onSelect: (quiz: any) => void;
}

export function QuizCard({ quiz, onSelect }: QuizCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>{quiz?.description || ""}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge>{quiz.category.name}</Badge>
          <Badge variant="outline">{quiz.difficulty}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {quiz.questions.length} questions
        </p>
        <Button onClick={() => onSelect(quiz)}>Take Quiz</Button>
      </CardFooter>
    </Card>
  );
}
