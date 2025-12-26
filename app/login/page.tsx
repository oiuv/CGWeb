'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/profile');
        router.refresh();
      } else {
        setError(data.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">魔力宝贝</h1>
              <p className="text-xs text-gray-500">CrossGate User Center</p>
            </div>
          </Link>
          <Link href="/" className="text-primary hover:underline">
            返回首页
          </Link>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card animate-fadeIn">
            {/* 标题 */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-pink rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-glow">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">用户登录</h2>
              <p className="text-gray-500 mt-2">使用游戏账号登录网站</p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* 登录表单 */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-2">
                  账号
                </label>
                <input
                  id="account"
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="input"
                  placeholder="请输入游戏账号（5-15位）"
                  pattern="^\w{5,15}$"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1.5">支持字母、数字或下划线</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="请输入密码（6-15位）"
                  pattern="^[a-zA-Z0-9]{6,15}$"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1.5">支持字母或数字</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    登录中...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    登录
                  </>
                )}
              </button>
            </form>

            {/* 底部说明 */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                首次在游戏中登录会自动创建账号
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
