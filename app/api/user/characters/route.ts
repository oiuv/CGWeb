import { NextResponse } from 'next/server';
import { query, utf8ToGbk } from '@/lib/db';
import { requireAuth } from '@/lib/session';

// 角色资料接口
export interface Character {
  Name: string;
  Lv: number;
  Job: string;
  Hp: number;
  Mp: number;
  Exp: number;
  Gold: number;
  Fame: number;
  MapId: number;
  Floor: number;
  X: number;
  Y: number;
  MainJob: number;
  GuildName?: string | null;
  // 基础属性（金黄色，玩家分配点数）- 需除以100
  Str: number;
  Vital: number;
  Tough: number;
  Quick: number;
  Magic: number;
  // 其他属性（绿色）
  Power: number;
  Dex: number;
  Intelligence: number;
  Charm: number;
  // 元素属性
  Attrib_Earth: number;
  Attrib_Water: number;
  Attrib_Fire: number;
  Attrib_Wind: number;
  // 统计字段
  LoginCount: number;
  DeadCount: number;
  TalkCount: number;
  GetPetCount: number;
  WalkCount: number;
}

export async function GET() {
  try {
    const session = await requireAuth();
    const accountGbk = utf8ToGbk(session.account);

    // 查询角色信息 - 只查询实际存在的字段
    const rawCharacters = await query<any>(
      `SELECT
        c.Name,
        c.Lv,
        c.MainJob,
        c.Hp,
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
        c.Tough,
        c.Quick,
        c.Magic,
        c.Power,
        c.Dex,
        c.Intelligence,
        c.Charm,
        c.Attrib_Earth,
        c.Attrib_Water,
        c.Attrib_Fire,
        c.Attrib_Wind,
        c.LoginCount,
        c.DeadCount,
        c.TalkCount,
        c.GetPetCount,
        c.WalkCount,
        g.guildName
       FROM tbl_character c
       LEFT JOIN tbl_guild g ON c.guildID = g.guildID
       WHERE c.CdKey = ?
       ORDER BY c.RegistNumber
       LIMIT 2`,
      [accountGbk],
      false // mysql2 驱动已自动转换编码
    );

    // 转换职业名称
    const jobNames: Record<number, string> = {
      1: '游民',
      11: '见习剑士', 12: '剑士', 13: '王宫剑士', 14: '剑术师范', 15: '剑术大师', 16: '武士', 17: '剑圣',
      21: '见习战斧斗士', 22: '战斧斗士', 23: '王宫战斧斗士', 24: '战斧师范', 25: '战斧大师', 26: '狂战士', 27: '破坏王',
      31: '见习骑士', 32: '骑士', 33: '王宫骑士', 34: '近卫骑士', 35: '铁血骑士', 36: '黑骑士', 37: '圣骑士',
      41: '见习弓箭手', 42: '弓箭手', 43: '王宫弓箭手', 44: '弓术师范', 46: '神射手', 47: '森林守护者',
      51: '见习士兵', 52: '士兵', 53: '王宫士兵', 54: '士兵长', 55: '重战士', 56: '装甲兵', 57: '蹂躏兵',
      61: '见习传教士', 62: '传教士', 63: '牧师', 64: '主教', 65: '大主教', 66: '李贝留斯的仆人', 67: '阿尔杰斯的使徒',
      71: '见习魔术师', 72: '魔术师', 73: '王宫魔法师', 74: '魔导士', 75: '大魔导师', 76: '狂魔导师', 77: '法王',
      81: '见习咒术师', 82: '咒术师', 83: '王宫咒术师', 84: '降头师', 85: '咒术大师', 86: '右月咒缚者', 87: '左月咒缚者',
      91: '见习封印师', 92: '封印师', 93: '王宫封印师', 94: '封印术师范', 95: '封印大师', 96: '黑暗召唤师', 97: '恶魔召唤师',
      101: '见习饲养师', 102: '饲养师', 103: '王宫饲养师', 104: '高级饲养师', 105: '饲养大师', 106: '顶尖饲养师', 107: '星之饲养师',
      111: '见习驯兽师', 112: '驯兽师', 113: '王宫驯兽师', 114: '驯兽师范', 115: '驯兽大师', 116: '伟大驯兽师', 117: '黑暗驯兽师',
      121: '见习盗贼', 122: '盗贼', 123: '小偷', 124: '诈欺师', 125: '神偷', 126: '怪盗', 127: '盗贼王',
      131: '见习巫师', 132: '巫师', 133: '王宫巫师', 134: '巫术大师', 135: '巫王', 136: '阿斯提亚神官', 137: '哈贝鲁先知',
      141: '见习格斗士', 142: '格斗士', 143: '格斗专家', 144: '格斗家师范', 145: '格斗王', 146: '铁拳王', 147: '拳圣',
      151: '初级忍者', 152: '中级忍者', 153: '上级忍者', 154: '影', 155: '阴', 156: '闇', 157: '隐',
      161: '见习舞者', 162: '串场艺人', 163: '舞者', 164: '超级巨星', 165: '国际巨星', 166: '星之舞者', 167: '月之舞者',
      201: '铸剑学徒', 202: '铸剑工', 203: '资深铸剑师傅', 204: '御用铸剑师', 205: '铸剑名师', 206: '铸剑巨匠', 207: '铸剑神匠',
      211: '造斧学徒', 212: '造斧工', 213: '资深造斧师傅', 214: '御用造斧师', 215: '造斧名师', 216: '造斧巨匠', 217: '造斧神匠',
      221: '造枪学徒', 222: '造枪工', 223: '资深造枪师傅', 224: '御用造枪师', 225: '造枪名师', 226: '造枪巨匠', 227: '造枪神匠',
      231: '造弓学徒', 232: '造弓工', 233: '资深造弓师傅', 234: '御用造弓师', 235: '造弓名师', 236: '造弓巨匠', 237: '造弓神匠',
      241: '造杖学徒', 242: '造杖工', 243: '资深造杖师傅', 244: '御用造杖师', 245: '造杖名师', 246: '造杖巨匠', 247: '造杖神匠',
      251: '投掷武器学徒', 252: '投掷武器工', 253: '资深投掷武器师傅', 254: '御用投掷武器师傅', 255: '投掷武器名师', 256: '投掷武器巨匠', 257: '投掷武器神匠',
      261: '小刀学徒', 262: '小刀工', 263: '资深小刀师傅', 264: '御用小刀师傅', 265: '小刀名师', 266: '小刀巨匠', 267: '小刀神匠',
      271: '头盔学徒', 272: '头盔工', 273: '资深头盔师傅', 274: '御用头盔师傅', 275: '头盔名师', 276: '头盔巨匠', 277: '头盔神匠',
      281: '帽子学徒', 282: '帽子工', 283: '资深帽子师傅', 284: '御用帽子师傅', 285: '帽子名师', 286: '帽子巨匠', 287: '帽子神匠',
      291: '铠甲学徒', 292: '铠甲工', 293: '资深铠甲师傅', 294: '御用铠甲师傅', 295: '铠甲名师', 296: '铠甲巨匠', 297: '铠甲神匠',
      301: '裁缝学徒', 302: '裁缝工', 303: '资深裁缝师傅', 304: '御用裁缝师', 305: '裁缝名师', 306: '裁缝巨匠', 307: '裁缝神匠',
      311: '长袍学徒', 312: '长袍工', 313: '资深长袍师傅', 314: '御用长袍师傅', 315: '长袍名师', 316: '长袍巨匠', 317: '长袍神匠',
      321: '制靴学徒', 322: '制靴工', 323: '资深制靴师傅', 324: '御用制靴师', 325: '制靴名师', 326: '制靴巨匠', 327: '制靴神匠',
      331: '制鞋学徒', 332: '制鞋工', 333: '资深制鞋师傅', 334: '御用制鞋师', 335: '制鞋名师', 336: '制鞋巨匠', 337: '制鞋神匠',
      341: '造盾学徒', 342: '造盾工', 343: '资深造盾师傅', 344: '御用造盾师', 345: '造盾名师', 346: '造盾巨匠', 347: '造盾神匠',
      351: '料理学徒', 352: '厨师', 353: '资深大厨师', 354: '御用厨师', 355: '料理铁人', 356: '料理王', 357: '食神',
      361: '实习药剂师', 362: '药剂师', 363: '资深药剂大师', 364: '御用药剂师', 365: '炼金术士', 366: '药圣', 367: '药仙',
      371: '武器修理学徒', 372: '武器修理工', 373: '资深武器修理师傅', 374: '御用武器修理师', 375: '武器修理专家', 376: '武器修理达人', 377: '武器修理王',
      381: '防具修理学徒', 382: '防具修理工', 383: '资深防具修理师傅', 384: '御用防具修理师', 385: '防具修理专家', 386: '防具修理达人', 387: '防具修理王',
      391: '鉴定学徒', 392: '鉴定士', 393: '资深鉴定师傅', 394: '御用鉴定师', 395: '鉴定专家', 396: '鉴定达人', 397: '鉴定王',
      401: '刻印学徒', 402: '刻印工', 403: '刻印师', 404: '御用刻印师', 405: '铜之刻印师', 406: '银之刻印师', 407: '金之刻印王',
      411: '实习侦探', 412: '侦探', 413: '名侦探', 414: '大侦探', 415: '超级侦探', 416: '推理专家', 417: '神探',
      421: '道童', 422: '道士', 423: '半仙', 424: '仙人', 425: '歌仙', 426: '华仙', 427: '神仙',
      431: '实习护士', 432: '护士', 433: '资深护士', 434: '护士长', 435: '护理专家', 436: '超级护理师', 437: '白衣天使',
      441: '实习医师', 442: '医师', 443: '资深医师', 444: '御医', 445: '神医', 446: '医圣', 447: '医仙',
      451: '见习樵夫', 452: '樵夫', 453: '资深樵夫', 454: '御用樵夫', 455: '超级樵夫', 456: '伐木专家', 457: '伐木王',
      461: '见习猎人', 462: '猎人', 463: '资深猎人', 464: '御用猎人', 465: '超级猎人', 466: '狩猎专家', 467: '神猎者',
      471: '见习矿工', 472: '矿工', 473: '资深矿工', 474: '御用矿工', 475: '超级矿工', 476: '挖掘专家', 477: '挖掘之神',
      481: '超级职',
      1001: '爆弹术学徒', 1002: '爆弹师', 1003: '资深爆弹师', 1004: '皇家爆弹师', 1005: '赫密斯传承者', 1006: '赫密斯神再世', 1007: '水星守护神',
      1011: '见习纺织工', 1012: '纺织工', 1013: '资深纺织工', 1014: '御用纺织工', 1015: '织布专家', 1016: '织布巧手', 1017: '天星织者',
    };

    const formattedCharacters: Character[] = rawCharacters.map((char: any) => ({
      Name: char.Name, // mysql2 驱动已自动转换 GBK->UTF-8
      Lv: char.Lv,
      Job: jobNames[char.MainJob] || '未知',
      Hp: char.Hp,
      Mp: char.ForcePoint,
      Exp: char.Exp,
      Gold: char.Gold,
      Fame: char.Fame,
      MapId: char.MapId,
      Floor: char.Floor,
      X: char.X,
      Y: char.Y,
      MainJob: char.MainJob,
      GuildName: char.guildName || null,
      // 基础属性（金黄色）- 需除以100
      Str: Math.floor((char.Str || 0) / 100),
      Vital: Math.floor((char.Vital || 0) / 100),
      Tough: Math.floor((char.Tough || 0) / 100),
      Quick: Math.floor((char.Quick || 0) / 100),
      Magic: Math.floor((char.Magic || 0) / 100),
      // 其他属性（绿色）
      Power: char.Power || 0,
      Dex: char.Dex || 0,
      Intelligence: char.Intelligence || 0,
      Charm: char.Charm || 0,
      // 元素属性
      Attrib_Earth: char.Attrib_Earth || 0,
      Attrib_Water: char.Attrib_Water || 0,
      Attrib_Fire: char.Attrib_Fire || 0,
      Attrib_Wind: char.Attrib_Wind || 0,
      // 统计
      LoginCount: char.LoginCount || 0,
      DeadCount: char.DeadCount || 0,
      TalkCount: char.TalkCount || 0,
      GetPetCount: char.GetPetCount || 0,
      WalkCount: char.WalkCount || 0,
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
