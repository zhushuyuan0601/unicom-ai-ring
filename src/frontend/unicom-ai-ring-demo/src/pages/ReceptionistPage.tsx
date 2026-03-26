import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Phone, PhoneOff, Mic, Volume2, Settings, Clock, User, MessageSquare, CheckCircle, XCircle, AlertCircle, Calendar, FileText } from 'lucide-react'

interface ReceptionistPageProps {
  onBack: () => void
}

// 模拟来电数据
const mockCallHistory = [
  {
    id: '1',
    caller: '张经理',
    number: '138****1234',
    time: '10:30',
    duration: '3 分 25 秒',
    type: '业务咨询',
    status: 'completed',
    summary: '客户询问 Q2 合作方案，已发送资料'
  },
  {
    id: '2',
    caller: '李女士',
    number: '139****5678',
    time: '09:15',
    duration: '1 分 10 秒',
    type: '预约',
    status: 'voicemail',
    summary: '预约下周三下午产品演示'
  },
  {
    id: '3',
    caller: '王总',
    number: '137****9012',
    time: '昨天',
    duration: '5 分 02 秒',
    type: '合作洽谈',
    status: 'completed',
    summary: '讨论年度合作框架，待跟进'
  }
]

// 模拟来电者信息
const mockCallers = [
  { name: '张经理', number: '138****1234', avatar: '张', reason: '业务咨询' },
  { name: '李女士', number: '139****5678', avatar: '李', reason: '预约演示' },
  { name: '王总', number: '137****9012', avatar: '王', reason: '合作洽谈' },
  { name: '未知来电', number: '156****8888', avatar: '?', reason: '推销电话' },
]

// 模拟对话流程
const mockCallScripts: Record<string, { role: string; content: string }[]> = {
  '业务咨询': [
    { role: 'assistant', content: '您好，欢迎致电联通 AI 彩铃服务。请问有什么可以帮您？' },
    { role: 'user', content: '我想了解一下 AI 接线员功能' },
    { role: 'assistant', content: 'AI 接线员是我们的智能应答服务，可以帮您自动接听来电、智能对话、记录留言。您需要我详细介绍吗？' },
    { role: 'user', content: '好的，请介绍一下' },
    { role: 'assistant', content: '好的！AI 接线员有三大功能：\n1. 智能应答 - 自动识别来电意图\n2. 通话记录 - 自动生成通话摘要\n3. 留言转文字 - 重要信息不遗漏\n\n您还有什么想了解的吗？' },
  ],
  '预约演示': [
    { role: 'assistant', content: '您好，欢迎致电。请问有什么可以帮您？' },
    { role: 'user', content: '我想预约一个产品演示' },
    { role: 'assistant', content: '好的，请问您希望预约什么时间？我们提供工作日和周末的演示服务。' },
    { role: 'user', content: '下周三下午可以吗？' },
    { role: 'assistant', content: '下周三下午可以的，请问具体几点方便？我会帮您记录并安排专人联系您确认。' },
  ],
  '合作洽谈': [
    { role: 'assistant', content: '您好，欢迎致电联通公司。请问您是哪位？' },
    { role: 'user', content: '我是王总，想和你们谈合作' },
    { role: 'assistant', content: '王总您好！很高兴接到您的来电。请问是关于哪方面的合作呢？' },
    { role: 'user', content: '关于年度框架协议的' },
    { role: 'assistant', content: '好的王总，我已经记录下您的需求。会立即转告相关负责人，稍后给您回电详细沟通。' },
  ],
  '推销电话': [
    { role: 'assistant', content: '您好，请问您是哪位？' },
    { role: 'user', content: '您好，我们这边是 XX 公司...' },
    { role: 'assistant', content: '抱歉，机主暂时不方便接听。请问有什么事吗？' },
    { role: 'user', content: '我们有一个新产品...' },
    { role: 'assistant', content: '感谢介绍，我会转告机主。如果没有其他事情，我先挂断了，谢谢。' },
  ]
}

