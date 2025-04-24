"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthService } from "../application/authService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPasswordStrength } from "@/utils/validatePassword";
import { PasswordInput } from "@/components/ui/PasswordInput";


const authService = new AuthService();

const getStrengthColor = (strength: number) => {
  switch (strength){
    case 0: 
    case 1: 
      return "bg-red-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-green-400";
    case 4:
      return "bg-green-600";
    default:
      return "bg-red-300";
  }
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({score: 0, feedback: ""});

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strength = getPasswordStrength(newPassword);
    setPasswordStrength({
      score: strength.score,
      feedback: strength.feedback.suggestions.join(' ')
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await authService.register({ name, email, password });
      toast.success(`Hola ${user.name} :D`);
      setTimeout(() => 
        {
          router.push("/login");
        }, 
        1000
      );

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error en el registro");
      } else {
        toast.error("Error en el registro");
      }
    }
    
  };

  return (
    <div className="mx-auto w-80 max-w-md">
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-2xl rounded-2xl p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Registro</h2>
      
      <div className="flex flex-col">
        <Label htmlFor="name" className="mb-1">
          Nombre de usuario:
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
          required
        />
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor="email" className="mb-1">
          Email:
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor="password" className="mb-1">
          Contraseña:
        </Label>
        <PasswordInput
					id="password"
          value={password}
          onChange={handlePasswordChange}
          required
				/>
        {password && (
          <div className="w-fulll h-2 bg-gray-300 rounded-fulll mt-2"> 
            <div className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`} style={{ width: `${(passwordStrength.score / 4) * 100}%` }}>
            </div>
          </div>
        )}
        {password && (
          <p className="text-sm mt-1">Password strength: {["Too weak", "Weak", "Regular", "Ok", "Strong"][passwordStrength.score]}</p>
        )}
      </div>
      
      <div className="flex justify-center">
      <Button type="submit" className="w-full" variant="studia-primary">Registrarse</Button>
      </div>
    </form>
    </div>
  );
};


export default RegisterForm;
