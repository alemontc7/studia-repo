
import React, { useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { forgotPassword} from '../application/forgotPasswordService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await forgotPassword(email);
      toast.success(response.message || 'Check your email for the recovery link!');
    } catch(error: any) {
      toast.error(error.message || 'Error sending recovery email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto w-80 max-w-md'>
      <form onSubmit={handleSubmit} className='space-y-4 bg-white shadow-2xl rounded-2xl p-8 max-w-xl mx-auto'>
        <h2 className="text-2xl font-bold text-center">Olvidé mi contraseña</h2>
        <div className="flex flex-col">
          <Label htmlFor="email" className="mb-1">Ingresa tu correo:</Label>
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
        <Button type="submit" disabled={loading} className="w-full" variant="studia-primary">
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </Button>
      </form>
    </div>
  );
  
};

export default ForgotPasswordPage;