"use client";

import { SidebarTrigger } from "@/components/ui/sidebar"; // Assuming path is correct
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation"; // Changed from react-router-dom
import { WorkspaceSelector } from "./WorkspaceSelector"; // Assuming path is correct
import { useAuth } from "@/hooks/useAuth"; // Added for logout and user info

export function Header() {
  const router = useRouter(); // Changed from useNavigate
  const { user, signOut } = useAuth(); // Get user and signOut method

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
      // Optionally show a toast notification for logout failure
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-gray-800 dark:bg-gray-950/90"> {/* Added dark mode classes */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <WorkspaceSelector />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || user.email || "Usuário"} />
                  <AvatarFallback>
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user.displayName || "Usuário"}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:text-red-400 dark:focus:bg-red-900/50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" onClick={() => router.push("/login")}>
            Fazer Login
          </Button>
        )}
      </div>
    </header>
  );
}
