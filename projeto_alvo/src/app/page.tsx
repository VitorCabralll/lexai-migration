"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed from react-router-dom
import { useAuth } from "@/hooks/useAuth"; // Assuming path is correct

const IndexPage = () => { // Renamed component
  const router = useRouter(); // Changed from useNavigate
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard"); // Changed to router.push
      } else {
        router.push("/login"); // Changed to router.push
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">LexAI</h1>
          <p className="text-xl text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return null; // Or a more suitable loading/empty state for Next.js page
};

export default IndexPage;
