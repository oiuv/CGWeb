// 中文通用工具函数
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 格式化时间戳
export function formatTimestamp(timestamp: number): string {
  if (!timestamp || timestamp === 0) return '-';

  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes === 0 ? '刚刚' : `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
}

// 格式化金币
export function formatGold(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return amount.toLocaleString();
}

// 格式化经验值
export function formatExp(exp: number): string {
  if (exp >= 1000000) {
    return `${(exp / 1000000).toFixed(1)}M`;
  } else if (exp >= 1000) {
    return `${(exp / 1000).toFixed(1)}K`;
  }
  return exp.toString();
}
