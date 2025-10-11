import React, { useState, useEffect } from 'react';
import '../../styles/VendorShipping.css';

const VendorShipping = ({ vendorData }) => {
  const [shippingZones, setShippingZones] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [courierPartners, setCourierPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const [zoneFormData, setZoneFormData] = useState({
    name: '',
    regions: [],
    base_rate: 0,
    per_kg_rate: 0,
    free_shipping_threshold: 0,
    estimated_delivery_days: 3,
    is_active: true
  });

  const [methodFormData, setMethodFormData] = useState({
    name: '',
    type: 'standard',
    base_rate: 0,
    per_kg_rate: 0,
    estimated_delivery_days: 3,
    tracking_enabled: true,
    insurance_available: false,
    is_active: true
  });

  const token = localStorage.getItem('vendorToken');

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  useEffect(() => {
    fetchShippingData();
  }, []);

  const fetchShippingData = async () => {
    try {
      const [zonesRes, methodsRes, couriersRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/vendor/shipping/zones', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/vendor/shipping/methods', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/vendor/shipping/couriers', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (zonesRes.ok) {
        const zones = await zonesRes.json();
        setShippingZones(zones);
      }

      if (methodsRes.ok) {
        const methods = await methodsRes.json();
        setShippingMethods(methods);
      }

      if (couriersRes.ok) {
        const couriers = await couriersRes.json();
        setCourierPartners(couriers);
      }
    } catch (error) {
      console.error('Error fetching shipping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleZoneSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = selectedZone 
        ? `http://127.0.0.1:8000/vendor/shipping/zones/${selectedZone.id}`
        : 'http://127.0.0.1:8000/vendor/shipping/zones';
      
      const method = selectedZone ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(zoneFormData)
      });

      if (response.ok) {
        alert(`Shipping zone ${selectedZone ? 'updated' : 'created'} successfully!`);
        setShowZoneModal(false);
        resetZoneForm();
        fetchShippingData();
      } else {
        alert('Failed to save shipping zone');
      }
    } catch (error) {
      alert('Error saving shipping zone');
    }
  };

  const handleMethodSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = selectedMethod 
        ? `http://127.0.0.1:8000/vendor/shipping/methods/${selectedMethod.id}`
        : 'http://127.0.0.1:8000/vendor/shipping/methods';
      
      const method = selectedMethod ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(methodFormData)
      });

      if (response.ok) {
        alert(`Shipping method ${selectedMethod ? 'updated' : 'created'} successfully!`);
        setShowMethodModal(false);
        resetMethodForm();
        fetchShippingData();
      } else {
        alert('Failed to save shipping method');
      }
    } catch (error) {
      alert('Error saving shipping method');
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (!window.confirm('Are you sure you want to delete this shipping zone?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/vendor/shipping/zones/${zoneId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Shipping zone deleted successfully!');
        fetchShippingData();
      } else {
        alert('Failed to delete shipping zone');
      }
    } catch (error) {
      alert('Error deleting shipping zone');
    }
  };

  const openZoneModal = (zone = null) => {
    setSelectedZone(zone);
    if (zone) {
      setZoneFormData({
        name: zone.name,
        regions: zone.regions || [],
        base_rate: zone.base_rate,
        per_kg_rate: zone.per_kg_rate,
        free_shipping_threshold: zone.free_shipping_threshold || 0,
        estimated_delivery_days: zone.estimated_delivery_days,
        is_active: zone.is_active
      });
    } else {
      resetZoneForm();
    }
    setShowZoneModal(true);
  };

  const openMethodModal = (method = null) => {
    setSelectedMethod(method);
    if (method) {
      setMethodFormData({
        name: method.name,
        type: method.type,
        base_rate: method.base_rate,
        per_kg_rate: method.per_kg_rate,
        estimated_delivery_days: method.estimated_delivery_days,
        tracking_enabled: method.tracking_enabled,
        insurance_available: method.insurance_available,
        is_active: method.is_active
      });
    } else {
      resetMethodForm();
    }
    setShowMethodModal(true);
  };

  const resetZoneForm = () => {
    setZoneFormData({
      name: '',
      regions: [],
      base_rate: 0,
      per_kg_rate: 0,
      free_shipping_threshold: 0,
      estimated_delivery_days: 3,
      is_active: true
    });
    setSelectedZone(null);
  };

  const resetMethodForm = () => {
    setMethodFormData({
      name: '',
      type: 'standard',
      base_rate: 0,
      per_kg_rate: 0,
      estimated_delivery_days: 3,
      tracking_enabled: true,
      insurance_available: false,
      is_active: true
    });
    setSelectedMethod(null);
  };

  const handleRegionToggle = (state) => {
    setZoneFormData(prev => ({
      ...prev,
      regions: prev.regions.includes(state)
        ? prev.regions.filter(r => r !== state)
        : [...prev.regions, state]
    }));
  };

  if (loading) {
    return <div className="loading">Loading shipping settings...</div>;
  }

  return (
    <div className="vendor-shipping">
      <div className="page-header">
        <h2>🚚 Shipping & Logistics</h2>
        <p>Manage shipping zones, methods, and courier integrations</p>
      </div>

      {/* Shipping Overview */}
      <div className="shipping-overview">
        <div className="overview-card zones">
          <div className="card-icon">🌍</div>
          <div className="card-content">
            <h3>Shipping Zones</h3>
            <div className="card-value">{shippingZones.length}</div>
            <div className="card-subtitle">Active zones configured</div>
          </div>
          <button 
            className="card-action"
            onClick={() => openZoneModal()}
          >
            + Add Zone
          </button>
        </div>

        <div className="overview-card methods">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Shipping Methods</h3>
            <div className="card-value">{shippingMethods.length}</div>
            <div className="card-subtitle">Methods available</div>
          </div>
          <button 
            className="card-action"
            onClick={() => openMethodModal()}
          >
            + Add Method
          </button>
        </div>

        <div className="overview-card couriers">
          <div className="card-icon">🚛</div>
          <div className="card-content">
            <h3>Courier Partners</h3>
            <div className="card-value">{courierPartners.length}</div>
            <div className="card-subtitle">Integrated partners</div>
          </div>
          <button className="card-action">
            + Add Partner
          </button>
        </div>

        <div className="overview-card automation">
          <div className="card-icon">⚡</div>
          <div className="card-content">
            <h3>Automation</h3>
            <div className="card-value">85%</div>
            <div className="card-subtitle">Orders auto-processed</div>
          </div>
          <button className="card-action">
            Configure
          </button>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="shipping-section">
        <h3>🌍 Shipping Zones</h3>
        {shippingZones.length > 0 ? (
          <div className="zones-grid">
            {shippingZones.map((zone) => (
              <div key={zone.id} className="zone-card">
                <div className="zone-header">
                  <h4>{zone.name}</h4>
                  <div className="zone-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => openZoneModal(zone)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteZone(zone.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="zone-details">
                  <div className="zone-regions">
                    <strong>Regions:</strong> {zone.regions?.join(', ') || 'Not specified'}
                  </div>
                  <div className="zone-pricing">
                    <div>Base Rate: ₹{zone.base_rate}</div>
                    <div>Per Kg: ₹{zone.per_kg_rate}</div>
                  </div>
                  <div className="zone-delivery">
                    <span>🕒 {zone.estimated_delivery_days} days</span>
                    {zone.free_shipping_threshold > 0 && (
                      <span>🆓 Free above ₹{zone.free_shipping_threshold}</span>
                    )}
                  </div>
                  <div className={`zone-status ${zone.is_active ? 'active' : 'inactive'}`}>
                    {zone.is_active ? '✅ Active' : '❌ Inactive'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No shipping zones configured yet. Create your first zone to start shipping!</p>
            <button className="btn-primary" onClick={() => openZoneModal()}>
              Create First Zone
            </button>
          </div>
        )}
      </div>

      {/* Shipping Methods */}
      <div className="shipping-section">
        <h3>📦 Shipping Methods</h3>
        {shippingMethods.length > 0 ? (
          <div className="methods-list">
            {shippingMethods.map((method) => (
              <div key={method.id} className="method-card">
                <div className="method-header">
                  <div className="method-info">
                    <h4>{method.name}</h4>
                    <span className={`method-type ${method.type}`}>
                      {method.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="method-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => openMethodModal(method)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
                <div className="method-details">
                  <div className="method-pricing">
                    <span>Base: ₹{method.base_rate}</span>
                    <span>Per Kg: ₹{method.per_kg_rate}</span>
                    <span>Delivery: {method.estimated_delivery_days} days</span>
                  </div>
                  <div className="method-features">
                    {method.tracking_enabled && <span className="feature">📍 Tracking</span>}
                    {method.insurance_available && <span className="feature">🛡️ Insurance</span>}
                  </div>
                  <div className={`method-status ${method.is_active ? 'active' : 'inactive'}`}>
                    {method.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No shipping methods configured. Add methods to offer different delivery options!</p>
            <button className="btn-primary" onClick={() => openMethodModal()}>
              Add First Method
            </button>
          </div>
        )}
      </div>

      {/* Zone Modal */}
      {showZoneModal && (
        <div className="modal-overlay" onClick={() => setShowZoneModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedZone ? 'Edit Shipping Zone' : 'Add New Shipping Zone'}</h3>
              <button className="modal-close" onClick={() => setShowZoneModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleZoneSubmit} className="zone-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Zone Name *</label>
                  <input
                    type="text"
                    value={zoneFormData.name}
                    onChange={(e) => setZoneFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="e.g., Metro Cities"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Base Shipping Rate (₹) *</label>
                  <input
                    type="number"
                    value={zoneFormData.base_rate}
                    onChange={(e) => setZoneFormData(prev => ({...prev, base_rate: parseFloat(e.target.value)}))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rate Per Kg (₹) *</label>
                  <input
                    type="number"
                    value={zoneFormData.per_kg_rate}
                    onChange={(e) => setZoneFormData(prev => ({...prev, per_kg_rate: parseFloat(e.target.value)}))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Delivery Days *</label>
                  <input
                    type="number"
                    value={zoneFormData.estimated_delivery_days}
                    onChange={(e) => setZoneFormData(prev => ({...prev, estimated_delivery_days: parseInt(e.target.value)}))}
                    min="1"
                    max="30"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    value={zoneFormData.free_shipping_threshold}
                    onChange={(e) => setZoneFormData(prev => ({...prev, free_shipping_threshold: parseFloat(e.target.value)}))}
                    min="0"
                    step="0.01"
                    placeholder="0 for no free shipping"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Select Regions/States</label>
                  <div className="regions-selector">
                    {indianStates.map((state) => (
                      <label key={state} className="region-checkbox">
                        <input
                          type="checkbox"
                          checked={zoneFormData.regions.includes(state)}
                          onChange={() => handleRegionToggle(state)}
                        />
                        <span>{state}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={zoneFormData.is_active}
                      onChange={(e) => setZoneFormData(prev => ({...prev, is_active: e.target.checked}))}
                    />
                    <span className="toggle-switch"></span>
                    Zone is Active
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowZoneModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {selectedZone ? 'Update Zone' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Method Modal */}
      {showMethodModal && (
        <div className="modal-overlay" onClick={() => setShowMethodModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedMethod ? 'Edit Shipping Method' : 'Add New Shipping Method'}</h3>
              <button className="modal-close" onClick={() => setShowMethodModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleMethodSubmit} className="method-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Method Name *</label>
                  <input
                    type="text"
                    value={methodFormData.name}
                    onChange={(e) => setMethodFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="e.g., Express Delivery"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Method Type *</label>
                  <select
                    value={methodFormData.type}
                    onChange={(e) => setMethodFormData(prev => ({...prev, type: e.target.value}))}
                    required
                  >
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="overnight">Overnight</option>
                    <option value="same_day">Same Day</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Base Rate (₹) *</label>
                  <input
                    type="number"
                    value={methodFormData.base_rate}
                    onChange={(e) => setMethodFormData(prev => ({...prev, base_rate: parseFloat(e.target.value)}))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rate Per Kg (₹) *</label>
                  <input
                    type="number"
                    value={methodFormData.per_kg_rate}
                    onChange={(e) => setMethodFormData(prev => ({...prev, per_kg_rate: parseFloat(e.target.value)}))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Days *</label>
                  <input
                    type="number"
                    value={methodFormData.estimated_delivery_days}
                    onChange={(e) => setMethodFormData(prev => ({...prev, estimated_delivery_days: parseInt(e.target.value)}))}
                    min="1"
                    max="30"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <div className="checkbox-group">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={methodFormData.tracking_enabled}
                        onChange={(e) => setMethodFormData(prev => ({...prev, tracking_enabled: e.target.checked}))}
                      />
                      <span className="toggle-switch"></span>
                      Enable Tracking
                    </label>

                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={methodFormData.insurance_available}
                        onChange={(e) => setMethodFormData(prev => ({...prev, insurance_available: e.target.checked}))}
                      />
                      <span className="toggle-switch"></span>
                      Insurance Available
                    </label>

                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={methodFormData.is_active}
                        onChange={(e) => setMethodFormData(prev => ({...prev, is_active: e.target.checked}))}
                      />
                      <span className="toggle-switch"></span>
                      Method is Active
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowMethodModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {selectedMethod ? 'Update Method' : 'Create Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorShipping;