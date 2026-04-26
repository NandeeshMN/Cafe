import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { fetchOrders } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    revenue: 0,
    completedToday: 0
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const orders = await fetchOrders();
        const active = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready').length;
        const revenue = orders.filter(o => o.status === 'Served').reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0);
        const completed = orders.filter(o => o.status === 'Served').length;

        setStats({
          totalOrders: orders.length,
          activeOrders: active,
          revenue: revenue,
          completedToday: completed
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    getStats();
    const interval = setInterval(getStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag />, color: 'bg-indigo-500', trend: '+12%' },
    { label: 'Active Orders', value: stats.activeOrders, icon: <Clock />, color: 'bg-amber-500', trend: 'Live' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: <DollarSign />, color: 'bg-emerald-500', trend: '+8%' },
    { label: 'Completed', value: stats.completedToday, icon: <CheckCircle />, color: 'bg-sky-500', trend: 'Daily' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3e2723]">Overview</h1>
          <p className="text-gray-500 font-medium">Welcome back, Cafe Manager</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          System Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.color} text-white p-3 rounded-2xl shadow-lg`}>
                {React.cloneElement(card.icon, { size: 24 })}
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                {card.trend}
                <ArrowUpRight size={14} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-semibold mb-1">{card.label}</p>
            <h3 className="text-2xl font-bold text-[#3e2723]">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="text-gray-300" size={40} />
        </div>
        <h2 className="text-xl font-bold text-[#3e2723] mb-2">Ready for Performance Insights?</h2>
        <p className="text-gray-500 max-w-sm mx-auto">Detailed analytics and charts will appear here as your cafe processes more orders.</p>
        <button className="mt-6 px-6 py-2.5 bg-[#5a3a22] text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
          View Detailed Reports
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
