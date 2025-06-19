"use client"; // Required for usePathname and useEffect

import { usePathname } from "next/navigation"; // For logging the path
import { useEffect } from "react";
import Link from "next/link"; // For navigation
import { Button } from "@/components/ui/button"; // Optional: for styling the button
import { ShieldAlert } from "lucide-react"; // Optional: for an icon

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    // You could also send this to a logging service
    console.error(
      `404 Error: User attempted to access non-existent route: ${pathname}`
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <ShieldAlert className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-6xl font-bold text-destructive">404</h1>
        <p className="text-2xl md:text-3xl font-semibold text-foreground">
          Oops! Página não encontrada.
        </p>
        <p className="text-lg text-muted-foreground max-w-md">
          A página que você está tentando acessar não existe ou foi movida.
          Verifique o URL ou retorne à página inicial.
        </p>
        <div>
          <Button asChild size="lg">
            <Link href="/">Retornar à Página Inicial</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Tentativa de acesso: <code className="bg-muted p-1 rounded text-xs">{pathname}</code>
        </p>
      </div>
    </div>
  );
}
