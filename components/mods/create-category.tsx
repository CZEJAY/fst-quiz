"use client";

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
import { Textarea } from "@/components/ui/textarea";
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
import { useEffect, useState, useCallback } from "react";
import { createCategory, updateCategory } from "@/actions/category-actions";
import { toast } from "sonner";
import { useModal } from "@/context/modalStore";
import { Category } from "../admin/category/category-table";
import { categoryFormSchema } from "@/schemas/zodSchemas";

type CategoryFormData = z.infer<typeof categoryFormSchema>;

const DEFAULT_FORM_VALUES: CategoryFormData = {
  name: "",
  description: "",
  status: "draft",
};

export function CreateCategory() {
  const { isOpen, data, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "create::category:modal";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Category | null>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSubmit = useCallback(
    async (formData: CategoryFormData) => {
      const toastId = toast.loading(
        `${initialData ? "Updating" : "Creating"} category...`,
        {
          description: `Please wait while we ${
            initialData ? "update" : "create"
          } your category.`,
        }
      );

      try {
        setIsSubmitting(true);

        const action = initialData
          ? updateCategory(initialData.id, formData)
          : createCategory(formData);

        const { category, error } = await action;

        if (error) {
          toast.error(
            `Failed to ${initialData ? "update" : "create"} category`,
            {
              description: error,
              id: toastId,
            }
          );
          return;
        }

        if (category) {
          toast.success(
            `Category ${initialData ? "updated" : "created"} successfully`,
            {
              id: toastId,
            }
          );
          handleCloseAndCleanUp();
        }
      } catch (error) {
        console.error("Category operation failed:", error);
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

  const handleCloseAndCleanUp = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES);
    setInitialData(null);
    onClose();
  }, [form, onClose]);

  useEffect(() => {
    if (data) {
      setInitialData(data as Category);
      form.reset(data as CategoryFormData);
    }
  }, [data, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseAndCleanUp}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edit the category details below."
              : "Fill in the details below to create a new category."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
