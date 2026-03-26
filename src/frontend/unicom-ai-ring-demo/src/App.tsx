import { useState } from 'react'
import { Phone, Mic, Bot, FileText, Home, Settings, User, Bell } from 'lucide-react'
import './App.css'

// 页面组件
import HomePage from './pages/HomePage'
import ReceptionistPage from './pages/ReceptionistPage'
import XiaoyouPage from './pages/XiaoyouPage'
import ShorthandPage from './pages/ShorthandPage'

type Page = 'home' | 'receptionist' | 'xiaoyou' | 'shorthand'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'receptionist':
        return <ReceptionistPage onBack={() => setCurrentPage('home')} />
      case 'xiaoyou':
        return <XiaoyouPage onBack={() => setCurrentPage('home')} />
      case 'shorthand':
        return <ShorthandPage onBack={() => setCurrentPage('home')} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="app">
      {/* 顶部导航 */}
      <header className="header">
        <div className="header-left">
          <span className="logo">🎵 联通AI彩铃</span>
        </div>
        <div className="header-right">
          <Bell className="icon-btn" />
          <User className="icon-btn" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="main">
        {renderPage()}
      </main>

      {/* 底部导航 */}
      <nav className="bottom-nav">
        <div 
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          <Home />
          <span>首页</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'xiaoyou' ? 'active' : ''}`}
          onClick={() => setCurrentPage('xiaoyou')}
        >
          <Bot />
          <span>小呦</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'receptionist' ? 'active' : ''}`}
          onClick={() => setCurrentPage('receptionist')}
        >
          <Phone />
          <span>AI接线</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'shorthand' ? 'active' : ''}`}
          onClick={() => setCurrentPage('shorthand')}
        >
          <FileText />
          <span>速记</span>
        </div>
      </nav>
    </div>
  )
}

export default App