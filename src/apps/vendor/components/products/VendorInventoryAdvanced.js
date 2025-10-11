import React, { useState, useEffect } from 'react';
import '../../styles/VendorInventoryAdvanced.css';

const VendorInventoryAdvanced = ({ vendorData }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [csvData, setCsvData] = useState('');
  const [lowStockSettings, setLowStockSettings] = useState({
    threshold: 10,
    autoReorder: false,
    reorderQuantity: 50,
    emailAlerts: true
  });

  const token = localStorage.getItem('vendorToken');

  useEffect(() => {
    fetchInventory();
    fetchLowStockSettings();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/vendor/inventory/advanced', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockSettings = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/vendor/inventory/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const settings = await response.json();
        setLowStockSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkAction || selectedProducts.length === 0) {
      alert('Please select products and an action');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/vendor/inventory/bulk-update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_ids: selectedProducts,
          action: bulkAction,
          value: bulkAction === 'update_stock' ? 0 : null // Can be customized
        })
      });

      if (response.ok) {
        alert('Bulk update completed successfully!');
        setShowBulkModal(false);
        setSelectedProducts([]);
        setBulkAction('');
        fetchInventory();
      } else {
        alert('Failed to perform bulk update');
      }
    } catch (error) {
      alert('Error performing bulk update');
    }
  };

  const handleCsvImport = async () => {
    if (!csvData.trim()) {
      alert('Please paste CSV data');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/vendor/inventory/import-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          csv_data: csvData
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`CSV import completed! Updated ${result.updated_count} products.`);
        setCsvData('');
        fetchInventory();
      } else {
        const error = await response.json();
        alert(`Failed to import CSV: ${error.detail}`);
      }
    } catch (error) {
      alert('Error importing CSV data');
    }
  };

  const exportToCsv = () => {
    const headers = ['Product ID', 'Name', 'SKU', 'Stock Quantity', 'Price', 'Status'];
    const csvContent = [
      headers.join(','),
      ...inventory.map(item => [
        item.id,
        `"${item.name}"`,
        item.sku || '',
        item.stock_quantity,
        item.price,
        item.is_active ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const updateLowStockSettings = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/vendor/inventory/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lowStockSettings)
      });

      if (response.ok) {
        alert('Settings updated successfully!');
        setShowLowStockModal(false);
      } else {
        alert('Failed to update settings');
      }
    } catch (error) {
      alert('Error updating settings');
    }
  };

  const getStockStatus = (quantity, threshold = lowStockSettings.threshold) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= threshold) return 'low-stock';
    if (quantity <= threshold * 2) return 'medium-stock';
    return 'high-stock';
  };

  const getStockStatusText = (status) => {
    const statusMap = {
      'out-of-stock': 'Out of Stock',
      'low-stock': 'Low Stock',
      'medium-stock': 'Medium Stock',
      'high-stock': 'In Stock'
    };
    return statusMap[status] || 'Unknown';
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === inventory.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(inventory.map(item => item.id));
    }
  };

  if (loading) {
    return <div className="loading">Loading advanced inventory...</div>;
  }

  return (
    <div className="vendor-inventory-advanced">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>📦 Advanced Inventory Management</h2>
            <p>Bulk operations, automation, and advanced inventory controls</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-action"
              onClick={() => setShowLowStockModal(true)}
            >
              ⚙️ Settings
            </button>
            <button 
              className="btn-action"
              onClick={exportToCsv}
            >
              📊 Export CSV
            </button>
            <button 
              className="btn-primary"
              onClick={() => setShowBulkModal(true)}
            >
              🔧 Bulk Actions
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Statistics */}
      <div className="inventory-stats">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <div className="stat-value">{inventory.length}</div>
          </div>
        </div>
        <div className="stat-card low-stock">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Low Stock</h3>
            <div className="stat-value">
              {inventory.filter(item => getStockStatus(item.stock_quantity) === 'low-stock').length}
            </div>
          </div>
        </div>
        <div className="stat-card out-of-stock">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Out of Stock</h3>
            <div className="stat-value">
              {inventory.filter(item => item.stock_quantity === 0).length}
            </div>
          </div>
        </div>
        <div className="stat-card total-value">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Inventory Value</h3>
            <div className="stat-value">
              ₹{inventory.reduce((total, item) => total + (item.price * item.stock_quantity), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-section">
        <div className="table-controls">
          <div className="selection-controls">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={selectedProducts.length === inventory.length && inventory.length > 0}
                onChange={selectAllProducts}
              />
              <span className="checkmark"></span>
              Select All ({selectedProducts.length} selected)
            </label>
          </div>
          {selectedProducts.length > 0 && (
            <div className="quick-actions">
              <button 
                className="btn-quick-action activate"
                onClick={() => {
                  setBulkAction('activate');
                  handleBulkUpdate();
                }}
              >
                Activate Selected
              </button>
              <button 
                className="btn-quick-action deactivate"
                onClick={() => {
                  setBulkAction('deactivate');
                  handleBulkUpdate();
                }}
              >
                Deactivate Selected
              </button>
            </div>
          )}
        </div>

        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Value</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const stockStatus = getStockStatus(item.stock_quantity);
                return (
                  <tr key={item.id} className={selectedProducts.includes(item.id) ? 'selected' : ''}>
                    <td>
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(item.id)}
                          onChange={() => toggleProductSelection(item.id)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td className="product-info">
                      <div className="product-details">
                        <div className="product-name">{item.name}</div>
                        <div className="product-price">₹{item.price}</div>
                      </div>
                    </td>
                    <td>{item.sku || '-'}</td>
                    <td>
                      <div className="stock-info">
                        <span className="stock-quantity">{item.stock_quantity}</span>
                        <span className={`stock-status ${stockStatus}`}>
                          {getStockStatusText(stockStatus)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${item.is_active ? 'active' : 'inactive'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>₹{(item.price * item.stock_quantity).toLocaleString()}</td>
                    <td>{new Date(item.updated_at || item.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <button className="btn-action-small">📝 Edit</button>
                      <button className="btn-action-small">📈 History</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions Modal */}
      {showBulkModal && (
        <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔧 Bulk Inventory Operations</h3>
              <button className="modal-close" onClick={() => setShowBulkModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="bulk-section">
                <h4>📊 CSV Import/Export</h4>
                <div className="csv-actions">
                  <button className="btn-csv-export" onClick={exportToCsv}>
                    📤 Export Current Inventory
                  </button>
                  <div className="csv-import">
                    <textarea
                      placeholder="Paste CSV data here (Format: product_id,stock_quantity,price)&#10;Example:&#10;1,100,299.99&#10;2,50,199.99"
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                      rows={5}
                    />
                    <button className="btn-csv-import" onClick={handleCsvImport}>
                      📥 Import CSV Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="bulk-section">
                <h4>⚡ Quick Bulk Actions</h4>
                <div className="bulk-actions-grid">
                  <button 
                    className="bulk-action-btn activate"
                    onClick={() => {
                      setBulkAction('activate');
                      handleBulkUpdate();
                    }}
                    disabled={selectedProducts.length === 0}
                  >
                    ✅ Activate Selected
                  </button>
                  <button 
                    className="bulk-action-btn deactivate"
                    onClick={() => {
                      setBulkAction('deactivate');
                      handleBulkUpdate();
                    }}
                    disabled={selectedProducts.length === 0}
                  >
                    ❌ Deactivate Selected
                  </button>
                  <button 
                    className="bulk-action-btn restock"
                    disabled={selectedProducts.length === 0}
                  >
                    📦 Bulk Restock
                  </button>
                  <button 
                    className="bulk-action-btn discount"
                    disabled={selectedProducts.length === 0}
                  >
                    💰 Apply Discount
                  </button>
                </div>
                <p className="selection-info">
                  {selectedProducts.length} products selected
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Settings Modal */}
      {showLowStockModal && (
        <div className="modal-overlay" onClick={() => setShowLowStockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚙️ Inventory Settings</h3>
              <button className="modal-close" onClick={() => setShowLowStockModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="settings-form">
                <div className="form-group">
                  <label>Low Stock Threshold</label>
                  <input
                    type="number"
                    value={lowStockSettings.threshold}
                    onChange={(e) => setLowStockSettings(prev => ({
                      ...prev,
                      threshold: parseInt(e.target.value)
                    }))}
                    min="1"
                  />
                  <small>Products below this quantity will be marked as low stock</small>
                </div>

                <div className="form-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={lowStockSettings.autoReorder}
                      onChange={(e) => setLowStockSettings(prev => ({
                        ...prev,
                        autoReorder: e.target.checked
                      }))}
                    />
                    <span className="toggle-switch"></span>
                    Enable Auto-Reorder Suggestions
                  </label>
                  <small>Get automatic suggestions when products are low in stock</small>
                </div>

                {lowStockSettings.autoReorder && (
                  <div className="form-group">
                    <label>Default Reorder Quantity</label>
                    <input
                      type="number"
                      value={lowStockSettings.reorderQuantity}
                      onChange={(e) => setLowStockSettings(prev => ({
                        ...prev,
                        reorderQuantity: parseInt(e.target.value)
                      }))}
                      min="1"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={lowStockSettings.emailAlerts}
                      onChange={(e) => setLowStockSettings(prev => ({
                        ...prev,
                        emailAlerts: e.target.checked
                      }))}
                    />
                    <span className="toggle-switch"></span>
                    Email Alerts for Low Stock
                  </label>
                  <small>Receive email notifications when products are low in stock</small>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowLowStockModal(false)}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={updateLowStockSettings}>
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorInventoryAdvanced;