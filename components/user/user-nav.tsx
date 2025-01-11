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
import { stat } from "fs";
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { status, data } = useSession();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {status === "loading" ? (
          <Skeleton className="h-8 rounded-full px-1 bg-accent">
            <Skeleton className="h-8 w-8 rounded-full "></Skeleton>
          </Skeleton>
        ) : (
          <Button
            variant="ghost"
            className="relative h-8 w-full justify-start rounded-[0.5rem] text-sm font-medium"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={data?.user?.image || "/avatar.png"}
                alt="@username"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <span className="ml-2">{data?.user?.name || "username"}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {data?.user?.name || "username"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {data?.user?.email || "email"}
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
    </DropdownMenu>
  );
}
