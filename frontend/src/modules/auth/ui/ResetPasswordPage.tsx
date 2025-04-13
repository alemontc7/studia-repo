"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Si los parámetros son inválidos, redirige o muestra un toast
  if (!token || !email) {
    toast.error("Token o email inválido.");
    router.push("/login");
    return <div>Error</div>;
  }

  // Aquí defines el resto de la lógica y el formulario
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const payload = { email, token, newPassword };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al restablecer la contraseña.");
      }
      toast.success(data.message || "Contraseña actualizada con éxito.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Error al restablecer la contraseña.");
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
            placeholder="Nueva contraseña"
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
            placeholder="Repite la nueva contraseña"
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