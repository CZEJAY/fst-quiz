"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/user/dashboard-shell";
import { DashboardHeader } from "@/components/user/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Mock data - replace with actual API call
const mockResults = [
  {
    id: "1",
    userId: "user1",
    quizId: "quiz1",
    score: 80,
    totalQuestions: 10,
    timeTaken: 300,
    date: "2023-05-01",
  },
  {
    id: "2",
    userId: "user2",
    quizId: "quiz2",
    score: 70,
    totalQuestions: 10,
    timeTaken: 350,
    date: "2023-05-02",
  },
  // Add more mock results as needed
];

export default function ResultsPage() {
  const [results, setResults] = useState(mockResults);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterQuiz, setFilterQuiz] = useState("");
  const [selectedResult, setSelectedResult] = useState<
    (typeof mockResults)[0] | null
  >(null);

  const filteredResults = results.filter(
    (result) =>
      result.userId.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterQuiz === "" || result.quizId === filterQuiz)
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Quiz Results"
        text="View and analyze quiz results across all users."
      />
      <div className="space-y-4">
        <div className="flex justify-between gap-4">
          <Input
            placeholder="Search by user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterQuiz} onValueChange={setFilterQuiz}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Quiz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quiz1">Quiz 1</SelectItem>
              <SelectItem value="quiz2">Quiz 2</SelectItem>
              {/* Add more quizzes as needed */}
            </SelectContent>
          </Select>
          <Button onClick={() => console.log("Export results")}>
            Export Results
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Quiz ID</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.userId}</TableCell>
                <TableCell>{result.quizId}</TableCell>
                <TableCell>{result.score}%</TableCell>
                <TableCell>{result.date}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedResult(result)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Result Details</DialogTitle>
                        <DialogDescription>
                          Detailed information about the quiz result.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedResult && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">User ID:</span>
                            <span className="col-span-3">
                              {selectedResult.userId}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Quiz ID:</span>
                            <span className="col-span-3">
                              {selectedResult.quizId}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Score:</span>
                            <span className="col-span-3">
                              {selectedResult.score}%
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Questions:</span>
                            <span className="col-span-3">
                              {selectedResult.score / 10} /{" "}
                              {selectedResult.totalQuestions}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Time Taken:</span>
                            <span className="col-span-3">
                              {Math.floor(selectedResult.timeTaken / 60)}m{" "}
                              {selectedResult.timeTaken % 60}s
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Date:</span>
                            <span className="col-span-3">
                              {selectedResult.date}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Performance:</span>
                            <Progress
                              value={selectedResult.score}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardShell>
  );
}
