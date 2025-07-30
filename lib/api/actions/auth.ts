'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { apiClient } from '../client';

interface AuthResponse {
  success: boolean;
  message?: string;
}

export async function authenticateWithApiKey(formData: FormData): Promise<AuthResponse> {
  const apiKey = formData.get('apiKey') as string;

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      message: 'Chave API é obrigatória'
    };
  }

  try {
    await apiClient.post<void>(`/auth/${apiKey}`)

    const cookieStore = await cookies();
    cookieStore.set('api-key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: 'Erro interno do servidor. Tente novamente.'
    };
  }

  redirect('/');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('api-key');
  cookieStore.delete('user-info');
  redirect('/auth');
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('api-key')?.value;
    return !!apiKey;
  } catch {
    return false;
  }
}