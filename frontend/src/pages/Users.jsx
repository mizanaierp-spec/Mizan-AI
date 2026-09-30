import ModulePage from './ModulePage';

export default function Users() {
  return <ModulePage title="المستخدمون والصلاحيات" description="إدارة المستخدمين والأدوار والصلاحيات وسجل الوصول." links={[{ to: '/reports', label: 'التقارير' }]} />;
}
