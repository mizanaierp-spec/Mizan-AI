import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getJournalEntries, createJournalEntry, postJournalEntry } from '../services/accounting';
import { validateJournalLines } from '../services/accountingValidation';

export default function JournalEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEntry, setNewEntry] = useState({ description: '', lines: [{ account_id: '', debit: '', credit: '' }] });

  useEffect(() => {
    if (!user?.company_id) return;
    setLoading(true);
    getJournalEntries(user.company_id, null)
      .then((response) => {
        setEntries(response?.data || response?.rows || []);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.company_id]);

  async function handleAddEntry() {
    const validation = validateJournalLines(newEntry.lines);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    try {
      const response = await createJournalEntry({
        company_id: user.company_id,
        description: newEntry.description,
        lines: newEntry.lines
      });
      const addedEntry = response?.data || response;
      setEntries([...entries, addedEntry]);
      setNewEntry({ description: '', lines: [{ account_id: '', debit: '', credit: '' }] });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  function addLine() {
    setNewEntry({ ...newEntry, lines: [...newEntry.lines, { account_id: '', debit: '', credit: '' }] });
  }

  function removeLine(index) {
    setNewEntry({ ...newEntry, lines: newEntry.lines.filter((_, i) => i !== index) });
  }

  return (
    <div className="container">
      <div className="navbar">
        <strong>Mizan AI - القيود اليومية</strong>
        <div className="nav-links">
          <a href="/">لوحة التحكم</a>
          <a href="/journal">القيود</a>
          <a href="/accounts">الحسابات</a>
          <a href="/trial-balance">ميزان المراجعة</a>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>القيود اليومية</h3>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <div className="form-group">
          <label htmlFor="description">الوصف</label>
          <input
            id="description"
            value={newEntry.description}
            onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            placeholder="وصف القيد"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>سطور القيد</h4>
          {newEntry.lines.map((line, index) => (
            <div key={index} className="row" style={{ marginBottom: '10px' }}>
              <div className="form-group">
                <label>الحساب</label>
                <input
                  type="number"
                  value={line.account_id}
                  onChange={(e) => {
                    const newLines = [...newEntry.lines];
                    newLines[index].account_id = e.target.value;
                    setNewEntry({ ...newEntry, lines: newLines });
                  }}
                  placeholder="رقم الحساب"
                />
              </div>
              <div className="form-group">
                <label>مدين</label>
                <input
                  type="number"
                  value={line.debit}
                  onChange={(e) => {
                    const newLines = [...newEntry.lines];
                    newLines[index].debit = e.target.value;
                    setNewEntry({ ...newEntry, lines: newLines });
                  }}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>دائن</label>
                <input
                  type="number"
                  value={line.credit}
                  onChange={(e) => {
                    const newLines = [...newEntry.lines];
                    newLines[index].credit = e.target.value;
                    setNewEntry({ ...newEntry, lines: newLines });
                  }}
                  placeholder="0"
                />
              </div>
              {newEntry.lines.length > 1 && (
                <button className="btn btn-secondary" onClick={() => removeLine(index)}>
                  حذف
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={addLine}>
            إضافة سطر
          </button>
          <button className="btn btn-primary" onClick={handleAddEntry} style={{ marginRight: '10px' }}>
            حفظ القيد
          </button>
        </div>

        <h4>القيود السابقة</h4>
        {loading ? (
          <p>جاري التحميل...</p>
        ) : entries.length === 0 ? (
          <p>لا توجد قيود</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>الرقم</th>
                <th>الوصف</th>
                <th>التاريخ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.entry_number}</td>
                  <td>{entry.description}</td>
                  <td>{new Date(entry.entry_date).toLocaleDateString('ar-SA')}</td>
                  <td>{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
