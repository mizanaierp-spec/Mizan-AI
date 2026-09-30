import ModulePage from './ModulePage';

export default function JournalEntries() {
  return <ModulePage title="القيود اليومية" description="إنشاء القيود والتحقق من تساوي المدين والدائن وترحيلها." links={[{ to: '/accounts', label: 'دليل الحسابات' }, { to: '/trial-balance', label: 'ميزان المراجعة' }]} />;
}
