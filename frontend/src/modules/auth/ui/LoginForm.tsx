"use client";

import React, { useEffect, useState } from "react";
import { AuthService } from "../application/authService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { PasswordInput } from "@/components/ui/PasswordInput";
import toast from "react-hot-toast";
import { verifySession } from "../infrastructure/authApi";


const authService = new AuthService();

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInLogin, setErrorInLogin] = useState(false);


  /*useEffect(() => {
    (async () => {
      console.log("I am verifying the session");
      const sessionValid = await verifySession();
      console.log("is this session valid?", sessionValid);
      if (sessionValid) {
        console.log("PUSHING TO HOME");
        //router.push("/home");
        console.log("I PUSHED YOU TO HOME");
      } else{
        toast.error("You should login to access this page");
      }
    })();
  }, [router]);*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await authService.login({ email, password });
      console.log(user);
      setErrorInLogin(false);
      setLoginState(true);
      toast.success(`Bienvenido ${user.name}`);
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error en el registro");
        setErrorInLogin(true);
      } else {
        toast.error("Error en el registro");
        setErrorInLogin(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-80 max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-2xl rounded-2xl p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center">Login</h2>
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
            className="border border-gray-300 rounded-b-md p-2"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="password" className="mb-1">
            Contraseña:
          </Label>
        <PasswordInput
					id="current_password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-b-md p-2"
				/>
        </div>
        <Button
          type="submit"
          variant="studia-primary"
          className="w-full"
          disabled={loading || loginState} 
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"
                viewBox="0 0 24 24"
              ></svg>
              Calling server...
            </span>
          ) : errorInLogin ? (
            "Try again"   
          ) 
          : loginState ? (
            "All ok!"
          ) : (
            "Submit"
          )}
        </Button>

        <div className="text-center mt-4">
          <Link href="/" className="text-blue-500 hover:underline">
            I lost my password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
