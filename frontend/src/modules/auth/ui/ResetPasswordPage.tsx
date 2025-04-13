'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

// Esta página espera recibir los parámetros token y email en la URL, por ejemplo:
// /reset-password?token=ABC123&email=usuario@ejemplo.com

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Estados para la nueva contraseña y confirmación
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Al montar la página, verificamos que exista el token y el email
  useEffect(() => {
    if (!token || !email) {
      toast.error("Token y/o email inválidos.");
      // Redirigir a la página de login si faltan los parámetros
      router.push("/login");
    }
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      // Construir el payload
      const payload = { email, token, newPassword };
      
      const response = await fetch(`${process.env.API}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // para enviar cookies si es necesario
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error al restablecer la contraseña.");
      }
      
      toast.success(data.message || "Contraseña actualizada con éxito.");
      // Opcional: Redirigir al usuario al login tras un breve retraso
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || 'Error sending recovery email');
        } else {
          toast.error('Error sending recovery email');
        }
      } 
    finally {
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
};

export default ResetPasswordPage;
