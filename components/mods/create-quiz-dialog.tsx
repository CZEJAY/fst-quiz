"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/context/modalStore";
import { Category } from "@prisma/client";
import { getCategories } from "@/actions/category-actions";
import { createQuiz, updateQuiz } from "@/actions/quiz-actions";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

const QuizDifficulty = z.enum(["easy", "medium", "hard"]);
const QuizStatus = z.enum(["draft", "published", "archived"]);

const quizFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  categoryId: z.string({
    required_error: "Please select a category",
  }),
  difficulty: QuizDifficulty,
  status: QuizStatus,
});

type QuizFormData = z.infer<typeof quizFormSchema> & { id?: string };

const DEFAULT_FORM_VALUES: Omit<QuizFormData, "categoryId"> = {
  title: "",
  description: "",
  difficulty: "medium",
  status: "draft",
};

export function CreateQuizDialog() {
  const { isOpen, type, data, onClose } = useModal();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [initialData, setInitialData] = React.useState<QuizFormData | null>(
    null
  );

  const isModalOpen = isOpen && type === "create::quiz:modal";

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSubmit = React.useCallback(
    async (formData: QuizFormData) => {
      const toastId = toast.loading(
        `${initialData ? "Updating" : "Creating"} quiz...`,
        {
          description: `Please wait while we ${
            initialData ? "update" : "create"
          } your quiz.`,
        }
      );

      try {
        setIsSubmitting(true);

        const action = initialData
          ? updateQuiz(initialData.id!, formData)
          : createQuiz(formData);

        const { quiz, error } = await action;

        if (error) {
          toast.error(`Failed to ${initialData ? "update" : "create"} quiz`, {
            description: error,
            id: toastId,
          });
          return;
        }

        if (quiz) {
          toast.success(
            `Quiz ${initialData ? "updated" : "created"} successfully`,
            {
              id: toastId,
            }
          );
          handleCloseAndCleanUp();
        }
      } catch (error) {
        console.error("Quiz operation failed:", error);
        toast.error("Operation failed", {
          description: "An unexpected error occurred. Please try again later.",
          id: toastId,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [initialData]
  );

  const handleCloseAndCleanUp = React.useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES);
    setInitialData(null);
    onClose();
  }, [form, onClose]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      const { categories: fetchedCategories, error } = await getCategories(
        "active"
      );
      if (error) {
        toast.error("Failed to fetch categories", {
          description: error,
        });
        return;
      }
      //   console.log(fetchedCategories);
      if (fetchedCategories) {
        setCategories(fetchedCategories);
      }
    };

    if (isModalOpen) {
      fetchCategories();
    }
  }, [isModalOpen]);

  React.useEffect(() => {
    if (data) {
      setInitialData(data as QuizFormData);
      console.log(data);

      form.reset(data as QuizFormData);
    }
  }, [data, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseAndCleanUp}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Quiz" : "Create New Quiz"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edit the quiz details below."
              : "Fill in the details to create a new quiz."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter quiz title"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
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
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
