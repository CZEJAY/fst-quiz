"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modalStore";
import { PlusCircle } from "lucide-react";
import React from "react";

const CrudBtn = () => {
  const { onOpen } = useModal();
  return (
    <Button onClick={() => onOpen({ type: "create::category:modal" })}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Category
    </Button>
  );
};

export default CrudBtn;
