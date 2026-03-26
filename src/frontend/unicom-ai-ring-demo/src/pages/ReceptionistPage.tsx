import { useState } from 'react'
import { ArrowLeft, Phone, PhoneOff, Mic, Volume2, Settings, Clock, User, MessageSquare } from 'lucide-react'

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
    duration: '3分25秒',
    type: '业务咨询',
    status: 'completed',
    summary: '客户询问Q2合作方案，已发送资料'
  },
  {
    id: '2',
    caller: '李女士',
    number: '139****5678',
    time: '09:15',
    duration: '1分10秒',
    type: '预约',
    status: 'voicemail',
    summary: '预约下周三下午产品演示'
  },
  {
    id: '3',
    caller: '王总',
    number: '137****9012',
    time: '昨天',
    duration: '5分02秒',
    type: '合作洽谈',
    status: 'completed',
    summary: '讨论年度合作框架，待跟进'
  }
]

// 模拟对话数据
const mockConversation = [
  { role: 'assistant', content: '您好，欢迎致电联通AI彩铃服务。请问有什么可以帮您？' },
  { role: 'user', content: '我想了解一下AI接线员功能' },
  { role: 'assistant', content: 'AI接线员是我们的智能应答服务，可以帮您自动接听来电、智能对话、记录留言。您需要我详细介绍吗？' },
]

export default function ReceptionistPage({ onBack }: ReceptionistPageProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'history' | 'config'>('status')
  const [isCallActive, setIsCallActive] = useState(false)
  const [config, setConfig] = useState({
    enabled: true,
    mode: 'busy',
    smartReply: true,
    voicemail: true
  })

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
          boxShadow: config.enabled ? '0 4px 20px rgba(82, 196, 26, 0.4)' : 'none'
        }}>
          <Phone size={48} color="white" />
        </div>
        <h3 style={{ fontSize: 20, marginBottom: 8 }}>
          {config.enabled ? 'AI接线员已开启' : 'AI接线员已关闭'}
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
            className="toggle-switch" 
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
            className="toggle-switch" 
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
          onClick={() => setIsCallActive(true)}
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
            { value: 'always', label: '全天开启', desc: '所有来电都由AI接听' },
            { value: 'busy', label: '忙碌时开启', desc: '不方便接听时由AI代接' },
            { value: 'schedule', label: '定时开启', desc: '在指定时间段由AI接听' },
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

  // 模拟来电界面
  if (isCallActive) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e60012, #b30000)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ 
            width: 100, 
            height: 100, 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            animation: 'pulse 2s infinite'
          }}>
            <User size={48} />
          </div>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>138****1234</h2>
          <p style={{ opacity: 0.8 }}>AI接线员正在应答...</p>
        </div>

        <div style={{ 
          width: '100%', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: 16,
          padding: 16,
          marginBottom: 32
        }}>
          <div className="chat-container">
            {mockConversation.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`} style={{
                background: msg.role === 'assistant' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                color: msg.role === 'assistant' ? '#333' : 'white'
              }}>
                {msg.content}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
          <button 
            onClick={() => setIsCallActive(false)}
            style={{ 
              width: 64,
              height: 64,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <Mic size={28} />
          </button>
          <button 
            onClick={() => setIsCallActive(false)}
            style={{ 
              width: 64,
              height: 64,
              background: '#ff4d4f',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <PhoneOff size={28} />
          </button>
          <button 
            style={{ 
              width: 64,
              height: 64,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <Volume2 size={28} />
          </button>
        </div>
      </div>
    )
  }

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
        <h2 style={{ flex: 1, fontSize: 18 }}>AI接线员</h2>
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