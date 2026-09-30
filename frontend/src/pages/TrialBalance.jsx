import ModulePage from './ModulePage';

export default function TrialBalance() {
  return <ModulePage title="ميزان المراجعة" description="عرض أرصدة الحسابات والتحقق من توازن إجمالي المدين والدائن." links={[{ to: '/journal', label: 'القيود اليومية' }, { to: '/reports', label: 'التقارير' }]} />;
}
