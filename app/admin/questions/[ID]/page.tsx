import { getQuestionById } from "@/actions/question-actions";
import { getQuizzes } from "@/actions/quiz-actions";
import {
  CreateQuestionForm,
  QuestionFormData,
} from "@/components/admin/questions/questions-form";
import { RouteErrorComponent } from "@/components/Errors/error-component";
import React from "react";

const page = async ({ params: { ID } }: { params: { ID: string } }) => {
  let initialData: QuestionFormData | undefined = undefined;
  if (ID === "new") {
    initialData = undefined;
  } else {
    const result = await getQuestionById(ID);
    if ("error" in result) {
      return <RouteErrorComponent error={result.error} info={result.error} />;
    }
    // @ts-ignore
    initialData = {
      ...result.question,
      //   @ts-ignore
      type: result.question.type as
        | "multiple-choice"
        | "short-answer"
        | "true-false",
    };
    // console.log(initialData);
  }
  const { error, quizzes } = await getQuizzes();
  if (error) return <RouteErrorComponent error={error} info={error} />;

  return (
    <div className="w-full">
      <CreateQuestionForm initialData={initialData} quizzes={quizzes || []} />
    </div>
  );
};

export default page;
