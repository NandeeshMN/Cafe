import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Image as ImageIcon,
  X,
  Coffee
} from 'lucide-react';
import { fetchMenu, addMenuItem, deleteMenuItem } from '../../services/api';

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Beverages',
    price: '',
    image: '',
    description: ''
  });

  const categories = ['Beverages', 'Fast Food', 'Snacks'];

  const loadMenu = async () => {
    try {
      const data = await fetchMenu();
      setMenu(data);
    } catch (err) {
      console.error("Failed to load menu", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMenuItem(newItem);
      setShowModal(false);
      setNewItem({ name: '', category: 'Beverages', price: '', image: '', description: '' });
      loadMenu();
    } catch (err) {
      alert("Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMenuItem(id);
        loadMenu();
      } catch (err) {
        alert("Failed to delete item");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3e2723]">Menu Library</h1>
          <p className="text-gray-500 font-medium">Add, edit, or remove items from your digital menu</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#5a3a22] text-white rounded-2xl font-bold shadow-lg shadow-black/10 hover:bg-[#4a2f1b] transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-500 font-medium">Loading menu...</div>
        ) : menu.map((item) => (
          <div key={item.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex gap-5 group hover:shadow-md transition-shadow">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Coffee size={32} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <span className="px-2.5 py-0.5 bg-[#f0ebe1] text-[#5a3a22] text-[10px] font-bold rounded-full uppercase">
                  {item.category}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-[#3e2723] text-lg mb-0.5">{item.name}</h3>
              <p className="text-sm text-gray-400 font-medium">${parseFloat(item.price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#3e2723]">Add New Menu Item</h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#3e2723] mb-2">Item Name</label>
                  <input 
                    required
                    type="text" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g. Salted Caramel Macchiato" 
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/10 focus:border-[#5a3a22] transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#3e2723] mb-2">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/10 transition-all outline-none font-semibold text-[#3e2723]"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#3e2723] mb-2">Price ($)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    placeholder="5.99" 
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/10 focus:border-[#5a3a22] transition-all outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#3e2723] mb-2">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="url" 
                      value={newItem.image}
                      onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..." 
                      className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/10 focus:border-[#5a3a22] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-[#5a3a22] text-white rounded-2xl font-bold shadow-lg shadow-black/10 hover:bg-[#4a2f1b] transition-all"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
