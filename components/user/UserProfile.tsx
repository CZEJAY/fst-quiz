import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Book, Star, Trophy } from "lucide-react";
import { UserAndRelationWithProfile } from "@/actions/leaderboard";

const UserProfile = ({ profile }: { profile: UserAndRelationWithProfile }) => {
  // Calculate statistics
  const stats = {
    averageScore:
      profile.quizResults.length > 0
        ? (
            profile.quizResults.reduce(
              (acc, result) =>
                acc + (result.score / result.totalPossibleScore) * 100,
              0
            ) / profile.quizResults.length
          ).toFixed(1)
        : 0,
    totalQuizzes: profile.quizResults.length,
    createdQuizzes: profile.createdQuizzes.length,
    memberSince: new Date(profile.createdAt).toLocaleDateString(),
  };

  const getInitials = (name: string) => {
    return (name || "")
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={profile.image || "/avatar.png"}
                alt={profile.name || "User image"}
              />
              <AvatarFallback>
                {getInitials(profile.name as string)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-500">{profile.email}</p>
              <div className="flex items-center mt-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Member since {stats.memberSince}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Book className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Quizzes Taken</p>
                <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {profile.role === "Admin" && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Star className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Quizzes Created</p>
                  <p className="text-2xl font-bold">{stats.createdQuizzes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="created">Created Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {profile.quizResults
                  // @ts-ignore
                  .sort((a, b) => new Date(b.completed) - new Date(a.completed))
                  .map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border-b border rounded-lg"
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
                    className="flex items-center justify-between p-4 border-b border rounded-lg"
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
