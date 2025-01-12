"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { createQuestion } from "@/actions/question-actions";
import { Progress } from "@/components/ui/progress";
import { QuestionFormData } from "../admin/questions/questions-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Quiz } from "@prisma/client";

interface ExcelUploadModalProps {
  quizzes: Quiz[];
  onUploadComplete: () => void;
}

export function ExcelUploadModal({
  quizzes,
  onUploadComplete,
}: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const parseExcelFile = (file: File): Promise<QuestionFormData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const questions: QuestionFormData[] = jsonData.map((row: any) => ({
          text: row.text,
          type: row.type,
          quizId: selectedQuizId,
          explanation: row.explanation,
          timeLimit: parseInt(row.timeLimit),
          points: parseInt(row.points),
          shuffleOptions: row.shuffleOptions === "true",
          options:
            row.type === "multiple-choice"
              ? [row.option1, row.option2, row.option3, row.option4]
              : undefined,
          correctAnswer:
            row.type === "multiple-choice"
              ? row.correctOption
              : row.correctAnswer,
        }));

        resolve(questions);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!selectedQuizId) {
      toast.error("Please select a quiz");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const questions = await parseExcelFile(file);
      const totalQuestions = questions.length;

      for (let i = 0; i < totalQuestions; i++) {
        const question = questions[i]; //@ts-ignore
        const { error } = await createQuestion(question);
        if (error) {
          toast.error(`Failed to create question: ${question.text}`, {
            description: error,
          });
        }
        setProgress(((i + 1) / totalQuestions) * 100);
      }

      toast.success("Questions uploaded successfully");
      onUploadComplete();
    } catch (error) {
      console.error("Error uploading questions:", error);
      toast.error("Failed to upload questions", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setFile(null);
      setProgress(0);
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      {
        text: "What is 2 + 2?",
        type: "multiple-choice",
        explanation: "Basic addition",
        timeLimit: 30,
        points: 1,
        shuffleOptions: "true",
        option1: "3",
        option2: "4",
        option3: "5",
        option4: "6",
        correctOption: "1",
      },
      {
        text: "Who wrote Romeo and Juliet?",
        type: "short-answer",
        explanation: "Famous playwright",
        timeLimit: 60,
        points: 2,
        shuffleOptions: "false",
        correctAnswer: "William Shakespeare",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, "sample_questions.xlsx");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Questions from Excel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Questions</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing questions for this quiz. The file
            should have columns for text, type, explanation, timeLimit, points,
            shuffleOptions, and options/correctAnswer as applicable.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={downloadSampleFile} variant="secondary">
            Download Sample Excel File
          </Button>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quiz-select" className="text-right">
              Select Quiz
            </Label>
            <Select
              onValueChange={(value) => setSelectedQuizId(value)}
              value={selectedQuizId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a quiz" />
              </SelectTrigger>
              <SelectContent>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="excel-file" className="text-right">
              Excel File
            </Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="col-span-3"
              disabled={isUploading}
            />
          </div>
          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center">{`Uploading... ${Math.round(
                progress
              )}%`}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading || !selectedQuizId}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
