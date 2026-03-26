import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send, Mic, Image, Sparkles, Video, Music, Camera, FileText, Loader2, Check, Play, Pause, Download, Share2, MessageSquare, ThumbsUp, ThumbsDown, RefreshCw, Star, Film, Zap, Heart, Crown, X } from 'lucide-react'

interface XiaoyouPageProps {
  onBack: () => void
}

type CreationMode = 'chat' | 'video' | 'music'

// 视频镜头状态
interface StoryboardShot {
  shot: number
  title: string
  description: string
  duration: string
  visualEffect: string
  status: 'pending' | 'generating' | 'done'
  preview?: string
}

// 视频创作状态
interface VideoCreation {
  step: 'input' | 'script' | 'storyboard' | 'generating' | 'preview' | 'final'
  input: string
  theme: string
  script: string
  storyboard: StoryboardShot[]
  progress: number
  videoUrl?: string
  currentShotIndex: number
}

// 音乐创作状态
interface MusicCreation {
  step: 'style' | 'lyrics' | 'generating' | 'preview' | 'final'
  style: string
  styleName: string
  lyrics: string
  progress: number
  audioUrl?: string
  isPlaying: boolean
  currentTime: number
}

// 视频彩铃主题模板
interface VideoTheme {
  id: string
  name: string
  icon: string
  script: string
  storyboard: Omit<StoryboardShot, 'status'>[]
  previewStyle: {
    background: string
    particleType: string
    textAnimation: string
    primaryColor: string
    secondaryColor: string
  }
}

