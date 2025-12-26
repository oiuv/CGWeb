'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Shield,
  Sword,
  Heart,
  Zap,
  Coins,
  Star,
  MapPin,
  LogOut,
  Key,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';

interface Character {
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
  GuildName?: string | null;
  // 基础属性（金黄色）
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
  // 统计
  LoginCount: number;
  DeadCount: number;
  TalkCount: number;
  GetPetCount: number;
  WalkCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [account, setAccount] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchUserData();
    fetchCharacters();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.success) {
        setAccount(data.data.account);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/user/characters');
      const data = await response.json();
      if (data.success) {
        setCharacters(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }

    if (!/^[a-zA-Z0-9]{6,15}$/.test(passwordForm.newPassword)) {
      setPasswordMessage({ type: 'error', text: '密码格式不正确（6-15位字母或数字）' });
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordMessage({ type: 'success', text: '密码修改成功！' });
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordMessage(null);
        }, 2000);
      } else {
        setPasswordMessage({ type: 'error', text: data.message || '修改失败' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: '网络错误，请稍后重试' });
    }
  };

  const formatNumber = (num: number, useAbbreviation = true) => {
    if (useAbbreviation && num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    if (useAbbreviation && num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString('zh-CN');
  };

  const jobColors: Record<string, string> = {
    '剑士': 'bg-red-100 text-red-700',
    '战斧斗士': 'bg-orange-100 text-orange-700',
    '骑士': 'bg-yellow-100 text-yellow-700',
    '魔术师': 'bg-purple-100 text-purple-700',
    '传教士': 'bg-pink-100 text-pink-700',
    '弓箭手': 'bg-green-100 text-green-700',
    '无职业': 'bg-gray-100 text-gray-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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
              <p className="text-xs text-gray-500">用户中心</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">{account}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              退出
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 操作栏 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">我的角色</h2>
              <p className="text-gray-500 mt-1">查看和管理你的游戏角色</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              修改密码
            </button>
          </div>

          {/* 角色卡片 */}
          {characters.length === 0 ? (
            <div className="card text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">暂无角色</h3>
              <p className="text-gray-500">请先登录游戏创建角色</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {characters.map((char, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  {/* 角色头部 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{char.Name}</h3>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="w-4 h-4" />
                        Lv.{char.Lv}
                      </span>
                      <span className={`badge ${jobColors[char.Job] || 'bg-gray-100 text-gray-700'}`}>
                        {char.Job}
                      </span>
                    </div>
                    {char.GuildName && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Shield className="w-4 h-4" />
                        {char.GuildName}
                      </div>
                    )}
                  </div>

                  {/* 基本属性 */}
                  <div className="space-y-4">
                    {/* HP/MP */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
                          <Heart className="w-4 h-4" />
                          <span>生命值</span>
                        </div>
                        <div className="text-lg font-bold text-red-700">
                          {formatNumber(char.Hp, false)}
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
                          <Zap className="w-4 h-4" />
                          <span>魔法值</span>
                        </div>
                        <div className="text-lg font-bold text-blue-700">
                          {formatNumber(char.Mp, false)}
                        </div>
                      </div>
                    </div>

                    {/* 金币/声望 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-yellow-50 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Coins className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-xs text-yellow-600">金币</div>
                          <div className="text-lg font-bold text-yellow-700">{formatNumber(char.Gold, false)}</div>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-purple-600">声望</div>
                          <div className="text-lg font-bold text-purple-700">{formatNumber(char.Fame)}</div>
                        </div>
                      </div>
                    </div>

                    {/* 战斗属性 */}
                    <div className="space-y-4">
                      {/* 基础属性（金黄色 - 玩家可加点） */}
                      <div>
                        <h4 className="text-sm font-medium text-amber-600 mb-3 flex items-center gap-2">
                          <Sword className="w-4 h-4" />
                          基础属性
                        </h4>
                        <div className="grid grid-cols-5 gap-2">
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-amber-600">体力</div>
                            <div className="text-lg font-bold text-amber-700">{char.Vital}</div>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-amber-600">力量</div>
                            <div className="text-lg font-bold text-amber-700">{char.Str}</div>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-amber-600">强度</div>
                            <div className="text-lg font-bold text-amber-700">{char.Tough}</div>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-amber-600">速度</div>
                            <div className="text-lg font-bold text-amber-700">{char.Quick}</div>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-amber-600">魔法</div>
                            <div className="text-lg font-bold text-amber-700">{char.Magic}</div>
                          </div>
                        </div>
                      </div>

                      {/* 其他属性（绿色） */}
                      <div>
                        <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          其他属性
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-green-700">耐力</div>
                            <div className="text-lg font-bold text-green-800">{char.Power}</div>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-green-700">灵巧</div>
                            <div className="text-lg font-bold text-green-800">{char.Dex}</div>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-green-700">智力</div>
                            <div className="text-lg font-bold text-green-800">{char.Intelligence}</div>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-green-700">魅力</div>
                            <div className="text-lg font-bold text-green-800">{char.Charm}</div>
                          </div>
                        </div>
                      </div>

                      {/* 元素属性 */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          元素属性
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {/* 地 - 绿色 */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-green-700">地</span>
                              <span className="text-green-800 font-medium">{char.Attrib_Earth}</span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(char.Attrib_Earth, 100)}%` }}
                              />
                            </div>
                          </div>
                          {/* 水 - 浅蓝色 */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-sky-600">水</span>
                              <span className="text-sky-700 font-medium">{char.Attrib_Water}</span>
                            </div>
                            <div className="w-full bg-sky-200 rounded-full h-2">
                              <div
                                className="bg-sky-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(char.Attrib_Water, 100)}%` }}
                              />
                            </div>
                          </div>
                          {/* 火 - 橙红色 */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-orange-600">火</span>
                              <span className="text-orange-700 font-medium">{char.Attrib_Fire}</span>
                            </div>
                            <div className="w-full bg-orange-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(char.Attrib_Fire, 100)}%` }}
                              />
                            </div>
                          </div>
                          {/* 風 - 黄色 */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-yellow-600">風</span>
                              <span className="text-yellow-700 font-medium">{char.Attrib_Wind}</span>
                            </div>
                            <div className="w-full bg-yellow-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(char.Attrib_Wind, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 统计信息 */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          统计信息
                        </h4>
                        <div className="grid grid-cols-5 gap-2">
                          <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">登录</div>
                            <div className="text-sm font-bold text-gray-700">{char.LoginCount}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">死亡</div>
                            <div className="text-sm font-bold text-gray-700">{char.DeadCount}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">聊天</div>
                            <div className="text-sm font-bold text-gray-700">{char.TalkCount}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">抓宠</div>
                            <div className="text-sm font-bold text-gray-700">{char.GetPetCount}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">步行</div>
                            <div className="text-sm font-bold text-gray-700">{char.WalkCount}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 当前位置 */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t border-gray-100">
                      <MapPin className="w-4 h-4" />
                      <span>地图 {char.MapId} - {char.Floor}</span>
                      <span className="text-gray-400">({char.X}, {char.Y})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">修改密码</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordMessage(null);
                  setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-5">
              {/* 消息提示 */}
              {passwordMessage && (
                <div className={`flex items-start gap-3 p-4 rounded-xl ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-red-50 border-2 border-red-200'
                }`}>
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm ${
                    passwordMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {passwordMessage.text}
                  </span>
                </div>
              )}

              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  原密码
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="input"
                  placeholder="请输入原密码"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  新密码
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="input"
                  placeholder="6-15位字母或数字"
                  pattern="^[a-zA-Z0-9]{6,15}$"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  确认新密码
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="input"
                  placeholder="再次输入新密码"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordMessage(null);
                  }}
                  className="btn btn-outline flex-1"
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  确认修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
