import ModulePage from './ModulePage';
export default function Payroll() { return <ModulePage title="الرواتب" description="ملفات الموظفين ومسيرات الرواتب والبدلات والخصومات." links={[{to:'/users',label:'المستخدمون'},{to:'/reports',label:'التقارير'}]} />; }
