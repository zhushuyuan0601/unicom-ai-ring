import { useState } from 'react'
import { ArrowLeft, Play, Pause, FileText, CheckCircle, Clock, MapPin, DollarSign, Calendar, Share2, Download } from 'lucide-react'

interface ShorthandPageProps {
  onBack: () => void
}

// 模拟通话记录
const mockRecords = [
  {
    id: '1',
    caller: '张经理',
    number: '138****1234',
    date: '2026-03-26',
    time: '10:30',
    duration: '12分35秒',
    summary: '讨论了Q2销售目标和市场推广计划，约定下周三开会汇报。需要准备销售数据分析和竞品调研报告。',
    todos: [
      { id: 1, content: '准备Q2销售数据分析', deadline: '2026-03-30', priority: 'high' },
      { id: 2, content: '完成竞品调研报告', deadline: null, priority: 'medium' },
      { id: 3, content: '下周三14:00开会汇报', deadline: '2026-04-01', priority: 'high' }
    ],
    keyInfo: {
      dates: ['下周三（04-01）14:00'],
      locations: ['会议室A'],
      amounts: ['Q2目标 500万']
    },
    transcript: `张经理：小王，Q2的销售目标我们定在500万，你觉得怎么样？
我：好的张经理，这个目标我觉得可以完成，需要市场部多配合。
张经理：没问题，下周三下午2点我们开个会，你准备一下销售数据分析。
我：好的，我还需要做一个竞品调研。
张经理：对，这个很重要。那就这样，下周三见。`
  },
  {
    id: '2',
    caller: '李女士',
    number: '139****5678',
    date: '2026-03-26',
    time: '09:15',
    duration: '5分20秒',
    summary: '客户咨询产品演示安排，已预约下周四上午10点。',
    todos: [
      { id: 1, content: '准备产品演示PPT', deadline: '2026-04-02', priority: 'medium' }
    ],
    keyInfo: {
      dates: ['下周四（04-02）10:00'],
      locations: ['客户办公室'],
      amounts: []
    },
    transcript: '李女士：你好，我们想看一下你们的产品演示...'
  }
]

