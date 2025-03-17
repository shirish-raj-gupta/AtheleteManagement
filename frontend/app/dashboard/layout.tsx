import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="p-4 bg-black text-white">
        <h1>Athlete Management System</h1>
      </nav>
      <main>{children}</main>
    </>
  );
}

