import { NextResponse } from 'next/server';
import { query, utf8ToGbk, gbkToUtf8 } from '@/lib/db';
import { requireAuth } from '@/lib/session';

// 角色资料接口
export interface Character {
  Name: string;
  Lv: number;
  Job: string;
  Hp: number;
  MaxHp: number;
  Mp: number;
  MaxMp: number;
  Exp: number;
  Gold: number;
  Fame: number;
  MapId: number;
  Floor: number;
  X: number;
  Y: number;
  MainJob: number;
  GuildName?: string;
  // 基础属性（金黄色，玩家分配点数）
  Str: number;
  Vital: number;
  Quick: number;
  Magic: number;
  Power: number;
  // 状态属性（青色）
  Atk: number;
  Def: number;
  Agi: number;
  Spirit: number;
  Regenerate: number;
  // 其他属性（绿色）
  Dex: number;
  Intelligence: number;
  Charm: number;
  // 统计字段
  LoginCount: number;
  DieCount: number;
  PKWinCount: number;
  PKLoseCount: number;
  PKCount: number;
}

export async function GET() {
  try {
    const session = await requireAuth();
    const accountGbk = utf8ToGbk(session.account);

    // 查询角色信息 - 先查询原始数据
    const rawCharacters = await query<any>(
      `SELECT
        c.Name,
        c.Lv,
        c.MainJob,
        c.Hp,
        c.MaxHp,
        c.ForcePoint,
        c.Exp,
        c.Gold,
        c.Fame,
        c.MapId,
        c.Floor,
        c.X,
        c.Y,
        c.Str,
        c.Vital,
        c.Quick,
        c.Magic,
        c.Power,
        c.Dex,
        c.Intelligence,
        c.Charm,
        c.Atk,
        c.Def,
        c.Agi,
        c.Spirit,
        c.Regenerate,
        c.LoginCount,
        c.DieCount,
        c.PKWinCount,
        c.PKLoseCount,
        c.PKCount,
        g.guildName
       FROM tbl_character c
       LEFT JOIN tbl_guild g ON c.guildID = g.guildID
       WHERE c.CdKey = ?
       ORDER BY c.RegistNumber
       LIMIT 2`,
      [accountGbk],
      false // 不自动转换编码，手动处理Name
    );

    // 转换职业名称
    const jobNames: Record<number, string> = {
      0: '无职业',
      1: '剑士',
      2: '战斧斗士',
      3: '骑士',
      4: '卫兵',
      5: '游侠',
      6: '魔术师',
      7: '传教士',
      8: '巫师',
      9: '咒术师',
      10: '羊魔女',
      11: '服事',
      12: '弓箭手',
      13: '刺客',
    };

    const formattedCharacters: Character[] = rawCharacters.map((char: any) => ({
      Name: gbkToUtf8(char.Name), // 手动转换名称编码
      Lv: char.Lv,
      Job: jobNames[char.MainJob] || '未知',
      Hp: char.Hp,
      MaxHp: char.MaxHp,
      Mp: char.ForcePoint || 0, // 魔力
      MaxMp: char.ForcePoint || 0,
      Exp: char.Exp,
      Gold: char.Gold,
      Fame: char.Fame,
      MapId: char.MapId,
      Floor: char.Floor,
      X: char.X,
      Y: char.Y,
      MainJob: char.MainJob,
      GuildName: char.guildName ? gbkToUtf8(char.guildName) : null,
      // 基础属性（金黄色）- 需除以100
      Str: Math.floor((char.Str || 0) / 100),
      Vital: Math.floor((char.Vital || 0) / 100),
      Quick: Math.floor((char.Quick || 0) / 100),
      Magic: Math.floor((char.Magic || 0) / 100),
      Power: Math.floor((char.Power || 0) / 100),
      // 状态属性（青色）
      Atk: char.Atk || 0,
      Def: char.Def || 0,
      Agi: char.Agi || 0,
      Spirit: char.Spirit || 0,
      Regenerate: char.Regenerate || 0,
      // 其他属性（绿色）
      Dex: char.Dex || 0,
      Intelligence: char.Intelligence || 0,
      Charm: char.Charm || 0,
      // 统计
      LoginCount: char.LoginCount || 0,
      DieCount: char.DieCount || 0,
      PKWinCount: char.PKWinCount || 0,
      PKLoseCount: char.PKLoseCount || 0,
      PKCount: char.PKCount || 0,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCharacters,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }
    console.error('Get characters error:', error);
    return NextResponse.json(
      { success: false, message: '获取角色信息失败' },
      { status: 500 }
    );
  }
}
