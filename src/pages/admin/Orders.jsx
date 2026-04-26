import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChefHat,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [highlightedOrders, setHighlightedOrders] = useState(new Set());
  const prevOrdersRef = React.useRef([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Preparing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Ready': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Served': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={14} />;
      case 'Preparing': return <ChefHat size={14} />;
      case 'Ready': return <ShoppingBag size={14} />;
      case 'Served': return <CheckCircle2 size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      default: return null;
    }
  };

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      
      // Check for new orders
      if (prevOrdersRef.current.length > 0 && data.length > prevOrdersRef.current.length) {
        const newOrders = data.filter(order => !prevOrdersRef.current.some(prev => prev.id === order.id));
        if (newOrders.length > 0) {
          // Play sound
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log("Sound play failed", e));
          
          // Highlight new orders
          const newIds = new Set(highlightedOrders);
          newOrders.forEach(o => newIds.add(o.id));
          setHighlightedOrders(newIds);
          
          // Remove highlight after 10 seconds
          setTimeout(() => {
            setHighlightedOrders(prev => {
              const updated = new Set(prev);
              newOrders.forEach(o => updated.delete(o.id));
              return updated;
            });
          }, 10000);
        }
      }
      
      setOrders(data);
      prevOrdersRef.current = data;
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      loadOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3e2723]">Live Orders</h1>
          <p className="text-gray-500 font-medium">Manage and track customer orders in real-time</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search order ID..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a3a22]/10 w-64"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none font-semibold text-[#3e2723]"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Served">Served</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-10 text-center text-gray-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-10 text-center text-gray-500">No orders found.</td></tr>
              ) : (
                filteredOrders.map((order) => {
                  const items = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json;
                  return (
                    <tr 
                      key={order.id} 
                      className={`transition-all duration-500 ${
                        highlightedOrders.has(order.id) 
                          ? 'bg-yellow-50 animate-pulse border-l-4 border-l-yellow-400' 
                          : 'hover:bg-gray-50/50'
                      } border-b border-gray-50`}
                    >
                      <td className="px-8 py-6">
                        <div className="font-bold text-[#3e2723] mb-1">{order.order_number}</div>
                        <div className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <span className="mx-1">•</span>
                          Table {order.table_number}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="max-w-xs">
                          {items.map((item, idx) => (
                            <span key={idx} className="text-sm text-gray-600 inline-block mr-2 bg-gray-100 px-2 py-0.5 rounded-md mb-1">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6 font-bold text-[#3e2723]">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'Pending' && (
                            <button 
                              onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                            >
                              Start Prep
                            </button>
                          )}
                          {order.status === 'Preparing' && (
                            <button 
                              onClick={() => handleStatusUpdate(order.id, 'Ready')}
                              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors"
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'Ready' && (
                            <button 
                              onClick={() => handleStatusUpdate(order.id, 'Served')}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                            >
                              Mark Served
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
