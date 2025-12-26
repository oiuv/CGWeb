import { NextResponse } from 'next/server';
import { query, utf8ToGbk } from '@/lib/db';
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
  // 显示用的属性
  Str: number;
  Vital: number;
  Quick: number;
  Magic: number;
  Power: number;
  Dex: number;
  Intelligence: number;
  Charm: number;
}

export async function GET() {
  try {
    const session = await requireAuth();
    const accountGbk = utf8ToGbk(session.account);

    // 查询角色信息
    const characters = await query<any>(
      `SELECT
        c.Name,
        c.Lv,
        c.MainJob,
        c.Hp,
        c.ForcePoint AS MaxHp,
        c.Vital,
        c.Exp,
        c.Gold,
        c.Fame,
        c.MapId,
        c.Floor,
        c.X,
        c.Y,
        c.Str,
        c.Quick,
        c.Magic,
        c.Power,
        c.Dex,
        c.Intelligence,
        c.Charm,
        g.guildName,
        c.titleID
       FROM tbl_character c
       LEFT JOIN tbl_guild g ON c.guildID = g.guildID
       WHERE c.CdKey = ?
       ORDER BY c.RegistNumber
       LIMIT 2`,
      [accountGbk]
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

    const formattedCharacters: Character[] = characters.map((char: any) => ({
      Name: char.Name,
      Lv: char.Lv,
      Job: jobNames[char.MainJob] || '未知',
      Hp: char.Hp,
      MaxHp: char.MaxHp,
      Mp: char.Vital, // 游戏中Vital作为魔法值
      MaxMp: char.Vital,
      Exp: char.Exp,
      Gold: char.Gold,
      Fame: char.Fame,
      MapId: char.MapId,
      Floor: char.Floor,
      X: char.X,
      Y: char.Y,
      MainJob: char.MainJob,
      GuildName: char.guildName || null,
      Str: char.Str,
      Vital: char.Vital,
      Quick: char.Quick,
      Magic: char.Magic,
      Power: char.Power,
      Dex: char.Dex,
      Intelligence: char.Intelligence,
      Charm: char.Charm,
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
