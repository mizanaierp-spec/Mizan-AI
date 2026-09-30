import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ChartOfAccounts from './pages/ChartOfAccounts';
import JournalEntries from './pages/JournalEntries';
import TrialBalance from './pages/TrialBalance';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Payroll from './pages/Payroll';
import Assets from './pages/Assets';
import Bank from './pages/Bank';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <div className="container"><p>جارٍ التحقق من الجلسة...</p></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return <Routes><Route path="/login" element={<Login />} /><Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /><Route path="/accounts" element={<ProtectedRoute><ChartOfAccounts /></ProtectedRoute>} /><Route path="/journal" element={<ProtectedRoute><JournalEntries /></ProtectedRoute>} /><Route path="/trial-balance" element={<ProtectedRoute><TrialBalance /></ProtectedRoute>} /><Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} /><Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} /><Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} /><Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} /><Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} /><Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} /><Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} /><Route path="/bank" element={<ProtectedRoute><Bank /></ProtectedRoute>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}

export default function App() {
  return <AuthProvider><Router><AppRoutes /></Router></AuthProvider>;
}
