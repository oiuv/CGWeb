// Session管理 - 简单的JWT-less会话系统
import { cookies } from 'next/headers';

export interface UserInfo {
  account: string;
  cdKey: string;
  loginTime: number;
}

const SESSION_COOKIE_NAME = 'cg_session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7天

// 简单的base64编码会话数据（仅用于演示，生产环境应使用JWT）
function encodeSession(data: UserInfo): string {
  const json = JSON.stringify(data);
  return Buffer.from(json).toString('base64');
}

function decodeSession(token: string): UserInfo | null {
  try {
    const json = Buffer.from(token, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function setSession(userInfo: UserInfo): Promise<void> {
  const cookieStore = await cookies();
  const token = encodeSession(userInfo);

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<UserInfo | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);

  if (!token) return null;

  return decodeSession(token.value);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<UserInfo> {
  const session = await getSession();

  if (!session) {
    throw new Error('UNAUTHORIZED');
  }

  return session;
}
