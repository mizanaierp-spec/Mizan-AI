import ModulePage from './ModulePage';
export default function Bank() { return <ModulePage title="الخزينة والبنوك" description="الحسابات البنكية والتحويلات والإيداعات والتسويات." links={[{to:'/journal',label:'القيود'},{to:'/reports',label:'التقارير'}]} />; }