export default function ShorthandPage({ onBack }: ShorthandPageProps) {
  const [selectedRecord, setSelectedRecord] = useState<typeof mockRecords[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'records' | 'todos'>('records')

  if (selectedRecord) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* 头部 */}
        <div style={{ 
          background: 'white', 
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid #eee'
        }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => setSelectedRecord(null)} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16 }}>通话详情</h2>
            <p style={{ fontSize: 12, color: '#666' }}>{selectedRecord.date} {selectedRecord.time}</p>
          </div>
          <Share2 size={20} style={{ cursor: 'pointer', color: '#666' }} />
          <Download size={20} style={{ cursor: 'pointer', color: '#666' }} />
        </div>

        {/* 内容 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {/* 基本信息 */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 20, fontWeight: 600 }}>{selectedRecord.caller}</p>
                <p style={{ fontSize: 14, color: '#666' }}>{selectedRecord.number}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 14, color: '#666' }}>通话时长</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: '#e60012' }}>{selectedRecord.duration}</p>
              </div>
            </div>
          </div>

          {/* 摘要 */}
          <div className="card">
            <div className="card-title">
              <FileText size={20} style={{ color: '#e60012' }} />
              AI摘要
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8 }}>{selectedRecord.summary}</p>
          </div>

          {/* 待办事项 */}
          <div className="card">
            <div className="card-title">
              <CheckCircle size={20} style={{ color: '#52c41a' }} />
              待办事项
              <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>
                {selectedRecord.todos.length}项
              </span>
            </div>
            {selectedRecord.todos.map((todo) => (
              <div 
                key={todo.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <div style={{ 
                  width: 20, 
                  height: 20, 
                  border: '2px solid #e60012',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14 }}>{todo.content}</p>
                  {todo.deadline && (
                    <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      截止：{todo.deadline}
                    </p>
                  )}
                </div>
                <span 
                  className={`badge ${todo.priority === 'high' ? 'badge-error' : 'badge-warning'}`}
                >
                  {todo.priority === 'high' ? '高' : '中'}
                </span>
              </div>
            ))}
          </div>

          {/* 关键信息 */}
          <div className="card">
            <div className="card-title">
              <Clock size={20} style={{ color: '#e60012' }} />
              关键信息
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedRecord.keyInfo.dates.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={16} color="#e60012" />
                  <span style={{ fontSize: 14 }}>日期：{selectedRecord.keyInfo.dates.join('、')}</span>
                </div>
              )}
              {selectedRecord.keyInfo.locations.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} color="#e60012" />
                  <span style={{ fontSize: 14 }}>地点：{selectedRecord.keyInfo.locations.join('、')}</span>
                </div>
              )}
              {selectedRecord.keyInfo.amounts.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarSign size={16} color="#e60012" />
                  <span style={{ fontSize: 14 }}>金额：{selectedRecord.keyInfo.amounts.join('、')}</span>
                </div>
              )}
            </div>
          </div>

          {/* 完整转写 */}
          <div className="card">
            <div className="card-title">
              <FileText size={20} style={{ color: '#e60012' }} />
              完整转写
            </div>
            <div style={{ 
              background: '#f9f9f9', 
              padding: 12, 
              borderRadius: 8,
              fontSize: 14,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap'
            }}>
              {selectedRecord.transcript}
            </div>
          </div>
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
        <h2 style={{ flex: 1, fontSize: 18 }}>AI速记</h2>
      </div>

      {/* 标签切换 */}
      <div style={{ 
        display: 'flex', 
        background: 'white',
        borderBottom: '1px solid #eee'
      }}>
        <div 
          onClick={() => setActiveTab('records')}
          style={{ 
            flex: 1,
            padding: '12px 0',
            textAlign: 'center',
            borderBottom: activeTab === 'records' ? '2px solid #e60012' : 'none',
            color: activeTab === 'records' ? '#e60012' : '#666',
            fontWeight: activeTab === 'records' ? 600 : 400,
            cursor: 'pointer'
          }}
        >
          通话记录
        </div>
        <div 
          onClick={() => setActiveTab('todos')}
          style={{ 
            flex: 1,
            padding: '12px 0',
            textAlign: 'center',
            borderBottom: activeTab === 'todos' ? '2px solid #e60012' : 'none',
            color: activeTab === 'todos' ? '#e60012' : '#666',
            fontWeight: activeTab === 'todos' ? 600 : 400,
            cursor: 'pointer'
          }}
        >
          待办事项
        </div>
      </div>

      {/* 内容 */}
      <div className="fade-in">
        {activeTab === 'records' && mockRecords.map((record) => (
          <div 
            key={record.id} 
            className="card"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedRecord(record)}
          >
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
                  <FileText size={24} color="#e60012" />
                </div>
                <div>
                  <p style={{ fontWeight: 500 }}>{record.caller}</p>
                  <p style={{ fontSize: 12, color: '#666' }}>{record.date} {record.time}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-success">{record.duration}</span>
              </div>
            </div>
            <div style={{ 
              marginTop: 12, 
              padding: '12px', 
              background: '#f9f9f9', 
              borderRadius: 8,
              fontSize: 13,
              color: '#666'
            }}>
              {record.summary.substring(0, 50)}...
            </div>
            {record.todos.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <span className="badge badge-warning">{record.todos.length}个待办</span>
              </div>
            )}
          </div>
        ))}

        {activeTab === 'todos' && (
          <div className="card">
            {mockRecords.flatMap(r => r.todos).map((todo, i) => (
              <div 
                key={i}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 12,
                  padding: '16px 0',
                  borderBottom: i < mockRecords.flatMap(r => r.todos).length - 1 ? '1px solid #f0f0f0' : 'none'
                }}
              >
                <div style={{ 
                  width: 24, 
                  height: 24, 
                  border: '2px solid #e60012',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={16} style={{ opacity: 0 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14 }}>{todo.content}</p>
                  {todo.deadline && (
                    <p style={{ fontSize: 12, color: '#e60012', marginTop: 4 }}>
                      截止：{todo.deadline}
                    </p>
                  )}
                </div>
                <span 
                  className={`badge ${todo.priority === 'high' ? 'badge-error' : 'badge-warning'}`}
                >
                  {todo.priority === 'high' ? '高' : '中'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}