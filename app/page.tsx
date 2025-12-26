'use client';

import Link from 'next/link';
import { Shield, User, LogIn, Gamepad2, Download, Star, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">魔力宝贝</h1>
              <p className="text-xs text-gray-500">CrossGate User Center</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="btn btn-outline flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              登录
            </Link>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* 欢迎卡片 */}
          <div className="card mb-8 animate-fadeIn">
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent-pink rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-glow animate-float">
                <Shield className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">欢迎来到魔力宝贝</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                温馨怀旧，Q版可爱。体验经典回合制网游的魅力。
              </p>
            </div>
          </div>

          {/* 功能卡片 */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/login"
              className="card group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <LogIn className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">用户登录</h3>
                  <p className="text-gray-600 text-sm">
                    使用游戏账号登录网站，查看角色资料和修改密码
                  </p>
                </div>
              </div>
            </Link>

            <div className="card border-2 border-dashed border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <User className="w-7 h-7 text-secondary-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">账号说明</h3>
                  <p className="text-gray-600 text-sm">
                    游戏内首次登录会自动创建账号
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 游戏信息和资料站点 */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* 游戏信息 */}
            <div className="card bg-gradient-to-r from-primary/5 to-accent-blue/10">
              <h3 className="text-lg font-bold text-gray-800 mb-4">游戏信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary">服务器</span>
                  <span className="text-gray-700">IP:301:cg.gameivy.com:9030</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-secondary">QQ群</span>
                  <span className="text-gray-700">6446640</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary">客户端</span>
                  <a href="https://down.cgmsv.com/cgtw_7.1_20220101.7z" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    cgtw_7.1_20220101.7z
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-secondary">登录器</span>
                  <a href="/downloads/cgmsv.zip" className="text-primary hover:underline flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    cgmsv.zip
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary">服务端</span>
                  <a href="https://www.cgmsv.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" />
                    cgmsv开源引擎
                  </a>
                </div>
              </div>
            </div>

            {/* 资料站点导航 */}
            <div className="card bg-gradient-to-r from-accent-pink/5 to-accent-blue/10">
              <h3 className="text-lg font-bold text-gray-800 mb-4">资料站点</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.crossgate.com.cn/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors group">
                  <div className="w-8 h-8 bg-accent-pink/10 rounded-lg flex items-center justify-center group-hover:bg-accent-pink/20">
                    <Shield className="w-4 h-4 text-accent-pink" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">魔力宝贝国服官网</div>
                    <div className="text-xs text-gray-500">官方网站</div>
                  </div>
                </a>
                <a href="https://cg.17173.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors group">
                  <div className="w-8 h-8 bg-accent-blue/10 rounded-lg flex items-center justify-center group-hover:bg-accent-blue/20">
                    <User className="w-4 h-4 text-accent-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">魔力宝贝17173专区</div>
                    <div className="text-xs text-gray-500">游戏资讯资料库</div>
                  </div>
                </a>
                <a href="https://games.sina.com.cn/zhuanqu/cross/indexpage.shtml" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors group">
                  <div className="w-8 h-8 bg-yellow/10 rounded-lg flex items-center justify-center group-hover:bg-yellow/20">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">魔力宝贝新浪专区</div>
                    <div className="text-xs text-gray-500">历史资料站</div>
                  </div>
                </a>
                <a href="https://cg.skyey.tw/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors group">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                    <Download className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">魔力宝贝蔚蓝幻境</div>
                    <div className="text-xs text-gray-500">台服资料站</div>
                  </div>
                </a>
                <a href="https://cgsword.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors group">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">魔力宝贝御剑轩</div>
                    <div className="text-xs text-gray-500">游戏资料库</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white/50 border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 魔力宝贝开源服 - 基于爱心运营，不做商业化</p>
        </div>
      </footer>
    </div>
  );
}
