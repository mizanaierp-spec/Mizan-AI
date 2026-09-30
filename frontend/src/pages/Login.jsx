import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@mizan.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    localStorage.setItem('mizan_token', 'demo-token');
    localStorage.setItem('mizan_user', JSON.stringify({ email, role: 'admin' }));
    navigate('/');
  }

  return <div className="container"><div className="login-box"><h2>تسجيل الدخول</h2><form onSubmit={submit}><div className="form-group"><label htmlFor="email">البريد الإلكتروني</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div><div className="form-group"><label htmlFor="password">كلمة المرور</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>{error && <p role="alert" style={{ color: 'red' }}>{error}</p>}<button className="btn btn-primary" type="submit">دخول</button></form></div></div>;
}
