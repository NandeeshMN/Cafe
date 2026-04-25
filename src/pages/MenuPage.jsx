import React, { useState, useEffect } from 'react';
import { Search, Coffee } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import BottomBar from '../components/BottomBar';
import { fetchMenu } from '../services/api';

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchMenu();
        setMenu(data);
      } catch (error) {
        console.error('Failed to load menu', error);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  const categories = ['All', 'Beverages', 'Fast Food', 'Snacks'];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-sm px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Coffee className="text-[#5a3a22]" size={24} strokeWidth={2.5} />
          <h1 className="font-bold text-xl text-[#3e2723] tracking-tight">Artisanal Cafe</h1>
        </div>
        <button className="p-2 text-[#3e2723] bg-white rounded-full shadow-sm border border-gray-100">
          <Search size={20} />
        </button>
      </header>

      {/* Search Bar */}
      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for your favorites..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f0ebe1]/50 border-none rounded-full py-3 pl-10 pr-4 text-sm text-[#3e2723] focus:outline-none focus:ring-2 focus:ring-[#5a3a22]/20"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 py-2 mb-2 overflow-x-auto hide-scrollbar flex gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === cat 
                ? 'bg-[#5a3a22] text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <main className="px-5 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-[2rem] aspect-square mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredMenu.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {filteredMenu.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No items found.</p>
          </div>
        )}
      </main>

      <BottomBar />
    </div>
  );
};

export default MenuPage;
