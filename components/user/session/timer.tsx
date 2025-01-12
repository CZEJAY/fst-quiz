import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuizTrackerProps {
  totalQuestions: number;
  currentQuestion: number;
  timeLimit: number; // Time limit in seconds
  onTimeExpired: () => void; // New prop to handle time expiration
}

const QuizTracker: React.FC<QuizTrackerProps> = ({
  totalQuestions,
  currentQuestion,
  timeLimit,
  onTimeExpired,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onTimeExpired();
          return 0;
        }
        return prevTime - 1;
      });

      // Show warning when 20% of time limit is left
      if (timeLeft <= timeLimit * 0.2 && !isWarning) {
        setIsWarning(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, onTimeExpired]);

  useEffect(() => {
    // Reset timer when moving to a new question
    setTimeLeft(timeLimit);
    setIsWarning(false);
  }, [currentQuestion, timeLimit]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const timeProgressPercentage = (timeLeft / timeLimit) * 100;

  return (
    <Card className="mb-1">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">
                {currentQuestion} of {totalQuestions} questions
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Time Remaining</span>
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <Progress value={timeProgressPercentage} className="w-full" />
          </div>
        </div>

        {/* <div className="h-10 mt-1">
          {isWarning && (
            <div className="w-full text-yellow-500 ">
              Warning: Less than {Math.ceil(timeLimit * 0.2)} seconds remaining!
            </div>
          )}
        </div> */}
      </CardContent>
    </Card>
  );
};

export default QuizTracker;
