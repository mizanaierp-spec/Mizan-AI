import { Link } from 'react-router-dom';

export default function ModulePage({ title, description, links = [] }) {
  return <div className="container"><div className="navbar"><strong>Mizan AI</strong><div className="nav-links"><Link to="/">الرئيسية</Link>{links.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}</div></div><div className="card" style={{ marginTop: 24 }}><h2>{title}</h2><p>{description}</p><span className="badge">المرحلة الثالثة - Connected UI</span></div></div>;
}
