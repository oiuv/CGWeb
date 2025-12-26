import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        account: session.account,
        loginTime: session.loginTime,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { success: false, message: '获取会话失败' },
      { status: 500 }
    );
  }
}
