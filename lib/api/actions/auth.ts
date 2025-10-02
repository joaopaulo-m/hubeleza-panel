'use server'

import { cookies } from 'next/headers';

import { apiClient } from '../client';
import { jwtVerify, type JWTPayload } from 'jose';
import { AccountType } from '@/types/enums/account-type';
import type { Account } from '@/types/entities/account';
import { getAdmin } from './admin';
import { getPartner } from './partner';
import { revalidateTag } from 'next/cache';
import { getOperator, getOperatorById } from './operator';
import { redirect } from 'next/navigation';
import { getAffiliate, getAffiliateById } from './affiliate';

interface AuthResponse {
  success: boolean;
  account_type?: AccountType
  message?: string;
}

interface JwtPayload {
  account_id: string;
  account_type: AccountType;
}

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET não definida no ambiente");
  return new TextEncoder().encode(secret);
}

export async function getAccountType(): Promise<AccountType | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access-token')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const { account_type } = payload as unknown as JwtPayload;
    return account_type;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

export async function authenticateWithEmailAndPassword({ email, password }: { email: string, password: string }): Promise<AuthResponse> {
  if (!email || !password) {
    return {
      success: false,
      message: 'E-mail e senha são obrigatórios.'
    };
  }

  try {
    const { access_token } = await apiClient.post<{ access_token: string }>('/auth', {
      email,
      password
    });

    if (!access_token) {
      return {
        success: false,
        message: 'Falha na autenticação. Verifique suas credenciais.'
      };
    }

    let payload: JwtPayload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(access_token, getSecretKey());
      payload = verifiedPayload as unknown as JwtPayload;
    } catch {
      return {
        success: false,
        message: 'Token inválido retornado pelo servidor.'
      };
    }

    const cookieStore = await cookies();

    cookieStore.set('access-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 19, // 19 days
      path: '/',
    });

    cookieStore.set('account-type', payload.account_type, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 19,
      path: '/',
    });

    return {
      success: true,
      account_type: payload.account_type
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: 'Erro interno do servidor. Tente novamente.'
    };
  }
}

export async function definePasswordAction(password: string) {
  try {
    await apiClient.post("/auth/define-password", {
      password
    })
    revalidateTag("admin")
    revalidateTag("partner")

    return {
      success: true
    }
  } catch(error) {
    console.error("Error defining password: ", error)
    return {
      success: false,
    }
  }
}

export async function sendToDefinePasswordAction(account_id: string) {
  try {
    let accountEmail = ""
    let accountType = AccountType.OPERATOR

    try {
      const operator = await getOperatorById(account_id)

      accountEmail = operator.email
    } catch {}

    try {
      const affiliate = await getAffiliateById(account_id)

      accountEmail = affiliate.email
      accountType = AccountType.AFFILIATE
    } catch {}

    await authenticateWithEmailAndPassword({
      email: accountEmail,
      password: "00000000"
    })

    return {
      success: true,
      accountType
    }
  } catch(error) {
    console.error("Error sending to define password page: ", error)
    return {
      success: false,
    }
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('access-token');
  cookieStore.delete('user-info');
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access-token')?.value;
    return !!token;
  } catch {
    return false;
  }
}

export async function getMe(): Promise<Account> {
  const cookieStore = await cookies();
  const accountType = cookieStore.get('account-type')?.value as AccountType | undefined;

  if (accountType === AccountType.ADMIN) {
    return await getAdmin();
  }

  if (accountType === AccountType.OPERATOR) {
    return await getOperator();
  }

  if (accountType === AccountType.AFFILIATE) {
    return await getAffiliate()
  }

  return await getPartner();
}

