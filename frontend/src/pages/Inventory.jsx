import ModulePage from './ModulePage';

export default function Inventory() {
  return <ModulePage title="المخزون" description="إدارة الأصناف والمستودعات وحركات الجرد والتكلفة." links={[{to:'/sales',label:'المبيعات'},{to:'/purchases',label:'المشتريات'}]} />;
}
