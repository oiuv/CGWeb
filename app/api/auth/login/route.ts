import { NextRequest, NextResponse } from 'next/server';
import { query, utf8ToGbk } from '@/lib/db';
import { setSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, password } = body;

    // 验证输入
    if (!account || !password) {
      return NextResponse.json(
        { success: false, message: '请输入账号和密码' },
        { status: 400 }
      );
    }

    // 账号验证规则（与游戏一致：5-15位字母数字下划线）
    if (!/^\w{5,15}$/.test(account)) {
      return NextResponse.json(
        { success: false, message: '账号格式不正确' },
        { status: 400 }
      );
    }

    // 密码验证规则（与游戏一致：6-15位字母数字）
    if (!/^[a-zA-Z0-9]{6,15}$/.test(password)) {
      return NextResponse.json(
        { success: false, message: '密码格式不正确' },
        { status: 400 }
      );
    }

    // 查询用户 - 使用GBK编码
    const accountGbk = utf8ToGbk(account);
    const passwordGbk = utf8ToGbk(password);

    const users = await query<any>(
      'SELECT CdKey, AccountID, AccountPassword FROM tbl_user WHERE AccountID = ? AND AccountPassword = ? LIMIT 1',
      [accountGbk, passwordGbk]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: '账号或密码错误' },
        { status: 401 }
      );
    }

    const user = users[0];

    // 创建会话（网页登录不检查EnableFlg，该字段仅用于游戏登录控制）
    await setSession({
      account: user.AccountID,
      cdKey: user.CdKey,
      loginTime: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        account: user.AccountID,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
