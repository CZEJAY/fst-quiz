"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

interface CreateQuestionDialogProps {
  children: React.ReactNode;
}

export function CreateQuestionDialog({ children }: CreateQuestionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [questionType, setQuestionType] = React.useState("multiple-choice");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new question. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question" className="text-right">
              Question
            </Label>
            <Textarea
              id="question"
              className="col-span-3"
              placeholder="Enter your question here"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              onValueChange={setQuestionType}
              defaultValue="multiple-choice"
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {questionType === "multiple-choice" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Options</Label>
              <RadioGroup className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Input id="option1" placeholder="Option 1" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Input id="option2" placeholder="Option 2" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="option3" />
                  <Input id="option3" placeholder="Option 3" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option4" id="option4" />
                  <Input id="option4" placeholder="Option 4" />
                </div>
              </RadioGroup>
            </div>
          )}
          {questionType === "true-false" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Correct Answer</Label>
              <RadioGroup
                defaultValue="true"
                className="col-span-3 flex space-x-4"
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
            </div>
          )}
          {questionType === "short-answer" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="answer" className="text-right">
                Correct Answer
              </Label>
              <Input
                id="answer"
                className="col-span-3"
                placeholder="Enter the correct answer"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Difficulty
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="literature">Literature</SelectItem>
                <SelectItem value="geography">Geography</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quiz" className="text-right">
              Quiz
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a quiz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math-101">Math 101</SelectItem>
                <SelectItem value="world-geography">World Geography</SelectItem>
                <SelectItem value="science-basics">Science Basics</SelectItem>
                <SelectItem value="literature-classics">
                  Literature Classics
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="explanation" className="text-right">
              Explanation
            </Label>
            <Textarea
              id="explanation"
              className="col-span-3"
              placeholder="Provide an explanation for the correct answer"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time-limit" className="text-right">
              Time Limit (seconds)
            </Label>
            <Input
              id="time-limit"
              type="number"
              className="col-span-3"
              placeholder="Enter time limit in seconds"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="points" className="text-right">
              Points
            </Label>
            <Input
              id="points"
              type="number"
              className="col-span-3"
              placeholder="Enter points for this question"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shuffle-options" className="text-right">
              Shuffle Options
            </Label>
            <Switch id="shuffle-options" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Save Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
