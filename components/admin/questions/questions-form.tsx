"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Category, Quiz } from "@prisma/client";
import { toast } from "sonner";
import { createQuestion, updateQuestion } from "@/actions/question-actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const QuestionType = z.enum(["multiple-choice", "short-answer", "true-false"]);
const QuestionDifficulty = z.enum(["easy", "medium", "hard"]);

const baseQuestionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, "Question must be at least 3 characters")
    .max(500, "Question must be less than 500 characters"),
  type: QuestionType,
  quizId: z.string({
    required_error: "Please select a quiz",
  }),
  explanation: z
    .string()
    .trim()
    .min(10, "Explanation must be at least 10 characters")
    .max(500, "Explanation must be less than 500 characters"),
  timeLimit: z.number().min(10).max(300),
  points: z.number().min(1).max(100),
  shuffleOptions: z.boolean().default(false),
});

const multipleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal("multiple-choice"),
  options: z.array(z.string()).min(4).max(4),
  correctAnswer: z.string().min(0).max(3),
});

const trueFalseSchema = baseQuestionSchema.extend({
  type: z.literal("true-false"),
  correctAnswer: z.string().min(1),
});

const shortAnswerSchema = baseQuestionSchema.extend({
  type: z.literal("short-answer"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

const questionFormSchema = z.discriminatedUnion("type", [
  multipleChoiceSchema,
  trueFalseSchema,
  shortAnswerSchema,
]);

export type QuestionFormData = z.infer<typeof questionFormSchema>;

interface CreateQuestionFormProps {
  initialData?: QuestionFormData;
  quizzes: Quiz[];
}

const DEFAULT_FORM_VALUES = {
  text: "",
  type: "multiple-choice" as const,
  explanation: "",
  timeLimit: 60,
  points: 10,
  shuffleOptions: false,
  options: ["", "", "", ""],
  correctAnswer: "",
};

export function CreateQuestionForm({
  quizzes,
  initialData,
}: CreateQuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData || DEFAULT_FORM_VALUES,
  });

  const questionType = form.watch("type");

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof questionFormSchema>) {
    const toastId = toast.loading(
      `${initialData ? "Updating" : "Creating"} question...`,
      {
        description: `Please wait while we ${
          initialData ? "update" : "create"
        } your question.`,
      }
    );

    try {
      setIsSubmitting(true);

      const action = initialData
        ? // @ts-ignore
          updateQuestion(initialData.id, values) // @ts-ignore
        : createQuestion(values);
      console.log(values);
      const { question, error } = await action;

      if (error) {
        toast.error(`Failed to ${initialData ? "update" : "create"} question`, {
          description: error,
          id: toastId,
        });
        return;
      }

      if (question) {
        toast.success(
          `Question ${initialData ? "updated" : "created"} successfully`,
          {
            id: toastId,
          }
        );
        router.push("/admin/questions");
      }
    } catch (error) {
      console.log("Question operation failed:", error);
      toast.error("Operation failed", {
        description: "An unexpected error occurred. Please try again later.",
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Question" : "Create New Question"}
        </CardTitle>
        <CardDescription>
          {initialData
            ? "Edit the question details below."
            : "Fill in the details to create a new question."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      className="min-h-[100px]"
                      placeholder="Enter your question here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="multiple-choice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {questionType === "true-false" && (
              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex space-x-4"
                        defaultValue={field.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.onChange(String(value === "true"))
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="true"
                            disabled={isSubmitting}
                          />
                          <FormLabel>True</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="false"
                            disabled={isSubmitting}
                          />
                          <FormLabel>False</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {questionType === "short-answer" && (
              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the correct answer"
                        disabled={isSubmitting}
                        {...field}
                        value={
                          typeof field.value === "boolean" ? "" : field.value
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {questionType === "multiple-choice" && (
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options</FormLabel>
                    <FormControl>
                      <RadioGroup className="space-y-2">
                        {field.value.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option}
                              checked={form.watch("correctAnswer") === option}
                              onClick={() =>
                                form.setValue("correctAnswer", option)
                              }
                              disabled={isSubmitting}
                            />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...field.value];
                                newOptions[index] = e.target.value;
                                field.onChange(newOptions);
                              }}
                              placeholder={`Option ${index + 1}`}
                              disabled={isSubmitting}
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="quizId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a quiz" />
                      </SelectTrigger>
                      <SelectContent>
                        {quizzes.map((quiz) => (
                          <SelectItem key={quiz.id} value={quiz.id}>
                            {quiz.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Provide an explanation for the correct answer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter time limit"
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter points"
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shuffleOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="shuffle-options"
                        />
                        <FormLabel htmlFor="shuffle-options">
                          Shuffle Options
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
