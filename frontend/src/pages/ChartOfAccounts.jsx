import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccounts, createAccount } from '../services/accounting';

export default function ChartOfAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAccount, setNewAccount] = useState({ account_code: '', account_name: '', account_type: 'asset' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user?.company_id) return;
    setLoading(true);
    getAccounts(user.company_id)
      .then((response) => {
        setAccounts(response?.data || response?.rows || []);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.company_id]);

  async function handleAddAccount() {
    if (!newAccount.account_code || !newAccount.account_name) {
      setError('يرجى إدخال الكود والاسم');
      return;
    }
    try {
      setAdding(true);
      const response = await createAccount({ company_id: user.company_id, ...newAccount });
      const addedAccount = response?.data || response;
      setAccounts([...accounts, addedAccount]);
      setNewAccount({ account_code: '', account_name: '', account_type: 'asset' });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="container">
      <div className="navbar">
        <strong>Mizan AI - دليل الحسابات</strong>
        <div className="nav-links">
          <a href="/">لوحة التحكم</a>
          <a href="/accounts">الحسابات</a>
          <a href="/journal">القيود</a>
          <a href="/trial-balance">ميزان المراجعة</a>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>دليل الحسابات</h3>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <div className="row" style={{ marginBottom: '20px', gap: '10px' }}>
          <div className="form-group">
            <label htmlFor="code">الكود</label>
            <input
              id="code"
              value={newAccount.account_code}
              onChange={(e) => setNewAccount({ ...newAccount, account_code: e.target.value })}
              placeholder="1010"
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">اسم الحساب</label>
            <input
              id="name"
              value={newAccount.account_name}
              onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
              placeholder="الصندوق"
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">النوع</label>
            <select
              id="type"
              value={newAccount.account_type}
              onChange={(e) => setNewAccount({ ...newAccount, account_type: e.target.value })}
            >
              <option value="asset">أصل</option>
              <option value="liability">التزام</option>
              <option value="equity">حقوق ملكية</option>
              <option value="revenue">إيراد</option>
              <option value="expense">مصروف</option>
            </select>
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleAddAccount} disabled={adding}>
              {adding ? 'جاري الإضافة...' : 'إضافة حساب'}
            </button>
          </div>
        </div>

        {loading ? (
          <p>جاري التحميل...</p>
        ) : accounts.length === 0 ? (
          <p>لا توجد حسابات</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>الكود</th>
                <th>اسم الحساب</th>
                <th>النوع</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.account_code}</td>
                  <td>{account.account_name}</td>
                  <td>{account.account_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
