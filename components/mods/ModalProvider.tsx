"use client";
import React, { useEffect, useState } from "react";
import { CreateCategory } from "./create-category";
import { CreateQuizDialog } from "./create-quiz-dialog";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateCategory />
      <CreateQuizDialog />
    </>
  );
};

export default ModalProvider;
