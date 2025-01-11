"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modalStore";
import { PlusCircle } from "lucide-react";
import React from "react";

const CRUDQBTN = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <Button onClick={() => onOpen({ type: "create::quiz:modal" })}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Quiz
      </Button>
    </div>
  );
};

export default CRUDQBTN;
