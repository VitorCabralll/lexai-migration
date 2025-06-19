"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileText, CheckCircle, MessageCircle, Sparkles, Bot } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { FileUpload, UploadedFile } from "@/components/FileUpload";
import { GenerationProgress } from "@/components/GenerationProgress";
import { ExpandableDocument } from "@/components/ExpandableDocument";
import { PREDEFINED_PROMPTS } from "@/types/prompts";
import { Step1CreationMode } from '@/components/generate/Step1CreationMode';
import { Step2Selection } from '@/components/generate/Step2Selection';
import { Step3Instructions } from '@/components/generate/Step3Instructions';
import { Toaster } from "@/components/ui/toaster";

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const { agents, officialAgents, selectedWorkspace } = useWorkspace();

  const [currentStep, setCurrentStep] = useState(1);
  const [creationMode, setCreationMode] = useState<"assistant" | "template" | "">("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedPromptId, setSelectedPromptId] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [supportFiles, setSupportFiles] = useState<UploadedFile[]>([]);
  const [templateFile, setTemplateFile] = useState<UploadedFile | null>(null);
  const [strictMode, setStrictMode] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");

  useEffect(() => {
    const agentParam = searchParams.get('agent');
    const typeParam = searchParams.get('type');

    if (agentParam) {
      setCreationMode("assistant");
      setSelectedAgent(agentParam);
    } else if (typeParam) {
      setCreationMode("template");
      setSelectedPromptId(typeParam);
    }
  }, [searchParams]);

  const workspaceAgents = selectedWorkspace ? agents.filter(a => a.workspaceId === selectedWorkspace.id) : [];
  const allAgents = [...officialAgents, ...workspaceAgents];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent("");

    if (creationMode === 'template' && selectedPromptId) {
      const prompt = PREDEFINED_PROMPTS.find(p => p.id === selectedPromptId);
      setDocumentTitle(prompt?.name || 'Documento Jurídico');
    } else if (creationMode === 'assistant' && selectedAgent) {
      const agent = allAgents.find(a => a.id === selectedAgent);
      setDocumentTitle(`Documento - ${agent?.name || 'Assistente'}`);
    }
    // Simulate generation for now, actual generation logic will be complex
    // For the purpose of this step, we call handleGenerationComplete almost immediately
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
    let content = '';
    if (creationMode === 'assistant') {
      const agent = allAgents.find(a => a.id === selectedAgent);
      content = `DOCUMENTO JURÍDICO GERADO (SIMULADO)

Criado com o modelo: ${agent?.name || 'Modelo selecionado'}
Especialidade: ${agent?.theme || 'Não especificado'}
Instruções: ${instructions}
Arquivos: ${supportFiles.map(f => f.name).join(', ')}
Template: ${templateFile?.name || 'Nenhum'}
Modo Estrito: ${strictMode}`;
    } else {
      const prompt = PREDEFINED_PROMPTS.find(p => p.id === selectedPromptId);
      content = `DOCUMENTO JURÍDICO GERADO (SIMULADO)

Tipo: ${prompt?.name || 'Documento personalizado'}
Instruções Adicionais: ${additionalInstructions}
Arquivos: ${supportFiles.map(f => f.name).join(', ')}
Template: ${templateFile?.name || 'Nenhum'}
Modo Estrito: ${strictMode}`;
    }
    setGeneratedContent(content);
  };

  const handlePromptSelect = (promptId: string) => {
    setSelectedPromptId(promptId);
  };

  const canProceedStep1 = creationMode !== "";
  const canProceedStep2 = creationMode === 'assistant' ? selectedAgent !== "" : selectedPromptId !== "";
  const canProceedStep3 = creationMode === 'assistant' ? instructions.trim() !== "" : true;
  const canGenerate = currentStep === 4;

  const steps = [
    { number: 1, title: "Como vamos fazer?", description: "Escolha o método", icon: MessageCircle },
    { number: 2, title: creationMode === 'assistant' ? "Qual modelo usar?" : "Que tipo de documento?", description: "Selecione a opção", icon: creationMode === 'assistant' ? Bot : FileText },
    { number: 3, title: "Me conte os detalhes", description: "Explique o que precisa", icon: MessageCircle },
    { number: 4, title: "Documentos extras", description: "Anexos opcionais", icon: FileText }
  ];

  return (
    <div>
      <div className="space-y-8 p-4 md:p-8"> {/* Added padding for better layout */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vamos criar seu documento</h1>
            <p className="text-gray-600">
              Te guio passo a passo para fazer exatamente o que você precisa
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="flex items-center w-full"> {/* Ensure full width for connector */}
                  <div className="flex flex-col items-center">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                      {currentStep === step.number && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Sparkles className="h-2 w-2 text-yellow-800" />
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <p className={`text-xs md:text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 hidden md:block">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 md:mx-6 rounded-full ${
                      currentStep > step.number ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-fit">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                {React.createElement(steps[currentStep - 1].icon, { className: "h-8 w-8 text-blue-600" })}
              </div>
              <CardTitle className="text-2xl text-gray-900">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {currentStep === 1 && (
                <Step1CreationMode
                  creationMode={creationMode}
                  onSetCreationMode={setCreationMode}
                />
              )}

              {currentStep === 2 && creationMode && (
                <Step2Selection
                  creationMode={creationMode}
                  selectedAgent={selectedAgent}
                  onSetSelectedAgent={setSelectedAgent}
                  officialAgents={officialAgents}
                  workspaceAgents={workspaceAgents}
                  selectedPromptId={selectedPromptId}
                  onPromptSelect={handlePromptSelect}
                />
              )}

              {currentStep === 3 && creationMode && (
                <Step3Instructions
                  creationMode={creationMode}
                  instructions={instructions}
                  onSetInstructions={setInstructions}
                  additionalInstructions={additionalInstructions}
                  onSetAdditionalInstructions={setAdditionalInstructions}
                />
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Quer anexar algum documento?
                    </h3>
                    <p className="text-gray-600">
                      Isso é opcional, mas pode ajudar a criar um documento ainda melhor
                    </p>
                  </div>
                  <FileUpload
                    onSupportFilesChange={setSupportFiles}
                    onTemplateFileChange={setTemplateFile}
                    onStrictModeChange={setStrictMode}
                    strictMode={strictMode}
                  />
                </div>
              )}

              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                )}

                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !canProceedStep1) ||
                      (currentStep === 2 && !canProceedStep2) ||
                      (currentStep === 3 && !canProceedStep3)
                    }
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Criando seu documento...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Criar Meu Documento
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {isGenerating && (
              <GenerationProgress
                isGenerating={isGenerating}
                onComplete={handleGenerationComplete} // This will now use the mocked content
              />
            )}

            <ExpandableDocument
              content={generatedContent}
              onContentChange={setGeneratedContent}
              title={documentTitle || "Seu Documento"}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
