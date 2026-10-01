import ModulePage from './ModulePage';

export default function Assets() {
  return <ModulePage title="الأصول الثابتة" description="سجل الأصول والإهلاك والاستبعاد والقيود المرتبطة." links={[{to:'/journal',label:'القيود'},{to:'/reports',label:'التقارير'}]} />;
}
