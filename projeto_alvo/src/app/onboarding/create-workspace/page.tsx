"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Changed from react-router-dom
import { useToast } from "@/hooks/use-toast"; // Assuming path is correct

export default function CreateWorkspacePage() { // Renamed component
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Changed from useNavigate
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    setLoading(true);

    // Simular criação do workspace
    // In a real app, this would involve an API call to the backend (e.g., a Genkit flow)
    // For now, we'll keep the simulation to match the original logic.
    // The actual WorkspaceContext logic for adding a workspace will be handled separately.
    setTimeout(() => {
      toast({
        title: "Workspace criado com sucesso!",
        description: `"${workspaceName}" está pronto para uso (simulado).`,
      });
      // TODO: Add workspace to context/state if not already handled by a global state manager triggered by an API call
      router.push("/dashboard"); // Changed to router.push
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Criar Workspace</CardTitle>
          <CardDescription>
            Dê um nome ao seu ambiente de trabalho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Nome do ambiente</Label>
              <Input
                id="workspace-name"
                placeholder="Ex: Direito Empresarial, Consultoria Civil..."
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Escolha um nome que represente a área ou tipo de trabalho
              </p>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={!workspaceName.trim() || loading}
              >
                {loading ? (
                  "Criando..."
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Criar Workspace
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/dashboard")} // Changed to router.push
                variant="outline"
                className="w-full"
                disabled={loading} // Disable while "creating"
              >
                Pular por enquanto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
