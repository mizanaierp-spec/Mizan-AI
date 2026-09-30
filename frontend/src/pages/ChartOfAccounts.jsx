import ModulePage from './ModulePage';

export default function ChartOfAccounts() {
  return <ModulePage title="دليل الحسابات" description="إدارة الحسابات الرئيسية والفرعية وأكواد الحسابات والأرصدة." links={[{ to: '/journal', label: 'القيود اليومية' }, { to: '/trial-balance', label: 'ميزان المراجعة' }]} />;
}