const videoThemes: Record<string, VideoTheme> = {
  '新年祝福': {
    id: 'newyear',
    name: '新年祝福',
    icon: '🎊',
    script: `【新年祝福视频彩铃】

🎬 开场（0-3 秒）
红红火火的渐变背景，金色烟花从底部升起
屏幕中央出现"新春快乐"四个烫金大字

🎬 发展（3-8 秒）
舞狮图案从两侧向中间汇聚
锣鼓元素环绕边框，营造节日氛围
您的 personalized 祝福语缓缓浮现

🎬 高潮（8-12 秒）
烟花在夜空中绽放，形成绚丽图案
"万事如意"等祝福语依次出现
金色粒子效果洒满整个屏幕

🎬 结尾（12-15 秒）
您的名字/企业名称优雅展示
联系方式和 Logo 浮现
"恭喜发财"作为结束画面`,
    storyboard: [
      { shot: 1, title: '开场 - 烟花绽放', description: '红色渐变背景，金色烟花从底部升腾而起，营造热烈喜庆的氛围', duration: '3 秒', visualEffect: '烟花粒子 + 金色光晕' },
      { shot: 2, title: '主题呈现 - 新春快乐', description: '烫金大字"新春快乐"从屏幕中央放大出现，带有闪光特效', duration: '3 秒', visualEffect: '文字缩放 + 闪光' },
      { shot: 3, title: '元素展示 - 舞狮锣鼓', description: '传统舞狮图案从两侧滑入，锣鼓元素环绕装饰', duration: '3 秒', visualEffect: '滑入动画 + 边框装饰' },
      { shot: 4, title: '祝福表达 - 个性化祝福', description: '用户的祝福语逐字浮现，配合花瓣飘落效果', duration: '3 秒', visualEffect: '文字打字机 + 花瓣粒子' },
      { shot: 5, title: '结尾 - 署名展示', description: '用户名字/企业 Logo 优雅呈现，金色粒子环绕', duration: '3 秒', visualEffect: '淡入 + 粒子环绕' }
    ],
    previewStyle: {
      background: 'linear-gradient(135deg, #c41e3a, #8b0000, #ffd700)',
      particleType: 'firework',
      textAnimation: 'gold-shine',
      primaryColor: '#ffd700',
      secondaryColor: '#ff6b6b'
    }
  },
  '商务形象': {
    id: 'business',
    name: '商务形象',
    icon: '💼',
    script: `【商务形象视频彩铃】

🎬 开场（0-3 秒）
深蓝色科技感背景，城市天际线剪影
企业 Logo 从光芒中浮现

🎬 发展（3-8 秒）
科技线条和数据流在背景中流动
展示企业业务领域图标
专业、现代的视觉风格

🎬 高潮（8-12 秒）
企业核心优势文字依次展示
"专业 | 高效 | 信赖"等关键词
立体文字效果配合光效

🎬 结尾（12-15 秒）
企业全称和联系方式
"期待与您合作"作为结束语
二维码或官网地址展示`,
    storyboard: [
      { shot: 1, title: '开场 - 城市天际线', description: '深蓝色渐变背景，城市剪影在天际线处若隐若现', duration: '3 秒', visualEffect: '城市剪影 + 渐变光效' },
      { shot: 2, title: 'Logo 展示 - 光芒浮现', description: '企业 Logo 从中心光芒中缓缓浮现，带有科技感', duration: '3 秒', visualEffect: '光芒放射 + 缓慢缩放' },
      { shot: 3, title: '业务展示 - 图标轮播', description: '业务领域图标依次滑入展示，配合数据流动画', duration: '3 秒', visualEffect: '滑入 + 数据流背景' },
      { shot: 4, title: '核心优势 - 文字动画', description: '"专业 | 高效 | 信赖"等关键词立体呈现', duration: '3 秒', visualEffect: '3D 文字 + 光效扫过' },
      { shot: 5, title: '结尾 - 联系信息', description: '企业联系方式、官网、二维码清晰展示', duration: '3 秒', visualEffect: '淡入 + 边框高亮' }
    ],
    previewStyle: {
      background: 'linear-gradient(135deg, #0a1628, #1a365d, #2c5282)',
      particleType: 'tech',
      textAnimation: 'tech-slide',
      primaryColor: '#4299e1',
      secondaryColor: '#90cdf4'
    }
  },
  '生日快乐': {
    id: 'birthday',
    name: '生日快乐',
    icon: '🎂',
    script: `【生日祝福视频彩铃】

🎬 开场（0-3 秒）
温馨粉色/紫色渐变背景
彩色气球从底部缓缓升起
"Happy Birthday"彩带飘落

🎬 发展（3-8 秒）
生日蛋糕从屏幕下方缓缓升起
蜡烛一根根点燃，烛光摇曳
彩色纸屑和礼花绽放

🎬 高潮（8-12 秒）
"生日快乐"大字出现在蛋糕上方
寿星名字/祝福语个性化展示
爱心和星星粒子环绕

🎬 结尾（12-15 秒）
"愿所有美好都与你相伴"
署名和日期展示
温馨祝福语作为结束`,
    storyboard: [
      { shot: 1, title: '开场 - 气球升起', description: '彩色气球从底部缓缓升起，背景是温馨渐变色彩', duration: '3 秒', visualEffect: '气球浮动 + 彩带飘落' },
      { shot: 2, title: '蛋糕登场 - 烛光点亮', description: '精美生日蛋糕升起，蜡烛依次点燃', duration: '3 秒', visualEffect: '烛光摇曳 + 暖光晕' },
      { shot: 3, title: '祝福呈现 - 生日快乐', description: '"生日快乐"艺术字出现在蛋糕上方', duration: '3 秒', visualEffect: '文字弹跳 + 闪光' },
      { shot: 4, title: '个性化 - 寿星名字', description: '寿星名字和个性化祝福语展示', duration: '3 秒', visualEffect: '手写动画 + 爱心粒子' },
      { shot: 5, title: '结尾 - 美好祝愿', description: '温馨祝福语，署名和日期', duration: '3 秒', visualEffect: '淡入 + 星星闪烁' }
    ],
    previewStyle: {
      background: 'linear-gradient(135deg, #ff69b4, #da70d6, #ffb6c1)',
      particleType: 'heart',
      textAnimation: 'bounce',
      primaryColor: '#ff69b4',
      secondaryColor: '#ffd700'
    }
  },
  '节日问候': {
    id: 'festival',
    name: '节日问候',
    icon: '🎄',
    script: `【节日问候视频彩铃】

🎬 开场（0-3 秒）
根据节日主题的背景色
节日代表性元素开场
（春节 - 红色/中秋 - 蓝色/圣诞 - 绿色）

🎬 发展（3-8 秒）
节日特色元素逐一展示
节日祝福语浮现
传统节日图案装饰

🎬 高潮（8-12 秒）
"节日快乐"主题文字
配合节日特效（雪花/灯笼/彩灯等）

🎬 结尾（12-15 秒）
 personalized 祝福语
署名和日期`,
    storyboard: [
      { shot: 1, title: '开场 - 节日背景', description: '根据节日主题呈现对应色彩和元素', duration: '3 秒', visualEffect: '渐变过渡 + 主题元素' },
      { shot: 2, title: '元素展示 - 节日符号', description: '节日代表性符号逐一出现', duration: '3 秒', visualEffect: '缩放 + 旋转' },
      { shot: 3, title: '祝福文字 - 节日快乐', description: '节日快乐主题文字华丽呈现', duration: '3 秒', visualEffect: '文字展开 + 光效' },
      { shot: 4, title: '特效展示 - 节日氛围', description: '节日特效（雪花/灯笼/彩灯）', duration: '3 秒', visualEffect: '粒子特效 + 闪烁' },
      { shot: 5, title: '结尾 - 个性化祝福', description: '祝福语和署名', duration: '3 秒', visualEffect: '淡入 + 装饰边框' }
    ],
    previewStyle: {
      background: 'linear-gradient(135deg, #2d5016, #1a3009, #8b4513)',
      particleType: 'snow',
      textAnimation: 'slide-up',
      primaryColor: '#ffd700',
      secondaryColor: '#ff6b6b'
    }
  },
  '个性创意': {
    id: 'creative',
    name: '个性创意',
    icon: '🎨',
    script: `【个性创意视频彩铃】

🎬 开场（0-3 秒）
独特的前卫设计风格
抽象几何图形变换
强烈的视觉冲击

🎬 发展（3-8 秒）
创意元素自由组合
色彩碰撞和渐变
动态图形变换

🎬 高潮（8-12 秒）
个性化文字特效
故障艺术/Glitch 效果
独特的视觉表达

🎬 结尾（12-15 秒）
个人风格展示
创意签名/标识`,
    storyboard: [
      { shot: 1, title: '开场 - 抽象几何', description: '抽象几何图形变换，强烈视觉冲击', duration: '3 秒', visualEffect: '几何变换 + 色彩碰撞' },
      { shot: 2, title: '过渡 - 动态图形', description: '图形自由组合变换，流畅过渡', duration: '3 秒', visualEffect: '形变动画 + 流动效果' },
      { shot: 3, title: '高潮 - 故障艺术', description: 'Glitch 故障效果，独特视觉', duration: '3 秒', visualEffect: '故障闪烁 + 色彩分离' },
      { shot: 4, title: '文字 - 个性展示', description: '个性化文字特效', duration: '3 秒', visualEffect: '文字扭曲 + 霓虹效果' },
      { shot: 5, title: '结尾 - 创意签名', description: '个人风格展示和签名', duration: '3 秒', visualEffect: '手绘动画 + 光效' }
    ],
    previewStyle: {
      background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
      particleType: 'glitch',
      textAnimation: 'neon',
      primaryColor: '#00ffff',
      secondaryColor: '#ff00ff'
    }
  },
  '企业形象': {
    id: 'corporate',
    name: '企业形象',
    icon: '🏢',
    script: `【企业形象视频彩铃】

🎬 开场（0-3 秒）
企业标准色背景
企业 Logo 演绎动画
大气磅礴的开场音乐

🎬 发展（3-8 秒）
企业发展历程/规模展示
核心业务领域介绍
团队风采展示

🎬 高潮（8-12 秒）
企业愿景和使命
"选择我们，选择专业"
实力展示

🎬 结尾（12-15 秒）
完整联系方式
官网/地址/电话
"期待与您携手共创辉煌"`,
    storyboard: [
      { shot: 1, title: '开场 - Logo 演绎', description: '企业 Logo 标准演绎动画', duration: '3 秒', visualEffect: 'Logo 组装 + 光芒效果' },
      { shot: 2, title: '历程 - 时间轴展示', description: '企业发展历程时间轴', duration: '3 秒', visualEffect: '时间轴展开 + 节点高亮' },
      { shot: 3, title: '业务 - 服务介绍', description: '核心业务和服务项目', duration: '3 秒', visualEffect: '卡片切换 + 图标动画' },
      { shot: 4, title: '愿景 - 企业理念', description: '企业愿景和使命宣言', duration: '3 秒', visualEffect: '文字浮现 + 光效扫过' },
      { shot: 5, title: '结尾 - 联系信息', description: '完整联系方式和召唤行动', duration: '3 秒', visualEffect: '信息展示 + 边框装饰' }
    ],
    previewStyle: {
      background: 'linear-gradient(135deg, #1e3a5f, #2c5282, #4299e1)',
      particleType: 'corporate',
      textAnimation: 'professional',
      primaryColor: '#4299e1',
      secondaryColor: '#ffffff'
    }
  }
}

