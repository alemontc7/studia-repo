'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { forgotPassword} from '../application/forgotPasswordService';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300','400'],
  subsets: ['latin'],
  display: 'swap',
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      toast.success(response.message || '¡Revisa tu correo para el enlace!');
      router.push('/login');
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error enviando el enlace de recuperación'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} min-h-screen flex items-center justify-center bg-white p-4`}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 bg-white shadow-2xl rounded-2xl p-8"
      >
        <h2 className="text-[25px] font-bold text-center text-gray-900">
          Olvidé mi contraseña
        </h2>

        <div className="flex flex-col text-[15px]">
          <Label
            htmlFor="email"
            className="mb-2 text-gray-700"
          >
            Ingresa tu correo:
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            className="border border-gray-300 rounded p-2"
          />
        </div>

        <Button
          type="submit"
          variant="studia-primary"
          size="default"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </Button>
      </form>
    </div>
  );
}