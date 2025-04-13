import { LoginCredentials, RegisterData, User } from "../domain/user";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:7000/api';

export async function loginApi(credentials: LoginCredentials): Promise<User>{
  const response = await fetch(`${API_BASE}/users/login`,{
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(credentials),
    credentials: "include"
  });

  if(!response.ok){
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en el login');
  }
  console.log('Cookies:', document.cookie); 
  return response.json();
}

export async function registerApi(registerData: RegisterData): Promise<User>{
  const response = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(registerData)
  });
  if(!response.ok){
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en el registro');
  }
  return response.json();
}

export async function verifySession(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/users/verify`, {
      method: "GET",
      credentials: "include",
    });
    console.log("THIS IS THE VERTIFICATION RESPONSE status", res.ok);
    if (!res.ok) {
      return false;
    }
    const data = await res.json();
    console.log("This is the data I awaited for", data);
    return data.valid;
  } catch (error) {
    console.error("Error verifying session:", error);
    return false;
  }
}

export async function forgotPasswordApi(email: string): Promise<{message: string}>{ 
  console.log('Sending email for password recovery:', email);
  const response = await fetch(`${API_BASE}/api/users/forgot-password`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  if(!response.ok){
    throw new Error(data.message || 'Error en el envio del correo de recuperacion');
  }
  return data;
}

export async function resetPasswordApi(token: string, email: string, newPassword: string): Promise<{message: string}>{
  if(!token || !email || !newPassword){
    throw new Error('Token, email and new password are required');
  }
  const payload = { token, email, newPassword };
  console.log("Payload for reset password:", payload);
  const response = await fetch(`http://localhost:7000/api/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const data = await response.json();
  console.log("Response from reset password API:", data);
  if (!response.ok) {
    throw new Error(data.message || "Error resetting password");
  }
  return data;  
}