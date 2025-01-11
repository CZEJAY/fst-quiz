import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QuizCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}
