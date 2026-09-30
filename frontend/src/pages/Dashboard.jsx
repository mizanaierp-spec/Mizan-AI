import ModulePage from './ModulePage';

export default function Dashboard() {
  return <ModulePage title="لوحة التحكم" description="ملخص الإيرادات والمصروفات والأرصدة والمعاملات الأخيرة." links={[{ to: '/accounts', label: 'دليل الحسابات' }, { to: '/reports', label: 'التقارير' }]} />;
}
