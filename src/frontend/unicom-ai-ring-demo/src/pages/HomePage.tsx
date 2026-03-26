import { Phone, Mic, Bot, FileText, Sparkles, Video, Music, Camera } from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: 'home' | 'receptionist' | 'xiaoyou' | 'shorthand') => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    { icon: '🎭', name: 'AI写真', color: '#ff6b6b' },
    { icon: '🎬', name: 'AI演员', color: '#4ecdc4' },
    { icon: '🎨', name: 'AI动漫', color: '#45b7d1' },
    { icon: '🎵', name: 'AI歌手', color: '#f7dc6f' },
    { icon: '💃', name: 'AI舞王', color: '#bb8fce' },
    { icon: '📸', name: 'AI合照', color: '#85c1e9' },
    { icon: '📝', name: 'AI速记', color: '#82e0aa', action: () => onNavigate('shorthand') },
    { icon: '📞', name: 'AI接线', color: '#f1948a', action: () => onNavigate('receptionist') },
  ]

  return (
    <div className="fade-in">
      {/* Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #e60012, #b30000)',
        color: 'white',
        margin: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>AI彩铃创作中心</h2>
            <p style={{ fontSize: 14, opacity: 0.9 }}>一句话创作你的专属彩铃</p>
          </div>
          <div style={{ 
            width: 80, 
            height: 80, 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40
          }}>
            🎵
          </div>
        </div>
        <button 
          className="btn" 
          style={{ 
            background: 'white', 
            color: '#e60012',
            marginTop: 16,
            width: '100%'
          }}
          onClick={() => onNavigate('xiaoyou')}
        >
          <Sparkles size={20} />
          立即体验
        </button>
      </div>

      {/* 小呦入口 */}
      <div 
        className="card" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16,
          cursor: 'pointer'
        }}
        onClick={() => onNavigate('xiaoyou')}
      >
        <div style={{ 
          width: 60, 
          height: 60, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30
        }}>
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, marginBottom: 4 }}>小呦智能体</h3>
          <p style={{ fontSize: 13, color: '#666' }}>你的AI彩铃创作助手</p>
        </div>
        <div style={{ 
          background: '#e60012', 
          color: 'white', 
          padding: '6px 12px', 
          borderRadius: 16,
          fontSize: 12
        }}>
          体验
        </div>
      </div>

      {/* 功能入口 */}
      <div className="card">
        <div className="card-title">
          <Sparkles size={20} style={{ color: '#e60012' }} />
          AI创作功能
        </div>
        <div className="grid-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-item"
              onClick={feature.action}
            >
              <div 
                className="feature-icon"
                style={{ background: feature.color + '20' }}
              >
                {feature.icon}
              </div>
              <span className="feature-name">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI接线员状态 */}
      <div className="card">
        <div className="card-title">
          <Phone size={20} style={{ color: '#e60012' }} />
          AI接线员
          <span className="badge badge-success" style={{ marginLeft: 'auto' }}>已开启</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, color: '#666' }}>今日来电</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#e60012' }}>12 通</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: '#666' }}>智能应答</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }}>8 通</p>
          </div>
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => onNavigate('receptionist')}
          >
            设置
          </button>
        </div>
      </div>

      {/* AI速记统计 */}
      <div className="card">
        <div className="card-title">
          <FileText size={20} style={{ color: '#e60012' }} />
          AI速记
          <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>新功能</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, color: '#666' }}>本周速记</p>
            <p style={{ fontSize: 24, fontWeight: 600 }}>2小时36分</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: '#666' }}>待办事项</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#e60012' }}>5 项</p>
          </div>
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => onNavigate('shorthand')}
          >
            查看
          </button>
        </div>
      </div>

      {/* 热门模板 */}
      <div className="card">
        <div className="card-title">
          <Video size={20} style={{ color: '#e60012' }} />
          热门彩铃模板
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '8px 0' }}>
          {['新年祝福', '生日快乐', '商务形象', '个性创意'].map((name, i) => (
            <div 
              key={i}
              style={{ 
                minWidth: 120,
                height: 160,
                background: `linear-gradient(135deg, #${['ff6b6b', '4ecdc4', '45b7d1', 'f7dc6f'][i]}20, #${['ff6b6b', '4ecdc4', '45b7d1', 'f7dc6f'][i]}40)`,
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <span style={{ fontSize: 40 }}>{['🎊', '🎂', '💼', '🎨'][i]}</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}