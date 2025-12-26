import { NextRequest, NextResponse } from 'next/server';
import { query, execute, utf8ToGbk } from '@/lib/db';
import { requireAuth } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // 验证登录状态
    const session = await requireAuth();

    const body = await request.json();
    const { oldPassword, newPassword } = body;

    // 验证输入
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: '请输入原密码和新密码' },
        { status: 400 }
      );
    }

    // 密码验证规则
    if (!/^[a-zA-Z0-9]{6,15}$/.test(newPassword)) {
      return NextResponse.json(
        { success: false, message: '新密码格式不正确（6-15位字母或数字）' },
        { status: 400 }
      );
    }

    // 验证原密码
    const accountGbk = utf8ToGbk(session.account);
    const oldPasswordGbk = utf8ToGbk(oldPassword);

    const users = await query<any>(
      'SELECT CdKey, AccountPassword FROM tbl_user WHERE AccountID = ? AND AccountPassword = ? LIMIT 1',
      [accountGbk, oldPasswordGbk]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: '原密码错误' },
        { status: 400 }
      );
    }

    // 更新密码
    const newPasswordGbk = utf8ToGbk(newPassword);
    await execute(
      'UPDATE tbl_user SET AccountPassword = ? WHERE AccountID = ?',
      [newPasswordGbk, accountGbk]
    );

    return NextResponse.json({
      success: true,
      message: '密码修改成功',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: '修改密码失败，请稍后重试' },
      { status: 500 }
    );
  }
}
