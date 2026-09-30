import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);

  const reports = [
    { id: 'trial-balance', name: 'ميزان المراجعة', description: 'قائمة بجميع الحسابات ورصيدها' },
    { id: 'income-statement', name: 'قائمة الدخل', description: 'الإيرادات والمصروفات والربح' },
    { id: 'general-ledger', name: 'الأستاذ العام', description: 'تفاصيل جميع العمليات لكل حساب' },
    { id: 'cash-flow', name: 'التدفق النقدي', description: 'حركة النقد خلال الفترة' }
  ];

  async function generateReport(reportId) {
    setLoading(true);
    try {
      // Placeholder for actual API call
      setTimeout(() => {
        setReportData({ report: reportId, generated: new Date().toLocaleDateString('ar-SA') });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating report:', error);
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="navbar">
        <strong>Mizan AI - التقارير</strong>
        <div className="nav-links">
          <a href="/">لوحة التحكم</a>
          <a href="/trial-balance">ميزان المراجعة</a>
          <a href="/reports">التقارير</a>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>التقارير المالية</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {reports.map((report) => (
            <div key={report.id} className="card" style={{ padding: '16px', cursor: 'pointer' }}>
              <h4>{report.name}</h4>
              <p>{report.description}</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedReport(report.id);
                  generateReport(report.id);
                }}
                disabled={loading}
              >
                {loading && selectedReport === report.id ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
              </button>
            </div>
          ))}
        </div>

        {reportData && (
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}
          >
            <h4>التقرير المُنشأ</h4>
            <p>التقرير: {reportData.report}</p>
            <p>التاريخ: {reportData.generated}</p>
            <button className="btn btn-primary">تحميل PDF</button>
            <button className="btn btn-secondary" style={{ marginRight: '10px' }}>
              تحميل Excel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
