import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@mizan.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'تعذر تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="container"><div className="login-box"><h2>تسجيل الدخول</h2><form onSubmit={submit}><div className="form-group"><label htmlFor="email">البريد الإلكتروني</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div><div className="form-group"><label htmlFor="password">كلمة المرور</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>{error && <p role="alert" style={{ color: 'red' }}>{error}</p>}<button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'جارٍ الدخول...' : 'دخول'}</button></form></div></div>;
}
