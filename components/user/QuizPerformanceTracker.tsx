import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Calendar,
  Target,
  Brain,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserResultAndRelation } from "@/actions/user-quiz-result-actions";

const timeRanges = {
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  "90days": "Last 90 Days",
  all: "All Time",
};

const QuizPerformanceTracker = ({
  results,
}: {
  results: UserResultAndRelation[];
}) => {
  const [timeRange, setTimeRange] = useState("all");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Process and filter results based on time range
  const filteredResults = useMemo(() => {
    const now = new Date();
    const days = timeRange === "all" ? Infinity : parseInt(timeRange);
    return (
      results
        .filter((result) => {
          const completedDate = new Date(result.completed);
          // @ts-ignore
          const diffTime = Math.abs(now - completedDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= days;
        })
        // @ts-ignore
        .sort((a, b) => new Date(a.completed) - new Date(b.completed))
    );
  }, [results, timeRange]);

  const processedData = filteredResults.map((result) => ({
    date: new Date(result.completed).toLocaleDateString(),
    score: (result.score / result.totalPossibleScore) * 100,
    totalQuestions: result.totalQuestions,
    rawScore: result.score,
    quizId: result.quizId,
  }));

  // Calculate statistics
  const stats = useMemo(() => {
    const scores = filteredResults.map(
      (r) => (r.score / r.totalPossibleScore) * 100
    );
    return {
      averageScore: scores.reduce((acc, curr) => acc + curr, 0) / scores.length,
      totalQuizzes: filteredResults.length,
      bestScore: Math.max(...scores),
      recentTrend:
        filteredResults.length >= 2
          ? (filteredResults[filteredResults.length - 1].score /
              filteredResults[filteredResults.length - 1].totalPossibleScore) *
              100 -
            (filteredResults[filteredResults.length - 2].score /
              filteredResults[filteredResults.length - 2].totalPossibleScore) *
              100
          : 0,
      improvementRate: calculateImprovementRate(filteredResults),
      consistencyScore: calculateConsistencyScore(scores),
    };
  }, [filteredResults]);

  // Helper functions for advanced metrics
  function calculateImprovementRate(results: UserResultAndRelation[]) {
    if (results.length < 2) return 0;
    const firstScore = (results[0].score / results[0].totalPossibleScore) * 100;
    const lastScore =
      (results[results.length - 1].score /
        results[results.length - 1].totalPossibleScore) *
      100;
    return ((lastScore - firstScore) / firstScore) * 100;
  }

  // @ts-ignore
  function calculateConsistencyScore(scores) {
    if (scores.length < 2) return 100;
    // @ts-ignore
    const mean = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
    const variance =
      // @ts-ignore
      scores.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) /
      scores.length;
    const standardDeviation = Math.sqrt(variance);
    // Convert to a 0-100 scale where lower deviation means higher consistency
    return Math.max(0, 100 - standardDeviation * 2);
  }

  // @ts-ignore
  const handleQuizClick = (data) => {
    setSelectedQuiz(data);
  };

  return (
    <div className="space-y-6 my-5">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(timeRanges).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start w-full flex-col gap-3">
              <div className="">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Average Score
                </p>
                <h3 className="lg:text-xl text-base font-bold">
                  {stats.averageScore.toFixed(1)}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start w-full flex-col gap-3">
              <div className="">
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Quizzes Taken
                </p>
                <h3 className="lg:text-xl text-base font-bold">
                  {stats.totalQuizzes}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start w-full flex-col gap-3">
              <div className="">
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Best Score</p>
                <h3 className="lg:text-xl text-base font-bold">
                  {stats.bestScore.toFixed(1)}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start w-full flex-col gap-3">
              <div className="">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Recent Trend
                </p>
                <h3
                  className="lg:text-xl text-base font-bold"
                  style={{
                    color: stats.recentTrend >= 0 ? "#16a34a" : "#dc2626",
                  }}
                >
                  {stats.recentTrend > 0 ? "+" : ""}
                  {stats.recentTrend.toFixed(1)}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start w-full flex-col gap-3">
              <div className="">
                <TrendingUp className="h-8 w-8 text-pink-500" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Improvement Rate
                </p>
                <h3
                  className="lg:text-xl text-base font-bold"
                  style={{
                    color: stats.improvementRate >= 0 ? "#16a34a" : "#dc2626",
                  }}
                >
                  {stats.improvementRate > 0 ? "+" : ""}
                  {stats.improvementRate.toFixed(1)}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start w-full flex-col gap-3">
              <div className="">
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Consistency</p>
                <h3 className="lg:text-xl text-base font-bold">
                  {stats.consistencyScore.toFixed(1)}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Timeline</CardTitle>
            <CardDescription>
              Click on any point to see detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(1)}%`,
                      "Score",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4, onClick: handleQuizClick }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Distribution</CardTitle>
            <CardDescription>Number of questions per quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalQuestions" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Quiz Details */}
      {selectedQuiz && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>
              {/* @ts-ignore */}
              Completed on {selectedQuiz.completed}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-xl font-bold">
                  {/* @ts-ignore */}
                  {selectedQuiz.score.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="text-xl font-bold">
                  {/* @ts-ignore */}
                  {selectedQuiz.totalQuestions}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Raw Score</p>
                {/* @ts-ignore */}
                <p className="text-xl font-bold">{selectedQuiz.rawScore}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quiz ID</p>
                <p className="text-xl font-bold truncate">
                  {/* @ts-ignore */}
                  {selectedQuiz.quizId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data Alert */}
      {filteredResults.length === 0 && (
        <Alert>
          <AlertDescription>
            No quiz results found for the selected time period. Try selecting a
            different time range or take some quizzes!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default QuizPerformanceTracker;
