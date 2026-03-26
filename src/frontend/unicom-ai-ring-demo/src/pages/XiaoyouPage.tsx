import { useState, useEffect } from 'react'
import { ArrowLeft, Send, Mic, Image, Sparkles, Video, Music, Camera, FileText, Loader2, Check, Play, Pause, Download, Share2 } from 'lucide-react'

interface XiaoyouPageProps {
  onBack: () => void
}

type CreationMode = 'chat' | 'video' | 'music'

// 视频创作状态
interface VideoCreation {
  step: 'input' | 'script' | 'storyboard' | 'generating' | 'preview'
  input: string
  script: string
  storyboard: { shot: number; description: string; duration: string; status: 'pending' | 'generating' | 'done' }[]
  progress: number
  videoUrl?: string
}

// 音乐创作状态
interface MusicCreation {
  step: 'style' | 'lyrics' | 'generating' | 'preview'
  style: string
  lyrics: string
  progress: number
  audioUrl?: string
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
    lyrics: '',
    progress: 0
  })

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
                <p style={{ color: '#888', fontSize: 14 }>选择主题或自定义描述</p>
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
          {videoCreation.step === 'preview' && (
            <div className="fade-in">
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
                <div style={{ 
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(45deg, #e60012, #ff6b6b)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🎊</div>
                  <h3 style={{ fontSize: 24, marginBottom: 8 }}>{videoCreation.input}</h3>
                  <p style={{ fontSize: 16, opacity: 0.8 }}>视频彩铃已生成</p>
                </div>
                <button style={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  width: 48,
                  height: 48,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <Play size={24} color="white" />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" style={{ flex: 1, background: '#e60012' }}>
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
            </div>
          )}
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

          {/* Step 5: 预览 */}
          {musicCreation.step === 'preview' && (
            <div className="fade-in">
              <div style={{ 
                background: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
                borderRadius: 12, 
                padding: 24, 
                marginBottom: 16,
                textAlign: 'center'
              }}>
                <div style={{ 
                  width: 120, 
                  height: 120, 
                  margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #e60012, #ff6b6b)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(230, 0, 18, 0.4)'
                }}>
                  <Play size={48} color="white" />
                </div>
                <h3 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>您的专属音乐彩铃</h3>
                <p style={{ color: '#888', fontSize: 14 }}>时长：15秒</p>

                {/* 波形动画 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 4, 
                  marginTop: 24,
                  height: 40 
                }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} style={{
                      width: 4,
                      background: '#e60012',
                      borderRadius: 2,
                      animation: `wave 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.05}s`,
                      height: `${20 + Math.random() * 20}px`
                    }} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" style={{ flex: 1, background: '#e60012' }}>
                  <Check size={20} />
                  设为彩铃
                </button>
                <button className="btn" style={{ flex: 1, background: '#1a1a2e', color: 'white' }}>
                  <Download size={20} />
                  下载
                </button>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes wave {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1); }
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
        background: 'white',
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
        background: '#f5f5f5'
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