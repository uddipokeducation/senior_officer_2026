import React from 'react'
import { Icons } from './Icons'

interface WhatsAppCommunityBannerProps {
  style?: React.CSSProperties
}

export const WhatsAppCommunityBanner: React.FC<WhatsAppCommunityBannerProps> = ({ style }) => {
  const qrUrl = (import.meta.env.BASE_URL || '/senior_officer_2026/').replace(/\/+$/, '') + '/whatsapp_qr.jpg'

  return (
    <section className="whatsapp-banner no-print" style={style}>
      <div className="whatsapp-banner-content">
        <div className="whatsapp-badge">
          <Icons.WhatsApp size={15} />
          <span>উদ্দীপক • Official WhatsApp Community</span>
        </div>

        <h2 className="whatsapp-heading">
          পরবর্তী পরীক্ষাগুলোতে অংশ নিতে আমাদের WhatsApp Community-তে যুক্ত হোন!
        </h2>

        <p className="whatsapp-desc">
          উদ্দীপক এডুকেশন (Uddipok Education)-এর পরবর্তী সকল ফ্রি ও স্পেশাল মডেল টেস্ট, ব্যাংক ও বিসিএস সলিউশন, পিডিএফ নোট এবং পরীক্ষার রুটিন সবার আগে পেতে আমাদের অফিশিয়াল কমিউনিটিতে জয়েন করুন।
        </p>

        <a
          href="https://chat.whatsapp.com/FwULKQJRU93ALasMI6J8g9"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-cta-btn"
        >
          <Icons.WhatsApp size={20} />
          <span>Join Uddipok WhatsApp Community</span>
          <Icons.ArrowRight size={17} />
        </a>
      </div>

      <div className="whatsapp-qr-card">
        <img
          src={qrUrl}
          alt="Uddipok Education WhatsApp Community QR Code"
          className="whatsapp-qr-img"
        />
        <span className="whatsapp-qr-label">
          SCAN WITH WHATSAPP CAMERA
        </span>
      </div>
    </section>
  )
}