// 音乐彩铃风格模板
interface MusicStyleTemplate {
  id: string
  name: string
  icon: string
  desc: string
  lyrics: string
  visualStyle: {
    background: string
    waveColor: string
    particleType: string
    icon: string
  }
}

const musicStyleTemplates: Record<string, MusicStyleTemplate> = {
  'pop': {
    id: 'pop',
    name: '流行',
    icon: '🎤',
    desc: '轻快节奏，朗朗上口',
    lyrics: `【流行风格 - 彩铃之约】

[主歌 A1]
清晨第一缕阳光洒在窗台
手机响起期待的声音
是你的问候穿越人海
让我的心跟着节奏摇摆

[主歌 A2]
忙碌生活中短暂停留
听到这熟悉的旋律
所有的烦恼都抛在脑后
这一刻只想静静感受

[副歌]
让彩铃连接你我
传递最真的问候
不管相隔多遥远
都能听到我的思念

[尾声]
这一刻 与你相遇
是最美的缘分`,
    visualStyle: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      waveColor: '#ffd700',
      particleType: 'note',
      icon: '🎤'
    }
  },
  'folk': {
    id: 'folk',
    name: '古风',
    icon: '🏮',
    desc: '国风韵味，典雅悠扬',
    lyrics: `【古风风格 - 千年之约】

[主歌 A1]
青石板街烟雨蒙蒙
油纸伞下盼相逢
琴声悠悠穿越时空
只为等待你的出现

[主歌 A2]
桃花扇底江南梦
水墨丹青画中人
一曲相思寄明月
千里共婵娟

[副歌]
千年等待只为这一瞬
彩铃响起如闻故人声
红尘滚滚中有你有我
共谱这最美乐章

[尾声]
愿得一人心 白首不相离
让这古韵传递千年情意`,
    visualStyle: {
      background: 'linear-gradient(135deg, #8b4513, #cd853f, #daa520)',
      waveColor: '#ffebcd',
      particleType: 'petal',
      icon: '🏮'
    }
  },
  'electronic': {
    id: 'electronic',
    name: '电子',
    icon: '🎧',
    desc: '动感节拍，现代科技',
    lyrics: `【电子风格 - 未来之声】

[Build Up]
心跳加速 节拍响起
电流穿过 每个细胞
准备好了吗 一起飞跃
这属于我们的时刻

[Drop]
Boom Boom 感受这节奏
Electro wave 带你遨游
霓虹闪烁 不眠之夜
让音乐点燃整个宇宙

[Breakdown]
放下所有束缚
跟随内心节拍
这一刻 只有音乐
这一刻 只有现在

[尾声]
未来已来 声音无限
让电子音浪 带你飞越`,
    visualStyle: {
      background: 'linear-gradient(135deg, #0f0f23, #1a1a3e, #2d1b69)',
      waveColor: '#00ffff',
      particleType: 'circuit',
      icon: '🎧'
    }
  },
  'rock': {
    id: 'rock',
    name: '摇滚',
    icon: '🎸',
    desc: '激情澎湃，活力四射',
    lyrics: `【摇滚风格 - 燃烧吧】

[主歌 A1]
冲破黎明前的黑暗
点燃心中那团火
不要告诉我该怎么做
我的路我自己选择

[预副歌]
呐喊吧 释放吧
让所有束缚都破碎
这一刻 我要自由

[副歌]
燃烧吧 像火焰一样
咆哮吧 像野兽一样
这是属于我的时代
绝不退缩 绝不认输

[桥段]
吉他嘶吼 鼓点密集
热血沸腾 激情澎湃
这就是摇滚 这就是生活

[尾声]
永远年轻 永远热泪盈眶
让摇滚精神 永远传承`,
    visualStyle: {
      background: 'linear-gradient(135deg, #1a1a1a, #4a0000, #8b0000)',
      waveColor: '#ff4500',
      particleType: 'fire',
      icon: '🎸'
    }
  },
  'jazz': {
    id: 'jazz',
    name: '爵士',
    icon: '🎷',
    desc: '优雅浪漫，格调不凡',
    lyrics: `【爵士风格 - 午夜呢喃】

[主歌 A1]
午夜的城市灯火阑珊
萨克斯风在街角回荡
红酒杯中倒映着月光
这一刻时光变得缓慢

[主歌 A2]
钢琴键上指尖轻舞
低音贝斯轻轻诉说
烟雾缭绕中的微笑
让人沉醉不知归路

[副歌]
让我们跳支舞吧
在这浪漫的夜晚
让爵士乐陪伴我们
直到黎明到来

[尾声]
月光如水 音乐如酒
这一夜 值得珍藏
让爵士情怀 永远流传`,
    visualStyle: {
      background: 'linear-gradient(135deg, #2c1810, #4a3728, #6b4423)',
      waveColor: '#d4af37',
      particleType: 'smoke',
      icon: '🎷'
    }
  },
  'classical': {
    id: 'classical',
    name: '古典',
    icon: '🎻',
    desc: '经典传承，大气磅礴',
    lyrics: `【古典风格 - 命运交响】

[序曲]
当第一缕晨曦照亮殿堂
古典的旋律在空气中回荡
三百年的传承在此刻
焕发新的光芒

[第一乐章]
弦乐四重奏优雅奏响
钢琴如流水般倾泻
这是属于古典的荣耀
永恒的艺术盛宴

[第二乐章]
慢板如歌 深情款款
每一个音符都是诗篇
让人忘却尘世喧嚣
沉浸在音乐海洋

[终章]
交响乐气势磅礴
合唱团恢弘壮丽
古典音乐的力量
震撼每一个人的心

[尾声]
让经典永远流传
让美好永不消逝
这是属于全人类的
音乐财富`,
    visualStyle: {
      background: 'linear-gradient(135deg, #1a1a2e, #2d2d44, #4a4a6a)',
      waveColor: '#c0c0c0',
      particleType: 'staff',
      icon: '🎻'
    }
  }
}

