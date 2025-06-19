"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardTitle, CardDescription if not used directly
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link"; // Changed from react-router-dom
import { useWorkspace } from "@/contexts/WorkspaceContext"; // Assuming path is correct
import { useToast } from "@/hooks/use-toast"; // Assuming path is correct

export default function WorkspacePage() { // Renamed component
  const { workspaces, addWorkspace, selectedWorkspace, setSelectedWorkspace, getAgentsForWorkspace } = useWorkspace();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const { toast } = useToast();

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      // The actual creation logic might be more complex, involving backend calls.
      // For now, this matches the source project's client-side simulation.
      const newWorkspace = {
        id: Date.now().toString(), // Simple ID generation
        name: newWorkspaceName,
        // icon and iconColor are not in the provided type, but kept if needed by UI
        // icon: "Building2",
        // iconColor: "text-blue-500",
        createdAt: new Date().toLocaleDateString() // Simple date formatting
      };

      addWorkspace(newWorkspace); // This should update the context
      setSelectedWorkspace(newWorkspace); // Set the new one as active
      setNewWorkspaceName("");
      setIsCreateOpen(false);

      toast({
        title: "Ambiente criado!",
        description: `${newWorkspaceName} foi criado com sucesso.`,
      });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8"> {/* Added padding */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard"> {/* Changed to href */}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ambientes de Trabalho</h1>
          <p className="text-muted-foreground">
            Gerencie seus ambientes e organize seus agentes de IA
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Ambiente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Ambiente</DialogTitle>
              <DialogDescription>
                Defina um nome para o seu novo ambiente de trabalho
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4"> {/* Added py-4 for spacing */}
              <div>
                <Label htmlFor="workspace-name">Nome do Ambiente</Label>
                <Input
                  id="workspace-name"
                  placeholder="Ex: Escritório, Promotoria..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {workspaces.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum ambiente criado
          </h3>
          <p className="text-gray-600 mb-4">
            Crie seu primeiro ambiente de trabalho para organizar seus agentes
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Ambiente
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {workspaces.map((workspace) => {
          const agentCount = getAgentsForWorkspace(workspace.id).length;
          const isSelected = selectedWorkspace?.id === workspace.id;

          return (
            <Card key={workspace.id} className={`group hover:shadow-lg transition-shadow duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-muted text-primary"> {/* Adjusted styling */}
                    <Building2 className="h-6 w-6" /> {/* Assuming icon is fixed or passed */}
                  </div>
                  {isSelected && (
                    <Badge className="bg-primary text-primary-foreground">
                      Ativo
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-foreground mb-2 text-lg"> {/* Adjusted text color */}
                  {workspace.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Agentes</span> {/* Adjusted text color */}
                    <Badge variant="secondary"> {/* Default secondary badge style */}
                      {agentCount}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Criado em {workspace.createdAt}</p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => setSelectedWorkspace(workspace)}
                    className="w-full"
                    variant={isSelected ? "secondary" : "default"}
                    disabled={isSelected}
                  >
                    {isSelected ? "Ambiente Ativo" : "Selecionar"}
                  </Button>

                  {isSelected && (
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/agents/create"> {/* Changed to href */}
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Agente
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
