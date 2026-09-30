import ModulePage from './ModulePage';

export default function Reports() {
  return <ModulePage title="التقارير المالية" description="الأستاذ العام وميزان المراجعة وقائمة الدخل والتدفقات النقدية." links={[{ to: '/trial-balance', label: 'ميزان المراجعة' }, { to: '/journal', label: 'القيود' }]} />;
}
