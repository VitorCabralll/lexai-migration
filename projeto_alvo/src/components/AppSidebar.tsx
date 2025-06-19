"use client";

import {
  Home,
  FileText,
  Users,
  Settings,
  Building2,
  HelpCircle,
  Plus,
  Crown,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import Link from "next/link"; // Changed from react-router-dom
import { usePathname } from "next/navigation"; // Changed from react-router-dom
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"; // Assuming this path is correct
import { useWorkspace } from "@/contexts/WorkspaceContext"; // Assuming path is correct
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainItems = [
  {
    title: "Início",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Criar Documento",
    url: "/generate",
    icon: FileText,
  }
];

const systemItems = [
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Ajuda",
    url: "#", // Keep # for non-navigational links or implement help page later
    icon: HelpCircle,
  }
];

export function AppSidebar() {
  const pathname = usePathname(); // Changed from useLocation
  const { selectedWorkspace, getAgentsForWorkspace, officialAgents, getAgentsByLegalSubject, getAvailableLegalSubjects } = useWorkspace();
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedOfficial, setExpandedOfficial] = useState(false);

  const workspaceAgents = selectedWorkspace ? getAgentsForWorkspace(selectedWorkspace.id) : [];
  const availableSubjects = selectedWorkspace ? getAvailableLegalSubjects(selectedWorkspace.id) : [];

  const toggleSubject = (subject: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedSubjects(newExpanded);
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800"> {/* Added dark mode classes */}
      <SidebarHeader className="border-b border-gray-100 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">LexAI</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Assistente jurídica</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {/* Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 dark:text-gray-400">Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trabalho */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 dark:text-gray-400">Trabalho</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Meu Escritório */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/workspace"}>
                  <Link href="/workspace" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Meu Escritório</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Meus Agentes */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/agents"}>
                  <Link href="/agents" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Meus Agentes</span>
                    {workspaceAgents.length > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {workspaceAgents.length}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {availableSubjects.length > 0 && selectedWorkspace && ( // Added selectedWorkspace check
              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 px-3 mb-2">Por Matéria</p>
                {availableSubjects.map((subject) => {
                  const subjectAgents = getAgentsByLegalSubject(selectedWorkspace.id, subject); // No need for ternary if selectedWorkspace is checked
                  const isExpanded = expandedSubjects.has(subject);

                  return (
                    <Collapsible key={subject} open={isExpanded} onOpenChange={() => toggleSubject(subject)}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between text-xs h-8 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <span className="truncate">{subject}</span>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs h-4 px-1">
                              {subjectAgents.length}
                            </Badge>
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 space-y-1">
                        {subjectAgents.map((agent) => (
                          <Button
                            key={agent.id}
                            asChild
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs h-7 px-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <Link href={`/generate?agent=${agent.id}`} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                              <span className="truncate">{agent.name}</span>
                            </Link>
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            )}

            {officialAgents.length > 0 && (
              <div className="mt-4 space-y-1">
                <Collapsible open={expandedOfficial} onOpenChange={setExpandedOfficial}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs h-8 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="flex items-center gap-2">
                        <Crown className="h-3 w-3 text-amber-500" />
                        Agentes Oficiais
                      </span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs h-4 px-1 bg-amber-50 dark:bg-amber-900 dark:text-amber-300">
                          {officialAgents.length}
                        </Badge>
                        {expandedOfficial ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 space-y-1">
                    {officialAgents.map((agent) => (
                      <Button
                        key={agent.id}
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-7 px-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Link href={`/generate?agent=${agent.id}`} className="flex items-center gap-2">
                          <Crown className="h-3 w-3 text-amber-500" />
                          <span className="truncate">{agent.name}</span>
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            <div className="mt-4">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full border-dashed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Link href="/agents/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Agente
                </Link>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 dark:text-gray-400">Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url && item.url !== "#"}>
                    {item.url === "#" ? (
                      <button className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full text-left">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </button>
                    ) : (
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
