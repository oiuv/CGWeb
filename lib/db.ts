// MySQL数据库连接配置 - 处理GBK编码
import mysql from 'mysql2/promise';
import iconv from 'iconv-lite';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'cgmsv',
  charset: 'gbk', // 关键：设置GBK字符集
  timezone: '+00:00',
};

// 创建连接池
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 字符编码转换工具 - 使用iconv-lite
export function gbkToUtf8(str: string): string {
  if (!str) return '';
  try {
    const buffer = Buffer.from(str, 'latin1'); // MySQL返回GBK数据作为binary/latin1
    return iconv.decode(buffer, 'GBK');
  } catch {
    return str;
  }
}

export function utf8ToGbk(str: string): string {
  if (!str) return '';
  try {
    const buffer = iconv.encode(str, 'GBK');
    return buffer.toString('latin1'); // 转换为latin1以便MySQL正确处理
  } catch {
    return str;
  }
}

// 查询辅助函数 - 自动处理编码转换
export async function query<T = any>(
  sql: string,
  params: any[] = [],
  convertEncoding = true
): Promise<T[]> {
  const connection = await pool.getConnection();

  try {
    // 执行查询
    const [rows] = await connection.execute(sql, params);

    // 如果不需要转换编码，直接返回
    if (!convertEncoding) {
      return rows as T[];
    }

    // 处理结果中的GBK编码
    const convertRow = (row: any): any => {
      if (row === null || row === undefined) return row;
      if (typeof row !== 'object') return row;

      const converted: any = {};
      for (const [key, value] of Object.entries(row)) {
        if (typeof value === 'string') {
          converted[key] = gbkToUtf8(value);
        } else if (Array.isArray(value)) {
          converted[key] = value;
        } else if (typeof value === 'object' && value !== null) {
          converted[key] = convertRow(value);
        } else {
          converted[key] = value;
        }
      }
      return converted;
    };

    if (Array.isArray(rows)) {
      return rows.map(convertRow);
    }
    return [convertRow(rows)] as T[];
  } finally {
    connection.release();
  }
}

// 执行SQL语句（INSERT, UPDATE, DELETE）
export async function execute(
  sql: string,
  params: any[] = []
): Promise<{ insertId: number; affectedRows: number }> {
  const connection = await pool.getConnection();

  try {
    // 处理参数中的编码转换（UTF-8 -> GBK）
    const convertedParams = params.map(param => {
      if (typeof param === 'string') {
        return utf8ToGbk(param);
      }
      return param;
    });

    const [result] = await connection.execute(sql, convertedParams);
    const mysqlResult = result as any;

    return {
      insertId: mysqlResult.insertId || 0,
      affectedRows: mysqlResult.affectedRows || 0,
    };
  } finally {
    connection.release();
  }
}

export default pool;
