"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteQuestion } from "@/actions/question-actions";
import DeleteConfirmationModal from "@/components/mods/DeleteConfirmationModal";

// This would typically come from your database
// const data: Question[] = [
//   {
//     id: "1",
//     question: "What is the capital of France?",
//     type: "Multiple Choice",
//     difficulty: "Easy",
//     category: "Geography",
//     quiz: "European Capitals",
//   },
//   {
//     id: "2",
//     question: "Who wrote 'To Kill a Mockingbird'?",
//     type: "Short Answer",
//     difficulty: "Medium",
//     category: "Literature",
//     quiz: "20th Century Literature",
//   },
//   {
//     id: "3",
//     question: "What is the chemical symbol for gold?",
//     type: "Multiple Choice",
//     difficulty: "Easy",
//     category: "Science",
//     quiz: "Periodic Table",
//   },
//   {
//     id: "4",
//     question: "In what year did World War II end?",
//     type: "Multiple Choice",
//     difficulty: "Medium",
//     category: "History",
//     quiz: "World War II",
//   },
// ];

export type Question = {
  id: string;
  question: string;
  type: "Multiple Choice" | "Short Answer" | "True/False";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  quiz: string;
};

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "question",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Question
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("question")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as string;
      return (
        <Badge
          variant={
            difficulty === "easy"
              ? "secondary"
              : difficulty === "medium"
              ? "default"
              : "destructive"
          }
          className="capitalize"
        >
          {difficulty}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "quiz",
    header: "Quiz",
    cell: ({ row }) => <div>{row.getValue("quiz")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const question = row.original;
      const router = useRouter();
      const [isOpen, setOpen] = React.useState(false);
      const handleDelete = async () => {
        const toastId = toast.loading("Deleting question...");
        const { success, error } = await deleteQuestion(question.id);
        if (success) {
          toast.success("Question deleted successfully", { id: toastId });
          setOpen(false);
        } else if (error) {
          toast.error("Error deleting question", {
            description: error,
            id: toastId,
          });
          setOpen(false);
        }
      };
      return (
        <>
          <DeleteConfirmationModal
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            onDelete={() => handleDelete()}
            promptName={question.question}
            promptType={"question"}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(question.id)}
              >
                Copy Question ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/admin/questions/${question.id}`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Question
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Question
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export function QuestionsTable({ data }: { data: Question[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter questions..."
          value={
            (table.getColumn("question")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("question")?.setFilterValue(event.target.value)
          }
          className=""
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
