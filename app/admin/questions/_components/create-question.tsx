"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const CreateQuestion = () => {
  return (
    <Link href={"/admin/questions/new"}>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Question
      </Button>
    </Link>
  );
};

export default CreateQuestion;
