"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/user/dashboard-shell";
import { DashboardHeader } from "@/components/user/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock data - replace with actual API call
const mockLearningMaterials = [
  {
    id: "1",
    title: "Introduction to React",
    content: "React is a JavaScript library for building user interfaces...",
    category: "Web Development",
  },
  {
    id: "2",
    title: "Python Basics",
    content: "Python is a high-level, interpreted programming language...",
    category: "Programming",
  },
  // Add more mock learning materials as needed
];

export default function LearningPage() {
  const [materials, setMaterials] = useState(mockLearningMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    content: "",
    category: "",
  });

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterial = () => {
    // In a real application, you would make an API call here
    const newId = (materials.length + 1).toString();
    setMaterials([...materials, { ...newMaterial, id: newId }]);
    setNewMaterial({ title: "", content: "", category: "" });
    toast.success("Learning material added successfully");
  };

  const handleDeleteMaterial = (id: string) => {
    // In a real application, you would make an API call here

    setMaterials(materials.filter((m) => m.id !== id));
    toast.success("Learning material deleted successfully");
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Learning Materials"
        text="Manage and create learning materials for your users."
      />
      <div className="space-y-4">
        <div className="flex justify-between gap-4">
          <Input
            placeholder="Search learning materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Material</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Learning Material</DialogTitle>
                <DialogDescription>
                  Create a new learning material here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newMaterial.title}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, title: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={newMaterial.category}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        category: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={newMaterial.content}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        content: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddMaterial}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id}>
              <CardHeader>
                <CardTitle>{material.title}</CardTitle>
                <CardDescription>{material.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{material.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteMaterial(material.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
