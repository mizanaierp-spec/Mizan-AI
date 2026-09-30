import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.company_id) return;
    setLoading(true);
    apiRequest(`/users?company_id=${encodeURIComponent(user.company_id)}`)
      .then((response) => {
        setUsers(response?.data || response?.rows || []);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.company_id]);

  return (
    <div className="container">
      <div className="navbar">
        <strong>Mizan AI - المستخدمون</strong>
        <div className="nav-links">
          <a href="/">لوحة التحكم</a>
          <a href="/users">المستخدمون</a>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>إدارة المستخدمين</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? (
          <p>جاري التحميل...</p>
        ) : users.length === 0 ? (
          <p>لا توجد مستخدمين</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الدور</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