// 增强的对话响应生成
const generateResponse = (input: string, memory: ConversationMemory[]): { response: string; suggestions?: string[]; action?: () => void } => {
  const normalizedInput = input.toLowerCase()

  // 视频彩铃相关
  if (normalizedInput.includes('视频') || normalizedInput.includes('彩铃') || normalizedInput.includes('创作')) {
    return {
      response: '好的！我来帮您创作视频彩铃 🎬\n\n视频彩铃可以让您的来电等待时间变得更加精彩。请告诉我您想要什么主题的视频？',
      suggestions: ['新年祝福', '商务形象', '生日快乐', '节日问候', '个性创意']
    }
  }

  // 音乐彩铃相关
  if (normalizedInput.includes('音乐') || normalizedInput.includes('歌曲') || normalizedInput.includes('铃声')) {
    return {
      response: '我来帮您创作音乐彩铃 🎵\n\nAI 可以为您生成专属的原创音乐，请选择您喜欢的风格：',
      suggestions: ['流行音乐', '古风音乐', '电子音乐', '摇滚风格']
    }
  }

  // 接线员相关
  if (normalizedInput.includes('接线') || normalizedInput.includes('来电') || normalizedInput.includes('电话')) {
    return {
      response: 'AI 接线员可以帮您自动接听来电！📞\n\n当您忙碌或不方便接听时，AI 可以智能应对各种来电场景。',
      suggestions: ['设置 AI 接线员', '查看通话记录', '了解功能详情']
    }
  }

  // 价格相关
  if (normalizedInput.includes('价格') || normalizedInput.includes('费用') || normalizedInput.includes('多少钱')) {
    return {
      response: '我们的 AI 彩铃服务价格如下：\n\n• 基础版：免费（每月 5 次创作）\n• 会员版：¥15/月（无限创作 + 高级模板）\n• 企业版：¥99/月（企业形象定制）\n\n现在开通会员享首月优惠哦！'
    }
  }

  // 如何使用
  if (normalizedInput.includes('怎么用') || normalizedInput.includes('如何') || normalizedInput.includes('教程')) {
    return {
      response: '使用 AI 彩铃很简单：\n\n1️⃣ 选择创作类型（视频/音乐）\n2️⃣ 输入您的创意描述\n3️⃣ AI 自动生成内容\n4️⃣ 预览并设置为彩铃\n\n点击下方的功能按钮即可开始创作！',
      suggestions: ['视频彩铃创作', '音乐彩铃创作']
    }
  }

  // 问候语
  if (normalizedInput.includes('你好') || normalizedInput.includes('您好') || normalizedInput.includes('hi')) {
    return {
      response: '您好！我是小呦，您的 AI 彩铃创作助手 🎵\n\n很高兴为您服务，请问今天想要创作什么样的彩铃呢？',
      suggestions: ['创作视频彩铃', '创作音乐彩铃', '了解 AI 彩铃']
    }
  }

  // 感谢
  if (normalizedInput.includes('谢谢') || normalizedInput.includes('感谢')) {
    return {
      response: '不客气！能为您服务是我的荣幸 😊\n\n如果还有其他需要，随时告诉我哦！',
      suggestions: ['继续创作', '查看作品', '分享好友']
    }
  }

  // 默认响应
  return {
    response: `收到您的需求了！我正在为您处理...\n\n您可以尝试：\n🎬 输入"视频彩铃"创作视频\n🎵 输入"音乐彩铃"生成音乐\n📞 输入"AI 接线"设置来电应答`,
    suggestions: ['视频彩铃', '音乐彩铃', 'AI 接线员']
  }
}

