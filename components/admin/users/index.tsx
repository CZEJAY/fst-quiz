"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@prisma/client";
import { DashboardShell } from "@/components/user/dashboard-shell";
import { DashboardHeader } from "@/components/user/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/actions/user-actions";

export default function UsersPage({ initial }: { initial: User[] }) {
  const [users, setUsers] = useState<User[]>(initial);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const filteredUsers = users.filter(
    (user) =>
      //@ts-ignore
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || //@ts-ignore
      user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setLoading(true);
    if (!updatedUser) return;
    const { error, user } = await updateUser(updatedUser.id, {
      // @ts-ignore
      email: updatedUser.email,
      // @ts-ignore
      name: updatedUser.name,
      role: updatedUser.role,
    });
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }
    setEditingUser(null);
    setLoading(false);
    router.refresh();
    toast.success("User updated successfully");
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    toast.success("User deleted successfully");
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="User Management"
        text="Manage your application users here."
      />
      <div className="space-y-4">
        <div className="flex justify-between">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button disabled>Add New User</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(editingUser);
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editingUser.name || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={editingUser.email || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={editingUser.role || ""}
                    onValueChange={(value: UserRole) =>
                      setEditingUser({ ...editingUser, role: value })
                    }
                    name="role"
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={editingUser.role || "Select role"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button disabled={loading} type="submit">
                  {loading ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
