"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { signIn } from "@/auth";
import { Bolt } from "lucide-react";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const res = await signIn("google", { redirectTo: "/user" });

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <div className="">
              <Bolt size={40} className="bg-primary rounded-full p-1 mx-auto" />
            </div>
            <CardTitle className="mx-auto">Welcome to Quiz Master</CardTitle>
            <CardDescription className="mx-auto">
              Sign in to start your quiz journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Signing In..."
              ) : (
                <>
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Sign in with Google
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By signing in, you agree to our Terms and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