export default function XiaoyouPage({ onBack }: XiaoyouPageProps) {
  const [mode, setMode] = useState<CreationMode>('chat')
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '您好！我是小呦，您的AI彩铃创作助手 🎵\n\n我可以帮您：\n• 🎬 创作视频彩铃（文生视频）\n• 🎵 生成音乐彩铃（AI作曲）\n• 📞 设置AI接线员\n\n请选择您需要的功能，或直接告诉我您的需求~',
      time: '10:00'
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingMessage, setTypingMessage] = useState('')
  const [isCallComing, setIsCallComing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 视频创作状态
  const [videoCreation, setVideoCreation] = useState<VideoCreation>({
    step: 'input',
    input: '',
    script: '',
    storyboard: [],
    progress: 0
  })

  // 音乐创作状态
  const [musicCreation, setMusicCreation] = useState<MusicCreation>({
    step: 'style',
    style: '',
    styleName: '',
    lyrics: '',
    progress: 0,
    isPlaying: false,
    currentTime: 0
  })

  // 视频预览播放状态
  const [videoPreviewPlaying, setVideoPreviewPlaying] = useState(false)
  const [videoPreviewCurrentShot, setVideoPreviewCurrentShot] = useState(0)

  // 音乐播放定时器
  const musicPlayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const videoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 音乐播放定时器效果
  useEffect(() => {
    if (musicCreation.isPlaying && musicCreation.step === 'preview' && musicCreation.currentTime < 15) {
      musicPlayTimerRef.current = setInterval(() => {
        setMusicCreation(prev => {
          if (prev.currentTime >= 15) {
            return { ...prev, isPlaying: false, currentTime: 0 }
          }
          return { ...prev, currentTime: prev.currentTime + 0.1 }
        })
      }, 100)
    } else {
      if (musicPlayTimerRef.current) {
        clearInterval(musicPlayTimerRef.current)
      }
    }
    return () => {
      if (musicPlayTimerRef.current) {
        clearInterval(musicPlayTimerRef.current)
      }
    }
  }, [musicCreation.isPlaying, musicCreation.step])

  // 处理聊天
  const handleChat = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      role: 'user' as const,
      content: inputValue,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const input = inputValue.toLowerCase()
      let response = ''

      if (input.includes('视频') || input.includes('彩铃')) {
        response = '好的！我来帮您创作视频彩铃 🎬\n\n请告诉我您想要什么样的视频？\n例如："新年祝福"、"商务形象"、"生日快乐"'
      } else if (input.includes('音乐') || input.includes('歌曲')) {
        response = '我来帮您创作音乐彩铃 🎵\n\n请选择您喜欢的音乐风格：\n• 流行\n• 古风\n• 电子\n• 摇滚'
      } else if (input.includes('接线') || input.includes('来电')) {
        response = 'AI接线员可以帮您自动接听来电！\n\n您想设置什么模式？\n• 全天开启\n• 忙碌时开启\n• 定时开启'
      } else {
        response = `收到！我正在为您处理...\n\n您还可以体验：\n🎬 视频彩铃创作\n🎵 音乐彩铃生成\n📞 AI接线员设置`
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }])
      setIsTyping(false)
    }, 1500)
  }

  // 打字机效果函数
  const typeMessage = (text: string, onComplete?: () => void) => {
    let index = 0
    const chars = text.split('')
    setTypingMessage('')

    const interval = setInterval(() => {
      if (index < chars.length) {
        setTypingMessage(prev => prev + chars[index])
        index++
      } else {
        clearInterval(interval)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: text,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }])
        setTypingMessage('')
        onComplete?.()
      }
    }, 30)
  }

  // ============ 视频创作流程 ============
  const startVideoCreation = (theme: string) => {
    setVideoCreation({
      step: 'script',
      input: theme,
      script: '',
      storyboard: [],
      progress: 0
    })

    // 模拟生成剧本
    setTimeout(() => {
      const scripts: Record<string, string> = {
        '新年祝福': `【新年祝福视频彩铃】

开场：红红火火的背景，烟花绽放
画面：舞狮跳跃，锣鼓喧天
主角：您的人像出现在画面中央
祝福语：恭祝新春快乐，万事如意
结尾：您的姓名和企业Logo`,
        '商务形象': `【商务形象视频彩铃】

开场：简约大气的企业色调
画面：城市天际线，科技元素
主角：专业商务形象展示
核心：展示您的业务领域
结尾：联系方式和企业口号`,
        '生日快乐': `【生日祝福视频彩铃】

开场：温馨的烛光效果
画面：生日蛋糕缓缓升起
主角：寿星照片融入场景
祝福语：祝您生日快乐，梦想成真
结尾：温馨祝福语和署名`
      }

      setVideoCreation(prev => ({
        ...prev,
        script: scripts[theme] || `【${theme}视频彩铃】\n\n根据您的需求，为您生成专属剧本...`
      }))
    }, 2000)
  }

  const generateStoryboard = () => {
    setVideoCreation(prev => ({ ...prev, step: 'storyboard' }))

    const shots = [
      { shot: 1, description: '开场镜头 - 场景建立', duration: '2秒' },
      { shot: 2, description: '主题呈现 - 核心内容', duration: '4秒' },
      { shot: 3, description: '人物展示 - 个人形象', duration: '3秒' },
      { shot: 4, description: '祝福表达 - 文字动画', duration: '3秒' },
      { shot: 5, description: '结尾展示 - Logo和联系方式', duration: '3秒' }
    ]

    setTimeout(() => {
      setVideoCreation(prev => ({
        ...prev,
        storyboard: shots.map(s => ({ ...s, status: 'pending' as const }))
      }))
    }, 1000)
  }

  const startVideoGeneration = () => {
    setVideoCreation(prev => ({ ...prev, step: 'generating', progress: 0 }))

    // 模拟逐镜头生成
    const shots = videoCreation.storyboard
    shots.forEach((_, index) => {
      setTimeout(() => {
        setVideoCreation(prev => {
          const newStoryboard = [...prev.storyboard]
          if (newStoryboard[index]) {
            newStoryboard[index] = { ...newStoryboard[index], status: 'generating' }
          }
          return { ...prev, storyboard: newStoryboard }
        })

        // 完成当前镜头
        setTimeout(() => {
          setVideoCreation(prev => {
            const newStoryboard = [...prev.storyboard]
            if (newStoryboard[index]) {
              newStoryboard[index] = { ...newStoryboard[index], status: 'done' }
            }
            const progress = ((index + 1) / prev.storyboard.length) * 100
            return { ...prev, storyboard: newStoryboard, progress }
          })
        }, 2000)
      }, index * 3500)
    })

    // 最终完成
    setTimeout(() => {
      setVideoCreation(prev => ({
        ...prev,
        step: 'preview',
        videoUrl: 'demo-video.mp4'
      }))
    }, shots.length * 3500 + 1000)
  }

  // ============ 音乐创作流程 ============
  const musicStyles = [
    { id: 'pop', name: '流行', icon: '🎤', desc: '轻快节奏，朗朗上口' },
    { id: 'folk', name: '古风', icon: '🏮', desc: '国风韵味，典雅悠扬' },
    { id: 'electronic', name: '电子', icon: '🎧', desc: '动感节拍，现代科技' },
    { id: 'rock', name: '摇滚', icon: '🎸', desc: '激情澎湃，活力四射' },
    { id: 'jazz', name: '爵士', icon: '🎷', desc: '优雅浪漫，格调不凡' },
    { id: 'classical', name: '古典', icon: '🎻', desc: '经典传承，大气磅礴' }
  ]

  const selectMusicStyle = (styleId: string) => {
    setMusicCreation(prev => ({ ...prev, style: styleId }))
    
    setTimeout(() => {
      setMusicCreation(prev => ({ ...prev, step: 'lyrics' }))
      
      // 模拟生成歌词
      setTimeout(() => {
        const lyrics = `【AI生成歌词】

[主歌]
时光匆匆流转
梦想在心间
每一步都是新的起点
勇敢向前不回头

[副歌]
彩铃声声问候
传递温暖祝福
这一刻与你相遇
是最美的缘分

[尾声]
让音乐连接你我
让快乐永不落幕`

        setMusicCreation(prev => ({ ...prev, lyrics }))
      }, 2000)
    }, 1000)
  }

  const startMusicGeneration = () => {
    setMusicCreation(prev => ({ ...prev, step: 'generating', progress: 0 }))

    const interval = setInterval(() => {
      setMusicCreation(prev => {
        const newProgress = prev.progress + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          return { ...prev, progress: 100, step: 'preview', audioUrl: 'demo.mp3' }
        }
        return { ...prev, progress: newProgress }
      })
    }, 150)
  }

  // ============ 渲染 ============
  if (mode === 'video') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0a0a0a' }}>
        {/* 头部 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center',
          gap: 12,
          color: 'white'
        }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => setMode('chat')} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16 }}>🎬 AI视频彩铃创作</h2>
            <p style={{ fontSize: 12, opacity: 0.7 }}>一句话生成专属视频彩铃</p>
          </div>
        </div>

        <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
          {/* Step 1: 输入需求 */}
          {videoCreation.step === 'input' && (
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: 32, marginTop: 20 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
                <h3 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>您想要什么样的视频彩铃？</h3>
                <p style={{ color: '#888', fontSize: 14 }}>选择主题或自定义描述</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['新年祝福', '商务形象', '生日快乐', '节日问候', '个性创意', '企业形象'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => startVideoCreation(theme)}
                    style={{
                      padding: 16,
                      background: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
                      border: '1px solid #333',
                      borderRadius: 12,
                      color: 'white',
                      fontSize: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{['🎊', '💼', '🎂', '🎄', '🎨', '🏢'][['新年祝福', '商务形象', '生日快乐', '节日问候', '个性创意', '企业形象'].indexOf(theme)]}</span>
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 剧本生成 */}
          {videoCreation.step === 'script' && (
            <div className="fade-in" style={{ textAlign: 'center', padding: 40 }}>
              <Loader2 size={48} className="pulse" style={{ color: '#e60012', marginBottom: 16 }} />
              <h3 style={{ color: 'white', marginBottom: 8 }}>AI正在创作剧本...</h3>
              <p style={{ color: '#888' }}>根据"{videoCreation.input}"生成专属剧本</p>
            </div>
          )}

          {/* Step 3: 剧本确认 + 分镜 */}
          {videoCreation.step === 'storyboard' && videoCreation.script && (
            <div className="fade-in">
              <div style={{ 
                background: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 16 
              }}>
                <h4 style={{ color: 'white', marginBottom: 12 }}>📝 AI生成的剧本</h4>
                <pre style={{ color: '#ccc', fontSize: 13, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {videoCreation.script}
                </pre>
              </div>

              <h4 style={{ color: 'white', marginBottom: 12 }}>🎬 分镜脚本</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {videoCreation.storyboard.map((shot) => (
                  <div key={shot.shot} style={{
                    background: '#1a1a2e',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      background: '#e60012', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 600
                    }}>
                      {shot.shot}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 14 }}>{shot.description}</p>
                      <p style={{ color: '#888', fontSize: 12 }}>{shot.duration}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={startVideoGeneration}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 24, background: '#e60012' }}
              >
                🎬 开始生成视频
              </button>
            </div>
          )}

          {/* Step 4: 生成中 */}
          {videoCreation.step === 'generating' && (
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
                <h3 style={{ color: 'white', marginBottom: 8 }}>AI正在生成视频...</h3>
                <p style={{ color: '#888' }}>请稍候，这可能需要一点时间</p>
              </div>

              {/* 进度条 */}
              <div style={{ 
                background: '#1a1a2e', 
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 16 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#888', fontSize: 14 }}>整体进度</span>
                  <span style={{ color: '#e60012', fontSize: 14, fontWeight: 600 }}>{Math.round(videoCreation.progress)}%</span>
                </div>
                <div style={{ height: 8, background: '#333', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${videoCreation.progress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #e60012, #ff4d4d)',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              {/* 镜头状态 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {videoCreation.storyboard.map((shot) => (
                  <div key={shot.shot} style={{
                    background: '#1a1a2e',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: shot.status === 'pending' ? 0.5 : 1
                  }}>
                    {shot.status === 'done' ? (
                      <Check size={20} style={{ color: '#52c41a' }} />
                    ) : shot.status === 'generating' ? (
                      <Loader2 size={20} className="pulse" style={{ color: '#e60012' }} />
                    ) : (
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #555' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 14 }}>{shot.description}</p>
                    </div>
                    <span style={{ color: '#666', fontSize: 12 }}>{shot.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: 预览 */}
          {videoCreation.step === 'preview' && (() => {
            const themeData: Record<string, any> = {
              '新年祝福': {
                gradient: 'linear-gradient(135deg, #c41e3a, #8b0000, #ff6b6b)',
                particles: ['🎆', '🧧', '🎊', '✨', '🎆'],
                title: '新年快乐',
                subtitle: '恭祝新春 万事如意',
                animation: 'firework'
              },
              '商务形象': {
                gradient: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                particles: ['💼', '📊', '🎯', '✨', '🏆'],
                title: '专业 可靠 创新',
                subtitle: '携手共创美好未来',
                animation: 'tech'
              },
              '生日快乐': {
                gradient: 'linear-gradient(135deg, #ff69b4, #da70d6, #ffb6c1)',
                particles: ['🎂', '🎈', '🎁', '🎉', '💕'],
                title: '生日快乐',
                subtitle: '愿所有美好都与你相伴',
                animation: 'float'
              },
              '节日问候': {
                gradient: 'linear-gradient(135deg, #2d5016, #1a3009, #228b22)',
                particles: ['🎄', '❄️', '🎁', '🎅', '⭐'],
                title: '节日快乐',
                subtitle: '温馨祝福 欢乐时光',
                animation: 'snow'
              },
              '个性创意': {
                gradient: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                particles: ['🎨', '💫', '🌈', '✨', '🎭'],
                title: 'Be Unique',
                subtitle: '展现真我 无限可能',
                animation: 'wave'
              },
              '企业形象': {
                gradient: 'linear-gradient(135deg, #000428, #004e92)',
                particles: ['🏢', '🌐', '📈', '💼', '🌟'],
                title: '企业标语',
                subtitle: '专业服务 值得信赖',
                animation: 'fade'
              }
            }
            const theme = themeData[videoCreation.input] || themeData['个性创意']
            
            return (
              <div className="fade-in">
                {/* 视频预览容器 */}
                <div style={{ 
                  background: '#000', 
                  borderRadius: 12, 
                  aspectRatio: '9/16',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* 主题背景 */}
                  <div style={{ 
                    position: 'absolute',
                    inset: 0,
                    background: theme.gradient,
                    animation: 'pulse-bg 3s ease-in-out infinite'
                  }} />
                  
                  {/* 粒子效果 */}
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    {theme.particles.map((p: string, i: number) => (
                      <div key={i} style={{
                        position: 'absolute',
                        fontSize: 32,
                        animation: `float-particle 3s ease-in-out infinite`,
                        animationDelay: `${i * 0.5}s`,
                        left: `${10 + i * 18}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        opacity: 0.8
                      }}>{p}</div>
                    ))}
                  </div>
                  
                  {/* 中心内容 */}
                  <div style={{ 
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    padding: 20
                  }}>
                    <div style={{ 
                      fontSize: 80, 
                      marginBottom: 20,
                      animation: 'bounce 2s ease-in-out infinite'
                    }}>
                      {videoCreation.input === '新年祝福' ? '🎊' : 
                       videoCreation.input === '商务形象' ? '💼' :
                       videoCreation.input === '生日快乐' ? '🎂' :
                       videoCreation.input === '节日问候' ? '🎄' :
                       videoCreation.input === '个性创意' ? '🎨' : '🏢'}
                    </div>
                    <h3 style={{ 
                      fontSize: 28, 
                      marginBottom: 12,
                      fontWeight: 700,
                      textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                      animation: 'slide-up 1s ease-out'
                    }}>
                      {theme.title}
                    </h3>
                    <p style={{ 
                      fontSize: 16, 
                      opacity: 0.9,
                      textShadow: '0 1px 10px rgba(0,0,0,0.5)',
                      animation: 'slide-up 1s ease-out 0.2s both'
                    }}>
                      {theme.subtitle}
                    </p>
                  </div>
                  
                  {/* 播放按钮 */}
                  <button style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: 56,
                    height: 56,
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}>
                    <Play size={28} color="white" />
                  </button>
                  
                  {/* 时长标签 */}
                  <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'rgba(0,0,0,0.5)',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    color: 'white'
                  }}>
                    0:15
                  </div>
                </div>

                {/* 信息卡片 */}
                <div style={{ 
                  background: '#1a1a2e', 
                  borderRadius: 12, 
                  padding: 16,
                  marginBottom: 16
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: 'white', fontWeight: 600 }}>{videoCreation.input}</p>
                      <p style={{ color: '#888', fontSize: 12, marginTop: 4 }}>视频彩铃 · 15秒</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{
                        padding: '8px 12px',
                        background: '#2a2a4e',
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <RefreshCw size={14} />
                        重新生成
                      </button>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-primary" style={{ flex: 2, background: '#e60012' }}>
                    <Check size={20} />
                    设为彩铃
                  </button>
                  <button className="btn" style={{ flex: 1, background: '#1a1a2e', color: 'white' }}>
                    <Download size={20} />
                    下载
                  </button>
                  <button className="btn" style={{ background: '#1a1a2e', color: 'white' }}>
                    <Share2 size={20} />
                  </button>
                </div>
                
                {/* CSS动画 */}
                <style>{`
                  @keyframes pulse-bg {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                  }
                  @keyframes float-particle {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                  }
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                  }
                  @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )
          })()}
        </div>
      </div>
    )
  }

  if (mode === 'music') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0a0a0a' }}>
        {/* 头部 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center',
          gap: 12,
          color: 'white'
        }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => setMode('chat')} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16 }}>🎵 AI音乐彩铃创作</h2>
            <p style={{ fontSize: 12, opacity: 0.7 }}>AI作曲，一键生成专属铃声</p>
          </div>
        </div>

        <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
          {/* Step 1: 选择风格 */}
          {musicCreation.step === 'style' && (
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: 32, marginTop: 20 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎵</div>
                <h3 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>选择您喜欢的音乐风格</h3>
                <p style={{ color: '#888', fontSize: 14 }}>AI将根据风格为您创作专属音乐</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {musicStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => selectMusicStyle(style.id)}
                    style={{
                      padding: 20,
                      background: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
                      border: '1px solid #333',
                      borderRadius: 12,
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{style.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{style.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 歌词生成 */}
          {musicCreation.step === 'lyrics' && !musicCreation.lyrics && (
            <div className="fade-in" style={{ textAlign: 'center', padding: 40 }}>
              <Loader2 size={48} className="pulse" style={{ color: '#e60012', marginBottom: 16 }} />
              <h3 style={{ color: 'white', marginBottom: 8 }}>AI正在创作歌词...</h3>
              <p style={{ color: '#888' }}>根据您选择的风格生成专属歌词</p>
            </div>
          )}

          {/* Step 3: 歌词确认 */}
          {musicCreation.step === 'lyrics' && musicCreation.lyrics && (
            <div className="fade-in">
              <div style={{ 
                background: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 16 
              }}>
                <h4 style={{ color: 'white', marginBottom: 12 }}>📝 AI生成的歌词</h4>
                <pre style={{ color: '#ccc', fontSize: 14, whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.8 }}>
                  {musicCreation.lyrics}
                </pre>
              </div>

              <button 
                onClick={startMusicGeneration}
                className="btn btn-primary"
                style={{ width: '100%', background: '#e60012' }}
              >
                🎵 开始生成音乐
              </button>
            </div>
          )}

          {/* Step 4: 生成中 */}
          {musicCreation.step === 'generating' && (
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: 32, marginTop: 40 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎵</div>
                <h3 style={{ color: 'white', marginBottom: 8 }}>AI正在创作音乐...</h3>
                <p style={{ color: '#888' }}>旋律编排中，请稍候</p>
              </div>

              {/* 进度条 */}
              <div style={{ 
                background: '#1a1a2e', 
                borderRadius: 12, 
                padding: 16
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#888', fontSize: 14 }}>生成进度</span>
                  <span style={{ color: '#e60012', fontSize: 14, fontWeight: 600 }}>{musicCreation.progress}%</span>
                </div>
                <div style={{ height: 8, background: '#333', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${musicCreation.progress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #e60012, #ff4d4d)',
                    transition: 'width 0.3s'
                  }} />
                </div>

                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['歌词合成', '旋律生成', '编曲配器', '混音处理'].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {musicCreation.progress > (i + 1) * 25 ? (
                        <Check size={16} style={{ color: '#52c41a' }} />
                      ) : musicCreation.progress > i * 25 ? (
                        <Loader2 size={16} className="pulse" style={{ color: '#e60012' }} />
                      ) : (
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #555' }} />
                      )}
                      <span style={{ color: musicCreation.progress > i * 25 ? 'white' : '#666', fontSize: 14 }}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: 预览 - 音乐播放界面 */}
          {musicCreation.step === 'preview' && (
            <div className="fade-in">
              {/* 专辑封面和播放控制 */}
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 16,
                textAlign: 'center'
              }}>
                {/* 旋转唱片动画 */}
                <div style={{
                  width: 140,
                  height: 140,
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(230, 0, 18, 0.3)',
                  border: '4px solid #333',
                  animation: musicCreation.isPlaying ? 'rotate 3s linear infinite' : 'none',
                  position: 'relative'
                }}>
                  <div style={{
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(135deg, #e60012, #ff6b6b)',
                    borderRadius: '50%'
                  }} />
                  {/* 唱片纹理 */}
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                      position: 'absolute',
                      width: `${50 + i * 18}px`,
                      height: `${50 + i * 18}px`,
                      border: `2px solid rgba(255,255,255,0.1)`,
                      borderRadius: '50%'
                    }} />
                  ))}
                </div>
                <h3 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>
                  {musicCreation.styleName || '您的专属音乐彩铃'}
                </h3>
                <p style={{ color: '#888', fontSize: 14 }}>时长：15 秒</p>

                {/* 播放进度条 */}
                <div style={{
                  marginTop: 24,
                  marginBottom: 16
                }}>
                  <div style={{
                    height: 6,
                    background: '#333',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}>
                    <div style={{
                      width: `${(musicCreation.currentTime / 15) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #e60012, #ff4d4d)',
                      transition: 'width 0.1s linear'
                    }} />
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    fontSize: 12,
                    color: '#666'
                  }}>
                    <span>0:{String(Math.floor(musicCreation.currentTime)).padStart(2, '0')}</span>
                    <span>0:15</span>
                  </div>
                </div>

                {/* 播放控制按钮 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 24,
                  marginTop: 16
                }}>
                  <button
                    onClick={() => setMusicCreation(prev => ({ ...prev, currentTime: 0, isPlaying: true }))}
                    style={{
                      width: 44,
                      height: 44,
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button
                    onClick={() => setMusicCreation(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                    style={{
                      width: 64,
                      height: 64,
                      background: 'linear-gradient(135deg, #e60012, #ff6b6b)',
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(230, 0, 18, 0.4)'
                    }}
                  >
                    {musicCreation.isPlaying ? (
                      <Pause size={32} color="white" />
                    ) : (
                      <Play size={32} color="white" style={{ marginLeft: 4 }} />
                    )}
                  </button>
                  <button
                    onClick={() => setMusicCreation(prev => ({ ...prev, currentTime: 15, isPlaying: false }))}
                    style={{
                      width: 44,
                      height: 44,
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                  >
                    <RefreshCw size={20} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                </div>

                {/* 动态波形动画 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  marginTop: 24,
                  height: 50,
                  alignItems: 'flex-end'
                }}>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const baseHeight = 10 + Math.sin(i * 0.8) * 8
                    const activeHeight = 15 + Math.sin(i * 0.8 + musicCreation.currentTime * 2) * 20 + Math.random() * 15
                    return (
                      <div key={i} style={{
                        width: 4,
                        background: 'linear-gradient(to top, #e60012, #ff6b6b)',
                        borderRadius: 2,
                        height: musicCreation.isPlaying ? `${activeHeight}px` : `${baseHeight}px`,
                        transition: 'height 0.15s ease',
                        opacity: musicCreation.isPlaying ? 1 : 0.5
                      }} />
                    )
                  })}
                </div>

                {/* 歌词展示 */}
                {musicCreation.lyrics && (
                  <div style={{
                    marginTop: 20,
                    padding: 16,
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 12,
                    maxHeight: 120,
                    overflowY: 'auto'
                  }}>
                    <pre style={{
                      color: '#aaa',
                      fontSize: 12,
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      {musicCreation.lyrics}
                    </pre>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => alert('已设为彩铃！')}
                  className="btn btn-primary"
                  style={{ flex: 1, background: '#e60012' }}
                >
                  <Check size={20} />
                  设为彩铃
                </button>
                <button className="btn" style={{ flex: 1, background: '#1a1a2e', color: 'white' }}>
                  <Download size={20} />
                  下载
                </button>
              </div>

              <style>{`
                @keyframes rotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </div>

        <style>{`
          @keyframes wave {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }

          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }

          @keyframes bubblePop {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @keyframes typingDot {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }

          @keyframes callRing {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes callShake {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }

          @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
          }

          @keyframes blink {
            50% { border-color: transparent; }
          }

          .fade-in {
            animation: fadeIn 0.4s ease-out;
          }

          .chat-message.user {
            animation: slideInRight 0.3s ease-out;
          }

          .chat-message.assistant {
            animation: slideInLeft 0.3s ease-out;
          }

          .chat-message {
            animation: bubblePop 0.3s ease-out;
          }

          .pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }

          .typing-dot span {
            animation: typingDot 1.4s ease-in-out infinite;
          }

          .typing-dot span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .typing-dot span:nth-child(3) {
            animation-delay: 0.4s;
          }

          .call-coming {
            animation: callRing 0.8s ease-in-out infinite;
          }

          .call-shake {
            animation: callShake 0.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  // 聊天模式
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* 头部 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '12px 16px', 
        display: 'flex', 
        alignItems: 'center',
        gap: 12,
        color: 'white'
      }}>
        <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={onBack} />
        <div style={{ 
          width: 40, 
          height: 40, 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24
        }}>
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 16 }}>小呦智能体</h2>
          <p style={{ fontSize: 12, opacity: 0.8 }}>您的AI彩铃助手</p>
        </div>
      </div>

      {/* 快捷功能入口 */}
      <div style={{
        padding: 12,
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        display: 'flex',
        gap: 8
      }}>
        <button 
          onClick={() => setMode('video')}
          style={{
            flex: 1,
            padding: 16,
            background: 'linear-gradient(135deg, #e60012, #ff6b6b)',
            border: 'none',
            borderRadius: 12,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer'
          }}
        >
          <Video size={20} />
          视频彩铃
        </button>
        <button 
          onClick={() => setMode('music')}
          style={{
            flex: 1,
            padding: 16,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            borderRadius: 12,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer'
          }}
        >
          <Music size={20} />
          音乐彩铃
        </button>
      </div>

      {/* 消息区域 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        background: '#0a0a0a'
      }}>
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`chat-message ${msg.role}`}
            style={{
              marginBottom: 12,
              whiteSpace: 'pre-wrap'
            }}
          >
            {msg.content}
            <div style={{ 
              fontSize: 10, 
              color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#999',
              marginTop: 4
            }}>
              {msg.time}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-message assistant" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="pulse" style={{ display: 'flex', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: '#e60012', borderRadius: '50%' }} />
              <span style={{ width: 6, height: 6, background: '#e60012', borderRadius: '50%' }} />
              <span style={{ width: 6, height: 6, background: '#e60012', borderRadius: '50%' }} />
            </div>
            正在思考...
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="chat-input-container">
        <input
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleChat()}
          placeholder="输入文字或语音描述..."
        />
        <button 
          style={{ 
            padding: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Mic size={24} color="#e60012" />
        </button>
        <button 
          onClick={handleChat}
          style={{ 
            padding: 8,
            background: '#e60012',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={20} color="white" />
        </button>
      </div>
    </div>
  )
}