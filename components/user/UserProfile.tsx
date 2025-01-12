"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Book,
  Star,
  Trophy,
  Target,
  Flame,
  Shapes,
} from "lucide-react";
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

// Types for our data structures
type QuizDifficulty = "easy" | "medium" | "hard";
type CategoryStatus = "active" | "draft" | "archived";
type QuizStatus = "published" | "draft" | "archived";

interface Quiz {
  id: string;
  title: string;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  category: {
    name: string;
  };
}

interface QuizResult {
  score: number;
  totalPossibleScore: number;
  completed: string;
  quiz: Quiz;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "Admin" | "User";
  createdAt: string;
  quizResults: QuizResult[];
  createdQuizzes: Quiz[];
}

interface ProfileStats {
  basic: {
    averageScore: string;
    totalQuizzes: number;
    createdQuizzes: number;
    memberSince: string;
    bestScore: string;
    recentAverage: string;
    streak: number;
  };
  detailed: {
    difficultyAverages: Record<QuizDifficulty, string>;
    categoryAverages: Record<string, string>;
  };
}

// Statistics calculation function
const calculateProfileStats = (profile: UserProfile): ProfileStats => {
  // Basic stats
  const totalQuizzes = profile.quizResults.length;
  const createdQuizzes = profile.createdQuizzes.length;

  // Calculate average score
  const averageScore =
    profile.quizResults.length > 0
      ? (
          profile.quizResults.reduce(
            (acc, result) =>
              acc + (result.score / result.totalPossibleScore) * 100,
            0
          ) / totalQuizzes
        ).toFixed(1)
      : "0";

  // Calculate performance by difficulty
  const performanceByDifficulty = profile.quizResults.reduce((acc, result) => {
    const difficulty = result.quiz.difficulty;
    if (!acc[difficulty]) {
      acc[difficulty] = {
        total: 0,
        count: 0,
      };
    }
    acc[difficulty].total += (result.score / result.totalPossibleScore) * 100;
    acc[difficulty].count += 1;
    return acc;
  }, {} as Record<QuizDifficulty, { total: number; count: number }>);

  // Calculate difficulty averages
  const difficultyAverages = Object.entries(performanceByDifficulty).reduce(
    (acc, [difficulty, data]) => {
      acc[difficulty as QuizDifficulty] = (data.total / data.count).toFixed(1);
      return acc;
    },
    {} as Record<QuizDifficulty, string>
  );

  // Best score calculation
  const bestScore =
    profile.quizResults.length > 0
      ? Math.max(
          ...profile.quizResults.map(
            (result) => (result.score / result.totalPossibleScore) * 100
          )
        ).toFixed(1)
      : "0";

  // Recent average calculation
  const recentQuizzes = [...profile.quizResults]
    .sort(
      (a, b) =>
        new Date(b.completed).getTime() - new Date(a.completed).getTime()
    )
    .slice(0, 5);

  const recentAverage =
    recentQuizzes.length > 0
      ? (
          recentQuizzes.reduce(
            (acc, result) =>
              acc + (result.score / result.totalPossibleScore) * 100,
            0
          ) / recentQuizzes.length
        ).toFixed(1)
      : "0";

  // Category performance calculation
  const categoryPerformance = profile.quizResults.reduce((acc, result) => {
    const category = result.quiz.category.name;
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        count: 0,
      };
    }
    acc[category].total += (result.score / result.totalPossibleScore) * 100;
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const categoryAverages = Object.entries(categoryPerformance).reduce(
    (acc, [category, data]) => {
      acc[category] = (data.total / data.count).toFixed(1);
      return acc;
    },
    {} as Record<string, string>
  );

  // Activity streak calculation
  const streak = profile.quizResults.reduce((acc, result) => {
    const today = new Date();
    const completed = new Date(result.completed);
    const diffDays = Math.floor(
      (today.getTime() - completed.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7 ? acc + 1 : acc;
  }, 0);

  return {
    basic: {
      averageScore,
      totalQuizzes,
      createdQuizzes,
      memberSince: new Date(profile.createdAt).toLocaleDateString(),
      bestScore,
      recentAverage,
      streak,
    },
    detailed: {
      difficultyAverages,
      categoryAverages,
    },
  };
};

interface UserProfileProps {
  profile: UserProfile;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  const stats = calculateProfileStats(profile);
  const getInitials = (name: string | null): string => {
    return (name || "")
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Prepare chart data
  const difficultyChartData = Object.entries(
    stats.detailed.difficultyAverages
  ).map(([difficulty, average]) => ({
    difficulty,
    average: parseFloat(average),
  }));

  const categoryChartData = Object.entries(stats.detailed.categoryAverages).map(
    ([category, average]) => ({
      category,
      average: parseFloat(average),
    })
  );

  return (
    <div className="space-y-6 mt-4">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.image || ""} alt={profile.name || ""} />
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="lg:text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-500">{profile.email}</p>
              <div className="flex items-center mt-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Member since {stats.basic.memberSince}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 flex-col">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-bold">
                  {stats.basic.averageScore}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 flex-col">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Best Score</p>
                <p className="text-2xl font-bold">{stats.basic.bestScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 flex-col">
              <Book className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Quizzes Taken</p>
                <p className="text-2xl font-bold">{stats.basic.totalQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 flex-col">
              <Star className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-2xl font-bold">
                  {stats.basic.createdQuizzes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 flex-col">
              <Shapes className="w-8 h-8 text-pink-500" />
              <div>
                <p className="text-sm text-gray-500">Recent Avg</p>
                <p className="text-2xl font-bold">
                  {stats.basic.recentAverage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 flex-col">
              <Flame className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Week Streak</p>
                <p className="text-2xl font-bold">{stats.basic.streak}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="history">Quiz History</TabsTrigger>
          <TabsTrigger className="hidden md:block" value="created">
            Created Quizzes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={difficultyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="difficulty" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[...profile.quizResults]
                  .sort(
                    (a, b) =>
                      new Date(b.completed).getTime() -
                      new Date(a.completed).getTime()
                  )
                  .map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{result.quiz.title}</p>
                        <p className="text-sm text-gray-500">
                          {result.quiz.category.name} • {result.quiz.difficulty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {(
                            (result.score / result.totalPossibleScore) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(result.completed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="created">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {profile.createdQuizzes.map((quiz, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-sm text-gray-500">
                        {quiz.category.name} • {quiz.difficulty}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          quiz.status === "published"
                            ? "bg-green-100 text-green-800"
                            : quiz.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
