"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Bot, ArrowLeft } from "lucide-react";
import Link from "next/link";
// import { useAgents } from "@/contexts/AgentsContext"; // Placeholder for later
// import { useEffect, useState } from "react"; // Placeholder for fetching agents

interface Agent {
  id: string;
  name: string;
  type: string;
  status: "Ativo" | "Inativo" | "Em configuração";
}

export default function AgentsPage() {
  // const { agents } = useAgents(); // Placeholder for fetching actual agents
  const [exampleAgents, setExampleAgents] = useState<Agent[]>([ // Using example data for now
    { id: "1", name: "Revisão Contratual", type: "Análise de Documentos", status: "Ativo" },
    { id: "2", name: "Compliance LGPD", type: "Compliance", status: "Ativo" },
    { id: "3", name: "Pesquisa Jurisprudencial", type: "Pesquisa Jurídica", status: "Em configuração" },
    { id: "4", name: "Elaboração de Petição Inicial", type: "Redação de Documentos", status: "Ativo" },
  ]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
            </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Meus Agentes IA</h1>
                <p className="text-muted-foreground">
                Gerencie seus agentes de inteligência artificial especializados.
                </p>
            </div>
        </div>
        <Button asChild>
          <Link href="/agents/create">
            <Plus className="mr-2 h-4 w-4" />
            Criar Novo Agente
          </Link>
        </Button>
      </div>

      {exampleAgents.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Nenhum agente encontrado</CardTitle>
            <CardDescription>Crie seu primeiro agente para começar a automatizar tarefas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/agents/create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Agente
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{agent.name}</CardTitle>
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${
                            agent.status === "Ativo" ? "bg-green-100 text-green-800" :
                            agent.status === "Em configuração" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {agent.status}
                    </span>
                </div>
                <CardDescription>{agent.type}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add more agent details or actions here if needed */}
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
