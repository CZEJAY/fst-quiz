"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuizWithRelations } from "@/actions/quiz-actions";

interface QuizConfigModalProps {
  quiz: QuizWithRelations;
  isOpen: boolean;
  onClose: () => void;
}

export function QuizConfigModal({
  quiz,
  isOpen,
  onClose,
}: QuizConfigModalProps) {
  const [questionCount, setQuestionCount] = useState(quiz.questions.length);
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push(`/user/session/${quiz.id}?questions=${questionCount}`);
  };

  const handleCloseAcleanUp = () => {
    onClose();
    setQuestionCount(quiz.questions.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseAcleanUp}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Quiz: {quiz.title}</DialogTitle>
          <DialogDescription className="text-xs font-sans lg:text-sm">
            Choose the number of questions you want to answer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="questionCount" className="text-right">
              Questions
            </Label>
            <Input
              id="questionCount"
              type="number"
              className="col-span-3"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              min={1}
              max={quiz.questions.length}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStartQuiz}>Start Quiz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
