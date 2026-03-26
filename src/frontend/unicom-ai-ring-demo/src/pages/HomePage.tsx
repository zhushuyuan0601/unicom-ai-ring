import { Phone, Mic, Bot, FileText, Sparkles, Video, Music, Camera } from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: 'home' | 'receptionist' | 'xiaoyou' | 'shorthand') => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    { icon: '🎭', name: 'AI 写真', color: '#ff6b6b' },
    { icon: '🎬', name: 'AI 演员', color: '#4ecdc4' },
    { icon: '🎨', name: 'AI 动漫', color: '#45b7d1' },
    { icon: '🎵', name: 'AI 歌手', color: '#f7dc6f' },
    { icon: '💃', name: 'AI 舞王', color: '#bb8fce' },
    { icon: '📸', name: 'AI 合照', color: '#85c1e9' },
    { icon: '📝', name: 'AI 速记', color: '#82e0aa', action: () => onNavigate('shorthand') },
    { icon: '📞', name: 'AI 接线', color: '#f1948a', action: () => onNavigate('receptionist') },
  ]

  return (
    <div className="fade-in">
      {/* Banner - 霓虹渐变风格 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        margin: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, marginBottom: 8, background: 'linear-gradient(135deg, #fff, #e0e0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI 彩铃创作中心
            </h2>
            <p style={{ fontSize: 14, opacity: 0.8, color: 'rgba(255,255,255,0.7)' }}>
              一句话创作你的专属彩铃
            </p>
          </div>
          <div style={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            boxShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            🎵
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{
            marginTop: 16,
            width: '100%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)'
          }}
          onClick={() => onNavigate('xiaoyou')}
        >
          <Sparkles size={20} />
          立即体验
        </button>
      </div>

      {/* 小呦入口 - 玻璃拟态卡片 */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}
        onClick={() => onNavigate('xiaoyou')}
      >
        <div style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          transform: 'rotate(8deg)'
        }}>
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, marginBottom: 4, color: '#fff' }}>小呦智能体</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>你的 AI 彩铃创作助手</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: 13,
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        }}>
          体验
        </div>
      </div>

      {/* 功能入口 */}
      <div className="card">
        <div className="card-title">
          <Sparkles size={20} style={{ color: '#ffd700' }} />
          AI 创作功能
        </div>
        <div className="grid-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-item"
              onClick={feature.action}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div
                className="feature-icon"
                style={{
                  background: `${feature.color}20`,
                  border: `1px solid ${feature.color}40`
                }}
              >
                {feature.icon}
              </div>
              <span className="feature-name">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI 接线员状态 - 霓虹风格 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 240, 255, 0.05))',
        border: '1px solid rgba(0, 255, 136, 0.2)'
      }}>
        <div className="card-title">
          <Phone size={20} style={{ color: '#00ff88' }} />
          AI 接线员
          <span className="badge badge-success" style={{ marginLeft: 'auto', boxShadow: '0 0 10px rgba(0,255,136,0.3)' }}>已开启</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>今日来电</p>
            <p style={{ fontSize: 28, fontWeight: 700, background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>12 通</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>智能应答</p>
            <p style={{ fontSize: 28, fontWeight: 700, background: 'linear-gradient(135deg, #00ff88, #00dd77)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>8 通</p>
          </div>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => onNavigate('receptionist')}
            style={{ borderColor: 'rgba(0,255,136,0.5)', color: '#00ff88' }}
          >
            设置
          </button>
        </div>
      </div>

      {/* AI 速记统计 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.05))',
        border: '1px solid rgba(255, 215, 0, 0.2)'
      }}>
        <div className="card-title">
          <FileText size={20} style={{ color: '#ffd700' }} />
          AI 速记
          <span className="badge badge-warning" style={{ marginLeft: 'auto', boxShadow: '0 0 10px rgba(255,215,0,0.3)' }}>新功能</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>本周速记</p>
            <p style={{ fontSize: 28, fontWeight: 700, background: 'linear-gradient(135deg, #ffd700, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>2h36m</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>待办事项</p>
            <p style={{ fontSize: 28, fontWeight: 700, background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5 项</p>
          </div>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => onNavigate('shorthand')}
            style={{ borderColor: 'rgba(255,215,0,0.5)', color: '#ffd700' }}
          >
            查看
          </button>
        </div>
      </div>

      {/* 热门模板 - 霓虹卡片 */}
      <div className="card">
        <div className="card-title">
          <Video size={20} style={{ color: '#bd00ff' }} />
          热门彩铃模板
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '8px 0' }}>
          {['新年祝福', '生日快乐', '商务形象', '个性创意'].map((name, i) => {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f']
            const icons = ['🎊', '🎂', '💼', '🎨']
            return (
              <div
                key={i}
                style={{
                  minWidth: 130,
                  height: 170,
                  background: `linear-gradient(135deg, ${colors[i]}15, ${colors[i]}30)`,
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  border: `1px solid ${colors[i]}40`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 24px ${colors[i]}20`
                }}
                className="fade-in"
              >
                <span style={{
                  fontSize: 48,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  transition: 'transform 0.3s ease'
                }}>{icons[i]}</span>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>{name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
