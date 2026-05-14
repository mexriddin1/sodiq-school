import { Sidebar } from '@/components/Sidebar';
import { AdminGate } from '@/components/AdminGate';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="app">
        <Sidebar />
        <div>{children}</div>
      </div>
    </AdminGate>
  );
}
