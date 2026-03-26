import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, FileText, CheckCircle, Clock, MapPin, DollarSign, Calendar, Share2, Download, Phone, Mic, Loader2 } from 'lucide-react'

interface ShorthandPageProps {
  onBack: () => void
}

// 模拟实时转写效果
const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    setDisplayText('')
    setIsComplete(false)

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayText, isComplete }
}

// 实时转写组件
function RealtimeTranscription({ onComplete }: { onComplete: () => void }) {
  const fullTranscript = `张经理：小王，Q2的销售目标我们定在500万，你觉得怎么样？

我：好的张经理，这个目标我觉得可以完成，需要市场部多配合。

张经理：没问题，下周三下午2点我们开个会，你准备一下销售数据分析。

我：好的，我还需要做一个竞品调研报告。

张经理：对，这个很重要。那就这样，下周三见。

我：好的，下周三见。`

  const { displayText, isComplete } = useTypewriter(fullTranscript, 30)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isComplete) {
      setTimeout(onComplete, 1000)
    }
  }, [isComplete, onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 通话状态栏 */}
      <div style={{ 
        background: '#1a1a2e',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            background: '#2a2a4e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Phone size={24} color="#e60012" />
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 600 }}>张经理</p>
            <p style={{ color: '#888', fontSize: 12 }}>138****1234</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            color: '#52c41a'
          }}>
            <span style={{ 
              width: 8, 
              height: 8, 
              background: '#52c41a',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            通话中
          </div>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 600, marginTop: 4 }}>
            {formatTime(elapsedTime)}
          </p>
        </div>
      </div>

      {/* AI速记标识 */}
      <div style={{ 
        background: 'linear-gradient(90deg, #e60012, #ff6b6b)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'white',
        fontSize: 14
      }}>
        <Mic size={16} />
        AI速记实时转写中...
        <Loader2 size={14} className="pulse" />
      </div>

      {/* 转写内容 */}
      <div style={{ 
        flex: 1, 
        padding: 16, 
        overflowY: 'auto',
        background: '#0f0f0f'
      }}>
        <div style={{ 
          background: '#1a1a2e',
          borderRadius: 12,
          padding: 16,
          color: 'white',
          fontSize: 15,
          lineHeight: 2,
          whiteSpace: 'pre-wrap'
        }}>
          {displayText}
          {!isComplete && (
            <span style={{ 
              borderRight: '2px solid #e60012',
              marginLeft: 2,
              animation: 'blink 1s infinite'
            }}>​</span>
          )}
        </div>

        {/* 关键信息实时提取 */}
        {displayText.includes('500万') && (
          <div style={{ 
            marginTop: 16,
            background: '#1a1a2e',
            borderRadius: 12,
            padding: 12
          }}>
            <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>🔍 AI识别关键信息</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ 
                background: '#2a2a4e',
                padding: '6px 12px',
                borderRadius: 16,
                color: '#e60012',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <DollarSign size={14} />
                500万
              </span>
              {displayText.includes('下周三') && (
                <span style={{ 
                  background: '#2a2a4e',
                  padding: '6px 12px',
                  borderRadius: 16,
                  color: '#52c41a',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Calendar size={14} />
                  下周三 14:00
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div style={{ 
        padding: 16, 
        background: '#1a1a2e',
        display: 'flex',
        gap: 12
      }}>
        <button style={{
          flex: 1,
          padding: 12,
          background: '#2a2a4e',
          border: 'none',
          borderRadius: 8,
          color: 'white',
          fontSize: 14,
          cursor: 'pointer'
        }}>
          暂停转写
        </button>
        <button style={{
          flex: 1,
          padding: 12,
          background: '#ff4d4f',
          border: 'none',
          borderRadius: 8,
          color: 'white',
          fontSize: 14,
          cursor: 'pointer'
        }}>
          结束通话
        </button>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// 摘要生成组件
function SummaryGeneration({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)

  const steps = [
    '分析通话内容...',
    '提取关键信息...',
    '生成智能摘要...',
    '识别待办事项...',
    '完成！'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const stepIndex = Math.floor(progress / 25)
    setStep(Math.min(stepIndex, steps.length - 1))
  }, [progress])

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(onDone, 500)
    }
  }, [progress, onDone])

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      <div style={{ 
        width: 120, 
        height: 120, 
        background: 'linear-gradient(135deg, #e60012, #ff6b6b)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        boxShadow: '0 8px 32px rgba(230, 0, 18, 0.4)'
      }}>
        <FileText size={48} color="white" />
      </div>

      <h2 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>AI正在分析通话</h2>
      <p style={{ color: '#888', marginBottom: 32 }}>{steps[step]}</p>

      <div style={{ 
        width: '100%', 
        maxWidth: 300,
        background: '#1a1a2e',
        borderRadius: 12,
        padding: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#888', fontSize: 14 }}>处理进度</span>
          <span style={{ color: '#e60012', fontSize: 14, fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ height: 8, background: '#333', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #e60012, #ff4d4d)',
            transition: 'width 0.1s'
          }} />
        </div>
      </div>
    </div>
  )
}

// 通话记录详情
const mockRecord = {
  id: '1',
  caller: '张经理',
  number: '138****1234',
  date: '2026-03-26',
  time: '10:30',
  duration: '12分35秒',
  summary: '讨论了Q2销售目标和市场推广计划，约定下周三开会汇报。需要准备销售数据分析和竞品调研报告。',
  todos: [
    { id: 1, content: '准备Q2销售数据分析', deadline: '2026-03-30', priority: 'high', completed: false },
    { id: 2, content: '完成竞品调研报告', deadline: '2026-03-31', priority: 'medium', completed: false },
    { id: 3, content: '下周三14:00会议室A开会汇报', deadline: '2026-04-01', priority: 'high', completed: false }
  ],
  keyInfo: {
    dates: ['下周三（04-01）14:00'],
    locations: ['会议室A'],
    amounts: ['Q2目标 500万'],
    contacts: ['张经理']
  },
  transcript: `张经理：小王，Q2的销售目标我们定在500万，你觉得怎么样？

我：好的张经理，这个目标我觉得可以完成，需要市场部多配合。

张经理：没问题，下周三下午2点我们开个会，你准备一下销售数据分析。

我：好的，我还需要做一个竞品调研报告。

张经理：对，这个很重要。那就这样，下周三见。

我：好的，下周三见。`
}

export default function ShorthandPage({ onBack }: ShorthandPageProps) {
  const [mode, setMode] = useState<'list' | 'transcribing' | 'generating' | 'detail'>('list')
  const [selectedRecord, setSelectedRecord] = useState<typeof mockRecord | null>(null)

  const startDemo = () => {
    setMode('transcribing')
  }

  const handleTranscribeComplete = () => {
    setMode('generating')
  }

  const handleGenerateComplete = () => {
    setSelectedRecord(mockRecord)
    setMode('detail')
  }

  // 实时转写模式
  if (mode === 'transcribing') {
    return <RealtimeTranscription onComplete={handleTranscribeComplete} />
  }

  // 摘要生成模式
  if (mode === 'generating') {
    return <SummaryGeneration onDone={handleGenerateComplete} />
  }

  // 详情模式
  if (mode === 'detail' && selectedRecord) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>
        {/* 头部 */}
        <div style={{ 
          background: 'white', 
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid #eee'
        }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => setMode('list')} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16 }}>通话详情</h2>
            <p style={{ fontSize: 12, color: '#666' }}>{selectedRecord.date} {selectedRecord.time}</p>
          </div>
          <Share2 size={20} style={{ cursor: 'pointer', color: '#666' }} />
          <Download size={20} style={{ cursor: 'pointer', color: '#666' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {/* 基本信息 */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 56, 
                  height: 56, 
                  background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 600
                }}>
                  张
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 600 }}>{selectedRecord.caller}</p>
                  <p style={{ fontSize: 14, color: '#666' }}>{selectedRecord.number}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 14, color: '#666' }}>通话时长</p>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#e60012' }}>{selectedRecord.duration}</p>
              </div>
            </div>
          </div>

          {/* AI摘要 */}
          <div className="card">
            <div className="card-title">
              <FileText size={20} style={{ color: '#e60012' }} />
              AI智能摘要
              <span className="badge badge-success" style={{ marginLeft: 'auto' }}>AI生成</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333' }}>{selectedRecord.summary}</p>
          </div>

          {/* 待办事项 */}
          <div className="card">
            <div className="card-title">
              <CheckCircle size={20} style={{ color: '#52c41a' }} />
              待办事项
              <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>
                {selectedRecord.todos.length}项待办
              </span>
            </div>
            {selectedRecord.todos.map((todo) => (
              <div 
                key={todo.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 12,
                  padding: '16px 0',
                  borderBottom: todo.id < selectedRecord.todos.length ? '1px solid #f0f0f0' : 'none'
                }}
              >
                <div style={{ 
                  width: 24, 
                  height: 24, 
                  border: `2px solid ${todo.priority === 'high' ? '#e60012' : '#faad14'}`,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, lineHeight: 1.5 }}>{todo.content}</p>
                  {todo.deadline && (
                    <p style={{ fontSize: 13, color: '#e60012', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} />
                      截止：{todo.deadline}
                    </p>
                  )}
                </div>
                <span 
                  className={`badge ${todo.priority === 'high' ? 'badge-error' : 'badge-warning'}`}
                >
                  {todo.priority === 'high' ? '高优' : '中等'}
                </span>
              </div>
            ))}
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>
              添加到日历
            </button>
          </div>

          {/* 关键信息 */}
          <div className="card">
            <div className="card-title">
              <Clock size={20} style={{ color: '#e60012' }} />
              关键信息提取
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedRecord.keyInfo.dates.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  background: '#f9f9f9',
                  padding: 12,
                  borderRadius: 8
                }}>
                  <Calendar size={18} color="#e60012" />
                  <span style={{ fontSize: 14 }}>
                    <span style={{ color: '#666' }}>日期：</span>
                    <span style={{ fontWeight: 500 }}>{selectedRecord.keyInfo.dates.join('、')}</span>
                  </span>
                </div>
              )}
              {selectedRecord.keyInfo.locations.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  background: '#f9f9f9',
                  padding: 12,
                  borderRadius: 8
                }}>
                  <MapPin size={18} color="#52c41a" />
                  <span style={{ fontSize: 14 }}>
                    <span style={{ color: '#666' }}>地点：</span>
                    <span style={{ fontWeight: 500 }}>{selectedRecord.keyInfo.locations.join('、')}</span>
                  </span>
                </div>
              )}
              {selectedRecord.keyInfo.amounts.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  background: '#f9f9f9',
                  padding: 12,
                  borderRadius: 8
                }}>
                  <DollarSign size={18} color="#faad14" />
                  <span style={{ fontSize: 14 }}>
                    <span style={{ color: '#666' }}>金额：</span>
                    <span style={{ fontWeight: 500 }}>{selectedRecord.keyInfo.amounts.join('、')}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 完整转写 */}
          <div className="card">
            <div className="card-title">
              <FileText size={20} style={{ color: '#e60012' }} />
              完整转写
              <button style={{ 
                marginLeft: 'auto',
                padding: '4px 12px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: 16,
                fontSize: 12,
                cursor: 'pointer'
              }}>
                播放录音
              </button>
            </div>
            <div style={{ 
              background: '#f9f9f9', 
              padding: 16, 
              borderRadius: 8,
              fontSize: 14,
              lineHeight: 2,
              whiteSpace: 'pre-wrap'
            }}>
              {selectedRecord.transcript}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 列表模式
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
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
        <h2 style={{ flex: 1, fontSize: 18 }}>AI速记</h2>
        <span className="badge badge-success">实时转写</span>
      </div>

      {/* 功能说明 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        margin: 12,
        borderRadius: 12,
        padding: 16,
        color: 'white'
      }}>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>✨ AI速记 - 会记录的智能彩铃</h3>
        <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>
          通话中实时转写，通话后自动生成摘要和待办事项。联通独有功能，让每通电话都有价值。
        </p>
      </div>

      {/* 演示入口 */}
      <div className="card" style={{ cursor: 'pointer' }} onClick={startDemo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            background: 'linear-gradient(135deg, #e60012, #ff6b6b)', 
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(230, 0, 18, 0.3)'
          }}>
            <Play size={28} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>🎬 观看演示</h3>
            <p style={{ fontSize: 14, color: '#666' }}>体验完整的AI速记流程</p>
          </div>
        </div>
      </div>

      {/* 最近通话 */}
      <div className="card">
        <div className="card-title">
          <Clock size={20} style={{ color: '#e60012' }} />
          最近通话记录
        </div>
        
        {[mockRecord].map((record) => (
          <div 
            key={record.id}
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 12,
              padding: '16px 0',
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer'
            }}
            onClick={() => { setSelectedRecord(record); setMode('detail'); }}
          >
            <div style={{ 
              width: 48, 
              height: 48, 
              background: '#f0f0f0', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Phone size={20} color="#666" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontWeight: 500, fontSize: 15 }}>{record.caller}</p>
                <span className="badge badge-success">{record.duration}</span>
              </div>
              <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{record.date} {record.time}</p>
              <p style={{ fontSize: 13, color: '#666', marginTop: 8, lineHeight: 1.5 }}>
                {record.summary.substring(0, 40)}...
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span className="badge badge-warning">{record.todos.length}个待办</span>
                {record.keyInfo.amounts.map((amount, i) => (
                  <span key={i} className="badge" style={{ background: '#f0f0f0' }}>{amount}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}