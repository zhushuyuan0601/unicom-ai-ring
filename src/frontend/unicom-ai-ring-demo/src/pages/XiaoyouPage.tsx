import { useState, useRef } from 'react'
import { ArrowLeft, Send, Mic, Image, Sparkles, Video, Music, Camera, FileText } from 'lucide-react'

interface XiaoyouPageProps {
  onBack: () => void
}

// 模拟对话数据
const mockMessages = [
  { 
    role: 'assistant', 
    content: '您好！我是小呦，您的AI彩铃创作助手 🎵\n\n我可以帮您：\n• 创作个性化彩铃\n• 设置AI接线员\n• 管理通话速记\n\n请问有什么可以帮您？',
    time: '10:00'
  },
]

// 快捷功能
const quickActions = [
  { icon: '🎬', label: '制作视频彩铃' },
  { icon: '🎵', label: '生成音乐彩铃' },
  { icon: '📞', label: '设置AI接线' },
  { icon: '📝', label: '查看通话速记' },
]

export default function XiaoyouPage({ onBack }: XiaoyouPageProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // 添加用户消息
    const userMessage = {
      role: 'user' as const,
      content: messageText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const responses: Record<string, string> = {
        '制作视频彩铃': '好的！请告诉我您想要什么样的视频彩铃？\n\n例如：\n• "做一个新年祝福彩铃"\n• "生成一个商务形象视频"\n• "创作一个生日祝福视频"',
        '生成音乐彩铃': '我可以帮您生成个性化音乐彩铃！\n\n请描述您想要的音乐风格：\n• 欢快流行\n• 古典优雅\n• 电子音乐\n• 古风国韵',
        '设置AI接线': 'AI接线员可以帮您自动接听来电。您可以设置：\n\n1. 工作模式（全天/忙碌时/定时）\n2. 问候语\n3. 智能应答风格\n\n点击下方按钮进入设置页面',
        '查看通话速记': '您最近的通话速记：\n\n📞 张经理 - 今天 10:30\n   通话3分钟，已生成摘要\n\n📞 李女士 - 今天 09:15\n   已提取待办事项\n\n点击查看详情',
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: responses[messageText] || `收到您的请求"${messageText}"！\n\n我正在为您处理，请稍候...`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

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
        <Sparkles size={24} style={{ cursor: 'pointer' }} />
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

      {/* 快捷功能 */}
      <div style={{ 
        padding: '8px 16px',
        background: 'white',
        display: 'flex',
        gap: 8,
        overflowX: 'auto'
      }}>
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSend(action.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              background: '#f5f5f5',
              border: 'none',
              borderRadius: 16,
              fontSize: 13,
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="chat-input-container">
        <button style={{ 
          padding: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}>
          <Image size={24} color="#666" />
        </button>
        <input
          ref={inputRef}
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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
          onClick={() => handleSend()}
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