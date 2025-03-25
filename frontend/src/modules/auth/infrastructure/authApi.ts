import { LoginCredentials, RegisterData, User } from "../domain/user";

const API_BASE = 'http://localhost:7000/api';

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
