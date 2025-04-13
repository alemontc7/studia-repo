"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "../application/resetPasswordService";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Siempre declarar los hooks al inicio del componente
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Extraer parámetros (sin condicionar la declaración de hooks)
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // useEffect para validar los parámetros sin condicionar hooks
  useEffect(() => {
    if (!token || !email) {
      toast.error("Token o email inválido.");
      router.push("/login");
    }
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const token = searchParams.get("token") || "";
      const email = searchParams.get("email") || "";
      const response = await resetPassword(token, email, newPassword);
      toast.success(response.message || "Contraseña actualizada con éxito.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-80 max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-2xl rounded-2xl p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center">Restablecer Contraseña</h2>
        
        <div className="flex flex-col">
          <Label htmlFor="newPassword" className="mb-1">Nueva Contraseña:</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ingresa tu nueva contraseña"
            required
            className="border border-gray-300 rounded p-2"
          />
        </div>
        
        <div className="flex flex-col">
          <Label htmlFor="confirmPassword" className="mb-1">Confirmar Contraseña:</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu nueva contraseña"
            required
            className="border border-gray-300 rounded p-2"
          />
        </div>
        
        <Button type="submit" disabled={loading} className="w-full" variant="studia-primary">
          {loading ? "Actualizando..." : "Restablecer Contraseña"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}