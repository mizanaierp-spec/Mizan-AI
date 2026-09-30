import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTrialBalance } from '../services/accounting';

export default function TrialBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.company_id) return;
    setLoading(true);
    getTrialBalance(user.company_id, null)
      .then((response) => {
        setBalance(response?.data || response);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.company_id]);

  return (
    <div className="container">
      <div className="navbar">
        <strong>Mizan AI - ميزان المراجعة</strong>
        <div className="nav-links">
          <a href="/">لوحة التحكم</a>
          <a href="/accounts">الحسابات</a>
          <a href="/journal">القيود</a>
          <a href="/trial-balance">ميزان المراجعة</a>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>ميزان المراجعة</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>جاري التحميل...</p>
        ) : !balance || (Array.isArray(balance) && balance.length === 0) ? (
          <p>لا توجد بيانات</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>اسم الحساب</th>
                <th>مدين</th>
                <th>دائن</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(balance) ? balance : balance?.accounts || []).map((account, index) => (
                <tr key={index}>
                  <td>{account.account_name}</td>
                  <td>{Number(account.debit || 0).toFixed(2)}</td>
                  <td>{Number(account.credit || 0).toFixed(2)}</td>
                </tr>
              ))}
              {balance?.totals && (
                <tr style={{ fontWeight: 'bold', backgroundColor: '#f3f4f6' }}>
                  <td>الإجمالي</td>
                  <td>{Number(balance.totals.debit || 0).toFixed(2)}</td>
                  <td>{Number(balance.totals.credit || 0).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
