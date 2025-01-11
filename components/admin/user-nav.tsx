"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { status, data } = useSession();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          // disabled={status === "loading"}
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
        >
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={data?.user?.image ?? ""}
                alt={data?.user?.name ?? ""}
              />
              <AvatarFallback>
                {data?.user?.name?.charAt(0) ?? ""}
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      {status === "authenticated" && (
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {data?.user?.name ?? ""}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {data?.user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {
              // @ts-ignore
              data?.user.role === "Admin" && (
                <DropdownMenuItem onClick={() => router.push("/admin")}>
                  Manage
                  <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            }
            <DropdownMenuItem onClick={() => router.push("/user/profile")}>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/user/profile")}>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
