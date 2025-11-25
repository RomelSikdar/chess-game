"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-transparent"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  //   return (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button variant="outline" size="icon" className="bg-transparent">

  //           <span className="sr-only">Toggle theme</span>
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="end">
  //         <DropdownMenuItem onClick={() => setTheme("light")}>
  //           <Sun className="mr-2 h-4 w-4" />
  //           Light
  //         </DropdownMenuItem>
  //         <DropdownMenuItem onClick={() => setTheme("dark")}>
  //           <Moon className="mr-2 h-4 w-4" />
  //           Dark
  //         </DropdownMenuItem>
  //         <DropdownMenuItem onClick={() => setTheme("system")}>
  //           <Monitor className="mr-2 h-4 w-4" />
  //           System
  //         </DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   );
}
