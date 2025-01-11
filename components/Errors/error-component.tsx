import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RouteErrorComponent({
  error,
  info,
  reset,
}: {
  error: unknown;
  info?: string;
  reset?: unknown;
}) {
  return (
    <div className="flex items-center justify-center w-full min-h-full ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Something went wrong!
          </CardTitle>
          <CardDescription className="sm:text-sm  text-xs">
            We're sorry, but an unexpected error has occurred. Please try again.
            If the problem persists, please contact support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{info}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <a href="mailto:calebjimmy67@atoovis.com">
            <Button variant="outline">Contact Support</Button>
          </a>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/app")}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
