import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Menu as MenuIcon, 
  QrCode,
  LogOut, 
  Coffee,
  ChevronRight
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
    { path: '/admin/menu', icon: <MenuIcon size={20} />, label: 'Menu Management' },
    { path: '/admin/tables', icon: <QrCode size={20} />, label: 'Tables & QR' },
  ];

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#3e2723] text-white flex flex-col fixed h-full z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5a3a22] rounded-xl flex items-center justify-center text-white shadow-lg border border-[#6d4c41]">
            <Coffee size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Artisanal</h1>
            <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-[#5a3a22] text-white shadow-lg shadow-black/10' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'}
              `}
            >
              <div className="flex items-center gap-3.5">
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
