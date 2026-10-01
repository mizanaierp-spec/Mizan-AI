import ModulePage from './ModulePage';

export default function Purchases() {
  return <ModulePage title="المشتريات" description="فواتير الشراء والموردون والمدفوعات والمرتجعات." links={[{to:'/inventory',label:'المخزون'},{to:'/reports',label:'التقارير'}]} />;
}
