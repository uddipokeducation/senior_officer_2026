import React from 'react'
import { Icons } from './Icons'

interface WhatsAppCommunityBannerProps {
  style?: React.CSSProperties
}

export const WhatsAppCommunityBanner: React.FC<WhatsAppCommunityBannerProps> = ({ style }) => {
  const qrUrl = (import.meta.env.BASE_URL || '/senior_officer_2026/').replace(/\/+$/, '') + '/whatsapp_qr.jpg'

  return (
    <section
      className="no-print"
      style={{
        background: 'linear-gradient(125deg, #022c22 0%, #064e3b 55%, #047857 100%)',
        color: '#ffffff',
        borderRadius: '18px',
        padding: '1.75rem 2rem',
        border: '1px solid rgba(110, 231, 183, 0.3)',
        boxShadow: '0 12px 32px -4px rgba(6, 78, 59, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.75rem',
        ...style,
      }}
    >
      <div style={{ flex: '1 1 340px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(16, 185, 129, 0.22)',
            border: '1px solid rgba(110, 231, 183, 0.4)',
            color: '#a7f3d0',
            padding: '0.28rem 0.8rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}
        >
          <Icons.WhatsApp size={15} />
          <span>উদ্দীপক • Official WhatsApp Community</span>
        </div>

        <h2
          style={{
            fontSize: '1.42rem',
            fontWeight: 800,
            marginBottom: '0.55rem',
            lineHeight: 1.35,
            fontFamily: 'var(--font-bn)',
          }}
        >
          পরবর্তী পরীক্ষাগুলোতে অংশ নিতে আমাদের WhatsApp Community-তে যুক্ত হোন!
        </h2>

        <p
          style={{
            fontSize: '0.94rem',
            color: 'rgba(255,255,255,0.86)',
            marginBottom: '1.35rem',
            lineHeight: 1.6,
            fontFamily: 'var(--font-bn)',
          }}
        >
          উদ্দীপক এডুকেশন (Uddipok Education)-এর পরবর্তী সকল ফ্রি ও স্পেশাল মডেল টেস্ট, ব্যাংক ও বিসিএস সলিউশন, পিডিএফ নোট এবং পরীক্ষার রুটিন সবার আগে পেতে আমাদের অফিশিয়াল কমিউনিটিতে জয়েন করুন।
        </p>

        <a
          href="https://chat.whatsapp.com/FwULKQJRU93ALasMI6J8g9"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: '#10b981',
            color: '#022c22',
            padding: '0.85rem 1.65rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.96rem',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
          }}
        >
          <Icons.WhatsApp size={20} />
          <span>Join Uddipok WhatsApp Community</span>
          <Icons.ArrowRight size={17} />
        </a>
      </div>

      <div
        style={{
          background: '#ffffff',
          padding: '0.9rem',
          borderRadius: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto',
        }}
      >
        <img
          src={qrUrl}
          alt="Uddipok Education WhatsApp Community QR Code"
          style={{ width: '164px', height: 'auto', borderRadius: '8px', display: 'block' }}
        />
        <span
          style={{
            color: 'var(--brand-900)',
            fontSize: '0.74rem',
            fontWeight: 800,
            marginTop: '0.5rem',
            letterSpacing: '0.02em',
          }}
        >
          SCAN WITH WHATSAPP CAMERA
        </span>
      </div>
    </section>
  )
}