export default function ReceptionistPage({ onBack }: ReceptionistPageProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'history' | 'config'>('status')
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connecting' | 'in-call' | 'ending' | 'completed'>('idle')
  const [currentCaller, setCurrentCaller] = useState<typeof mockCallers[0] | null>(null)
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([])
  const [currentScript, setCurrentScript] = useState<{ role: string; content: string }[]>([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [callDuration, setCallDuration] = useState(0)
  const [config, setConfig] = useState({
    enabled: true,
    mode: 'busy',
    smartReply: true,
    voicemail: true
  })

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // 滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [conversation])

  // 通话计时
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (callState === 'in-call') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [callState])

  // 模拟对话逐步显示
  useEffect(() => {
    if (callState === 'in-call' && scriptIndex < currentScript.length) {
      const timer = setTimeout(() => {
        setConversation(prev => [...prev, currentScript[scriptIndex]])
        setScriptIndex(prev => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (callState === 'in-call' && scriptIndex >= currentScript.length) {
      // 对话完成，准备结束通话
      const timer = setTimeout(() => {
        handleEndCall()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [callState, scriptIndex, currentScript])

  // 开始来电
  const startIncomingCall = () => {
    const randomCaller = mockCallers[Math.floor(Math.random() * mockCallers.length)]
    setCurrentCaller(randomCaller)
    setCallState('ringing')
    setCallDuration(0)
    setConversation([])
    setScriptIndex(0)

    // 随机选择对话脚本
    const script = mockCallScripts[randomCaller.reason] || mockCallScripts['推销电话']
    setCurrentScript(script)
  }

  // 接听电话
  const answerCall = () => {
    setCallState('connecting')
    setTimeout(() => {
      setCallState('in-call')
    }, 1500)
  }

  // 挂断电话
  const handleEndCall = () => {
    setCallState('ending')
    setTimeout(() => {
      setCallState('completed')
    }, 1000)
  }

  // 返回正常状态
  const resetCallState = () => {
    setCallState('idle')
    setCurrentCaller(null)
    setConversation([])
    setScriptIndex(0)
    setCallDuration(0)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 来电动画界面
  if (callState === 'ringing' && currentCaller) {
    return (
      <div className="call-screen ringing">
        <div className="ringing-animation">
          <div className="ring-wave ring-wave-1" />
          <div className="ring-wave ring-wave-2" />
          <div className="ring-wave ring-wave-3" />
        </div>
        <div className="caller-info">
          <div className="caller-avatar ringing-avatar">
            {currentCaller.avatar}
          </div>
          <h2 className="caller-name">{currentCaller.name}</h2>
          <p className="caller-number">{currentCaller.number}</p>
          <div className="call-type-badge">
            <Phone size={14} />
            <span>{currentCaller.reason}</span>
          </div>
        </div>
        <div className="call-actions">
          <button className="call-btn decline" onClick={resetCallState}>
            <PhoneOff size={32} />
            <span>挂断</span>
          </button>
          <button className="call-btn answer" onClick={answerCall}>
            <Phone size={32} />
            <span>AI 接听</span>
          </button>
        </div>
        <style>{`
          .call-screen {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: white;
          }
          .call-screen.ringing {
            animation: screenPulse 1.5s ease-in-out infinite;
          }
          @keyframes screenPulse {
            0%, 100% { background: linear-gradient(135deg, #1a1a2e, #16213e); }
            50% { background: linear-gradient(135deg, #2a2a4e, #26315e); }
          }
          .ringing-animation {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }
          .ring-wave {
            position: absolute;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 3px solid rgba(230, 0, 18, 0.5);
            animation: ringExpand 2s ease-out infinite;
          }
          .ring-wave-1 { animation-delay: 0s; }
          .ring-wave-2 { animation-delay: 0.4s; }
          .ring-wave-3 { animation-delay: 0.8s; }
          @keyframes ringExpand {
            0% { width: 200px; height: 200px; opacity: 1; }
            100% { width: 600px; height: 600px; opacity: 0; }
          }
          .caller-info {
            text-align: center;
            z-index: 10;
          }
          .caller-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #e60012, #ff6b6b);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: 600;
            margin: 0 auto 24px;
            box-shadow: 0 8px 32px rgba(230, 0, 18, 0.4);
          }
          .ringing-avatar {
            animation: avatarShake 0.5s ease-in-out infinite;
          }
          @keyframes avatarShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .caller-name {
            font-size: 32px;
            margin-bottom: 8px;
          }
          .caller-number {
            font-size: 16px;
            opacity: 0.7;
            margin-bottom: 16px;
          }
          .call-type-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.1);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
          }
          .call-actions {
            display: flex;
            gap: 48px;
            margin-top: 64px;
            z-index: 10;
          }
          .call-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 20px 32px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            background: rgba(255,255,255,0.1);
            color: white;
          }
          .call-btn.decline {
            background: #ff4d4f;
          }
          .call-btn.answer {
            background: #52c41a;
            animation: answerPulse 1.5s ease-in-out infinite;
          }
          @keyframes answerPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 4px 16px rgba(82, 196, 26, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 8px 24px rgba(82, 196, 26, 0.6); }
          }
          .call-btn span {
            font-size: 14px;
          }
        `}</style>
      </div>
    )
  }

  // 通话中界面
  if ((callState === 'connecting' || callState === 'in-call' || callState === 'ending') && currentCaller) {
    return (
      <div className="call-screen in-call">
        <div className="call-header">
          <div className="caller-mini">
            <div className="caller-mini-avatar">{currentCaller.avatar}</div>
            <div className="caller-mini-info">
              <span className="caller-mini-name">{currentCaller.name}</span>
              <span className="caller-mini-number">{currentCaller.number}</span>
            </div>
          </div>
          <div className="call-status">
            {callState === 'connecting' ? (
              <span className="connecting-indicator">
                <span className="dot" />
                AI 正在接听...
              </span>
            ) : callState === 'in-call' ? (
              <span className="in-call-indicator">
                <span className="pulse-dot" />
                通话中 {formatDuration(callDuration)}
              </span>
            ) : (
              <span className="ending-indicator">
                正在结束通话...
              </span>
            )}
          </div>
        </div>

        <div className="call-chat-container" ref={chatContainerRef}>
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.role} ${callState === 'ending' ? 'fade-out' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bubble-avatar">
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className={`bubble-content ${msg.role}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {callState === 'connecting' && (
            <div className="chat-bubble assistant">
              <div className="bubble-avatar">🤖</div>
              <div className="bubble-content assistant typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        <div className="call-actions-bottom">
          <button className="call-action-btn" disabled={callState === 'ending'}>
            <Mic size={20} />
            <span>静音</span>
          </button>
          <button className="call-action-btn" disabled={callState === 'ending'}>
            <Volume2 size={20} />
            <span>扬声器</span>
          </button>
          <button className="call-action-btn danger" onClick={handleEndCall}>
            <PhoneOff size={20} />
            <span>挂断</span>
          </button>
          <button className="call-action-btn" disabled={callState === 'ending'}>
            <MessageSquare size={20} />
            <span>留言</span>
          </button>
        </div>

        <style>{`
          .call-screen.in-call {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, #0f0f1a, #1a1a2e);
            color: white;
          }
          .call-header {
            padding: 16px;
            background: rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .caller-mini {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .caller-mini-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #e60012, #ff6b6b);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 600;
          }
          .caller-mini-info {
            display: flex;
            flex-direction: column;
          }
          .caller-mini-name {
            font-size: 16px;
            font-weight: 600;
          }
          .caller-mini-number {
            font-size: 12px;
            opacity: 0.6;
          }
          .call-status {
            text-align: center;
            font-size: 14px;
          }
          .connecting-indicator, .in-call-indicator, .ending-indicator {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
          }
          .in-call-indicator {
            background: rgba(82, 196, 26, 0.2);
            color: #52c41a;
          }
          .dot, .pulse-dot {
            width: 8px;
            height: 8px;
            background: #e60012;
            border-radius: 50%;
            animation: dotPulse 1.5s ease-in-out infinite;
          }
          .pulse-dot {
            background: #52c41a;
          }
          @keyframes dotPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .call-chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .chat-bubble {
            display: flex;
            align-items: flex-end;
            gap: 8px;
            animation: bubbleIn 0.3s ease-out;
          }
          .chat-bubble.user {
            flex-direction: row-reverse;
          }
          .bubble-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
          }
          .bubble-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-wrap;
          }
          .bubble-content.assistant {
            background: rgba(255,255,255,0.1);
            border-bottom-left-radius: 4px;
          }
          .bubble-content.user {
            background: #e60012;
            border-bottom-right-radius: 4px;
          }
          .bubble-content.typing {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 16px 20px;
          }
          .typing-dot {
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
            animation: typingBounce 1.4s ease-in-out infinite;
          }
          .typing-dot:nth-child(2) { animation-delay: 0.2s; }
          .typing-dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-8px); }
          }
          @keyframes bubbleIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-out {
            opacity: 0.5;
          }
          .call-actions-bottom {
            display: flex;
            justify-content: space-around;
            padding: 20px 16px;
            background: rgba(255,255,255,0.05);
            border-top: 1px solid rgba(255,255,255,0.1);
          }
          .call-action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 12px 20px;
            background: rgba(255,255,255,0.1);
            border: none;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
          }
          .call-action-btn.danger {
            background: #ff4d4f;
          }
          .call-action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .call-action-btn span {
            font-size: 12px;
          }
        `}</style>
      </div>
    )
  }

  // 通话完成总结界面
  if (callState === 'completed' && currentCaller) {
    return (
      <div className="call-summary-screen">
        <div className="summary-card">
          <div className="summary-icon success">
            <CheckCircle size={48} />
          </div>
          <h2>通话已结束</h2>
          <p className="summary-subtitle">AI 已成功处理来电</p>

          <div className="summary-details">
            <div className="summary-item">
              <div className="summary-label">
                <User size={16} />
                来电者
              </div>
              <div className="summary-value">{currentCaller.name}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">
                <Clock size={16} />
                通话时长
              </div>
              <div className="summary-value">{formatDuration(callDuration)}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">
                <FileText size={16} />
                来电类型
              </div>
              <div className="summary-value">{currentCaller.reason}</div>
            </div>
          </div>

          <div className="summary-actions">
            <button className="summary-btn primary" onClick={resetCallState}>
              <CheckCircle size={20} />
              确认保存
            </button>
            <button className="summary-btn secondary" onClick={resetCallState}>
              <MessageSquare size={20} />
              查看详情
            </button>
          </div>
        </div>

        <style>{`
          .call-summary-screen {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.8);
            padding: 24px;
            animation: fadeIn 0.3s ease-out;
          }
          .summary-card {
            background: white;
            border-radius: 24px;
            padding: 32px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            animation: slideUp 0.4s ease-out;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .summary-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }
          .summary-icon.success {
            background: #f6ffed;
            color: #52c41a;
          }
          .summary-card h2 {
            font-size: 24px;
            margin-bottom: 8px;
            color: #333;
          }
          .summary-subtitle {
            color: #666;
            margin-bottom: 24px;
          }
          .summary-details {
            background: #f5f5f5;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }
          .summary-item:last-child {
            border-bottom: none;
          }
          .summary-label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
            font-size: 14px;
          }
          .summary-value {
            font-weight: 600;
            color: #333;
          }
          .summary-actions {
            display: flex;
            gap: 12px;
          }
          .summary-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px;
            border-radius: 12px;
            border: none;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          .summary-btn.primary {
            background: #e60012;
            color: white;
          }
          .summary-btn.secondary {
            background: #f0f0f0;
            color: #333;
          }
        `}</style>
      </div>
    )
  }

  // 正常页面
  const renderStatus = () => (
    <div className="fade-in">
      {/* 当前状态 */}
      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <div style={{
          width: 120,
          height: 120,
          margin: '0 auto 16px',
          background: config.enabled ? 'linear-gradient(135deg, #52c41a, #389e0d)' : '#ccc',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: config.enabled ? '0 4px 20px rgba(82, 196, 26, 0.4)' : 'none',
          transition: 'all 0.3s'
        }}>
          <Phone size={48} color="white" />
        </div>
        <h3 style={{ fontSize: 20, marginBottom: 8 }}>
          {config.enabled ? 'AI 接线员已开启' : 'AI 接线员已关闭'}
        </h3>
        <p style={{ color: '#666', marginBottom: 16 }}>
          {config.enabled ? '来电时将自动应答并智能对话' : '来电时将正常振铃'}
        </p>
        <div
          className="toggle"
          style={{ justifyContent: 'center' }}
          onClick={() => setConfig({ ...config, enabled: !config.enabled })}
        >
          <span className="toggle-switch" style={{
            background: config.enabled ? '#e60012' : '#ccc'
          }} />
        </div>
      </div>

      {/* 今日统计 */}
      <div className="card">
        <div className="card-title">
          <Clock size={20} style={{ color: '#e60012' }} />
          今日统计
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: 32, fontWeight: 600, color: '#e60012' }}>12</p>
            <p style={{ fontSize: 13, color: '#666' }}>来电总数</p>
          </div>
          <div>
            <p style={{ fontSize: 32, fontWeight: 600, color: '#52c41a' }}>8</p>
            <p style={{ fontSize: 13, color: '#666' }}>智能应答</p>
          </div>
          <div>
            <p style={{ fontSize: 32, fontWeight: 600, color: '#faad14' }}>4</p>
            <p style={{ fontSize: 13, color: '#666' }}>留言</p>
          </div>
        </div>
      </div>

      {/* 快捷设置 */}
      <div className="card">
        <div className="card-title">
          <Settings size={20} style={{ color: '#e60012' }} />
          快捷设置
        </div>
        <div className="toggle">
          <div className="toggle-label">
            <p style={{ fontWeight: 500 }}>智能应答</p>
            <p style={{ fontSize: 12, color: '#666' }}>自动识别来电意图并应答</p>
          </div>
          <span
            className="toggle-switch active"
            style={{ background: config.smartReply ? '#e60012' : '#ccc' }}
            onClick={() => setConfig({ ...config, smartReply: !config.smartReply })}
          />
        </div>
        <div className="toggle">
          <div className="toggle-label">
            <p style={{ fontWeight: 500 }}>留言功能</p>
            <p style={{ fontSize: 12, color: '#666' }}>允许来电者留言</p>
          </div>
          <span
            className="toggle-switch active"
            style={{ background: config.voicemail ? '#e60012' : '#ccc' }}
            onClick={() => setConfig({ ...config, voicemail: !config.voicemail })}
          />
        </div>
      </div>

      {/* 模拟来电按钮 */}
      <div style={{ padding: '0 12px 12px' }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={startIncomingCall}
        >
          <Phone size={20} />
          模拟来电演示
        </button>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="fade-in">
      {mockCallHistory.map((call) => (
        <div key={call.id} className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                background: '#f0f0f0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={24} color="#666" />
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>{call.caller}</p>
                <p style={{ fontSize: 12, color: '#666' }}>{call.number}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${call.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                {call.status === 'completed' ? '已接听' : '留言'}
              </span>
              <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{call.time}</p>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '12px', background: '#f9f9f9', borderRadius: 8 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#e60012', fontWeight: 500 }}>{call.type}</span>
              <span style={{ fontSize: 12, color: '#666' }}>通话 {call.duration}</span>
            </div>
            <p style={{ fontSize: 14, color: '#333' }}>{call.summary}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-sm btn-outline" style={{ flex: 1 }}>
              <MessageSquare size={16} />
              查看详情
            </button>
            <button className="btn btn-sm btn-primary" style={{ flex: 1 }}>
              <Phone size={16} />
              回拨
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  const renderConfig = () => (
    <div className="fade-in">
      <div className="card">
        <div className="card-title">工作模式</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { value: 'always', label: '全天开启', desc: '所有来电都由 AI 接听' },
            { value: 'busy', label: '忙碌时开启', desc: '不方便接听时由 AI 代接' },
            { value: 'schedule', label: '定时开启', desc: '在指定时间段由 AI 接听' },
          ].map((mode) => (
            <div
              key={mode.value}
              onClick={() => setConfig({ ...config, mode: mode.value })}
              style={{
                padding: 16,
                border: `2px solid ${config.mode === mode.value ? '#e60012' : '#eee'}`,
                borderRadius: 12,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  border: `2px solid ${config.mode === mode.value ? '#e60012' : '#ccc'}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {config.mode === mode.value && (
                    <div style={{ width: 10, height: 10, background: '#e60012', borderRadius: '50%' }} />
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: 500 }}>{mode.label}</p>
                  <p style={{ fontSize: 12, color: '#666' }}>{mode.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">问候语设置</div>
        <textarea
          style={{
            width: '100%',
            height: 100,
            padding: 12,
            border: '1px solid #eee',
            borderRadius: 8,
            fontSize: 14,
            resize: 'none'
          }}
          defaultValue="您好，我现在不方便接听电话，请问有什么可以帮您的？"
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn-sm btn-outline" style={{ flex: 1 }}>试听</button>
          <button className="btn btn-sm btn-primary" style={{ flex: 1 }}>保存</button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* 头部 */}
      <div style={{
        background: 'white',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid #eee'
      }}>
        <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={onBack} />
        <h2 style={{ flex: 1, fontSize: 18 }}>AI 接线员</h2>
      </div>

      {/* 标签切换 */}
      <div style={{
        display: 'flex',
        background: 'white',
        borderBottom: '1px solid #eee'
      }}>
        {[
          { key: 'status', label: '状态' },
          { key: 'history', label: '通话记录' },
          { key: 'config', label: '设置' },
        ].map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              flex: 1,
              padding: '12px 0',
              textAlign: 'center',
              borderBottom: activeTab === tab.key ? '2px solid #e60012' : 'none',
              color: activeTab === tab.key ? '#e60012' : '#666',
              fontWeight: activeTab === tab.key ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* 内容 */}
      {activeTab === 'status' && renderStatus()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'config' && renderConfig()}
    </div>
  )
}
