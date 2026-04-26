import React, { useState, useEffect } from 'react';
import { QrCode, Download, Printer, Plus, Loader2 } from 'lucide-react';
import { fetchTables, downloadSmallQRSheet, addTable } from '../../services/api';

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [addingTable, setAddingTable] = useState(false);

  const loadTables = async () => {
    try {
      const data = await fetchTables();
      setTables(data);
    } catch (err) {
      console.error("Failed to load tables", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableNumber) return;
    
    setAddingTable(true);
    try {
      await addTable(newTableNumber);
      setNewTableNumber('');
      loadTables();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add table");
    } finally {
      setAddingTable(false);
    }
  };

  const handleDownloadSheet = async () => {
    setDownloading(true);
    try {
      const blob = await downloadSmallQRSheet();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cafe-compact-qrs.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download sheet", err);
      alert("Failed to download QR sheet");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadQR = async (tableId, tableNumber) => {
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/tables/${tableId}/qrcode`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Table-${tableNumber}-QR.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download QR");
    }
  };

  const handlePrint = (tableId, tableNumber) => {
    const qrUrl = `http://${window.location.hostname}:5000/api/tables/${tableId}/qrcode`;
    const windowPrint = window.open('', '', 'width=600,height=600');
    windowPrint.document.write(`
      <html>
        <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family: sans-serif;">
          <h1 style="margin-bottom: 20px;">Table ${tableNumber}</h1>
          <img src="${qrUrl}" style="width: 300px; height: 300px;" />
          <p style="margin-top: 20px; font-weight: bold;">Scan to Order</p>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 1000);
          </script>
        </body>
      </html>
    `);
    windowPrint.document.close();
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#3e2723]">Table Management</h1>
          <p className="text-gray-500 font-medium">Add tables and manage QR codes dynamically</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <form onSubmit={handleAddTable} className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <input 
              type="number" 
              placeholder="Table No." 
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="w-24 px-4 py-2 bg-[#f0ebe1]/30 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5a3a22]/10"
              required
            />
            <button 
              type="submit" 
              disabled={addingTable}
              className="px-4 py-2 bg-[#5a3a22] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
            >
              {addingTable ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              Add Table
            </button>
          </form>

          <button 
            onClick={handleDownloadSheet}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-[#3e2723] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            <Download size={20} />
            {downloading ? 'Generating...' : 'Compact Sheet (A4)'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Loading table grid...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tables.map((table) => {
            const dynamicQR = `http://${window.location.hostname}:5000/api/tables/${table.id}/qrcode`;
            return (
              <div key={table.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-[#f0ebe1] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-[#5a3a22] font-bold text-xl">{table.table_number}</span>
                </div>
                
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-inner mb-6 relative">
                  <img 
                    src={dynamicQR} 
                    alt={`Table ${table.table_number} QR`} 
                    className="w-40 h-40" 
                    loading="lazy"
                  />
                </div>

                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => handleDownloadQR(table.id, table.table_number)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Download size={14} />
                    Save PNG
                  </button>
                  <button 
                    onClick={() => handlePrint(table.id, table.table_number)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#5a3a22] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-md"
                  >
                    <Printer size={14} />
                    Print
                  </button>
                </div>
              </div>
            );
          })}
          
          {tables.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <QrCode size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No tables added yet.<br/>Use the form above to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTables;
