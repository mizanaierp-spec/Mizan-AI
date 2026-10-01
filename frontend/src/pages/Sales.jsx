import ModulePage from './ModulePage';

export default function Sales() {
  return <ModulePage title="المبيعات" description="فواتير البيع والعملاء والمدفوعات والمرتجعات." links={[{to:'/inventory',label:'المخزون'},{to:'/reports',label:'التقارير'}]} />;
}
