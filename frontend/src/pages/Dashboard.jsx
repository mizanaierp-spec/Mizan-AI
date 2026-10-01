import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ companies: 0, users: 0, transactions: 0, reports: 0 });

  useEffect(() => {
    setStats({ companies: 1, users: 1, transactions: 0, reports: 0 });
  }, []);

  return (
    <div className="container">
      <div className="navbar">
        <strong>Mizan AI - لوحة التحكم</strong>
        <div className="nav-links">
          <a href="/">الرئيسية</a>
          <a href="/accounts">الحسابات</a>
          <a href="/journal">القيود</a>
          <a href="/reports">التقارير</a>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>مرحبا {user?.name || 'المستخدم'}</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>أهلا وسهلا بك في منظومة محاسبة ميزان الذكية</p>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '16px', backgroundColor: '#f0f9ff', borderLeft: '4px solid #0084ff' }}>
            <h4>الشركات</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>{stats.companies}</p>
            <small style={{ color: '#666' }}>شركات نشطة</small>
          </div>

          <div className="card" style={{ padding: '16px', backgroundColor: '#f0fdf4', borderLeft: '4px solid #10b981' }}>
            <h4>المستخدمون</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>{stats.users}</p>
            <small style={{ color: '#666' }}>مستخدمون نشطون</small>
          </div>

          <div className="card" style={{ padding: '16px', backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
            <h4>المعاملات</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>{stats.transactions}</p>
            <small style={{ color: '#666' }}>عمليات اليوم</small>
          </div>

          <div className="card" style={{ padding: '16px', backgroundColor: '#fce7f3', borderLeft: '4px solid #ec4899' }}>
            <h4>التقارير</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>{stats.reports}</p>
            <small style={{ color: '#666' }}>تقارير مُنشأة</small>
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <h3>الخطوات التالية</h3>
          <ul style={{ lineHeight: '2' }}>
            <li><a href="/accounts" style={{ color: '#0084ff' }}>➜ إدارة دليل الحسابات</a></li>
            <li><a href="/journal" style={{ color: '#0084ff' }}>➜ إنشاء قيود يومية</a></li>
            <li><a href="/trial-balance" style={{ color: '#0084ff' }}>➜ عرض ميزان المراجعة</a></li>
            <li><a href="/reports" style={{ color: '#0084ff' }}>➜ تنزيل التقارير المالية</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
