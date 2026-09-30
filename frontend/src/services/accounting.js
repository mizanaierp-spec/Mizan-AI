import { apiRequest } from './api';

export function getAccounts(companyId) {
  return apiRequest(`/chart-of-accounts?company_id=${encodeURIComponent(companyId)}`);
}

export function createAccount(account) {
  return apiRequest('/chart-of-accounts', {
    method: 'POST',
    body: JSON.stringify(account)
  });
}

export function getJournalEntries(companyId, periodId) {
  const params = new URLSearchParams({ company_id: companyId, period_id: periodId });
  return apiRequest(`/journal-entries?${params.toString()}`);
}

export function createJournalEntry(entry) {
  return apiRequest('/journal-entries', {
    method: 'POST',
    body: JSON.stringify(entry)
  });
}

export function postJournalEntry(entryId) {
  return apiRequest(`/journal-entries/${entryId}/post`, { method: 'POST' });
}

export function getTrialBalance(companyId, periodId) {
  const params = new URLSearchParams({ company_id: companyId, period_id: periodId });
  return apiRequest(`/reports/trial-balance?${params.toString()}`);
}
