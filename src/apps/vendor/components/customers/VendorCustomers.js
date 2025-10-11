import React, { useState, useEffect } from 'react';
import '../../styles/VendorCustomers.css';

const VendorCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    returningCustomers: 0,
    averageOrderValue: 0
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockCustomers = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        email: 'rajesh.k@email.com',
        phone: '+91 98765 43210',
        totalOrders: 15,
        totalSpent: 45600,
        lastOrderDate: '2024-03-15',
        status: 'active',
        customerSince: '2023-06-12',
        city: 'Mumbai',
        preferredCategory: 'Electronics'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 87654 32109',
        totalOrders: 8,
        totalSpent: 23400,
        lastOrderDate: '2024-03-20',
        status: 'active',
        customerSince: '2023-09-15',
        city: 'Delhi',
        preferredCategory: 'Fashion'
      },
      {
        id: 3,
        name: 'Amit Patel',
        email: 'amit.patel@email.com',
        phone: '+91 76543 21098',
        totalOrders: 3,
        totalSpent: 8900,
        lastOrderDate: '2024-02-28',
        status: 'inactive',
        customerSince: '2024-01-10',
        city: 'Ahmedabad',
        preferredCategory: 'Home & Garden'
      },
      {
        id: 4,
        name: 'Sneha Reddy',
        email: 'sneha.reddy@email.com',
        phone: '+91 65432 10987',
        totalOrders: 22,
        totalSpent: 67800,
        lastOrderDate: '2024-03-18',
        status: 'vip',
        customerSince: '2022-11-05',
        city: 'Hyderabad',
        preferredCategory: 'Beauty'
      },
      {
        id: 5,
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '+91 54321 09876',
        totalOrders: 12,
        totalSpent: 34500,
        lastOrderDate: '2024-03-10',
        status: 'active',
        customerSince: '2023-04-20',
        city: 'Jaipur',
        preferredCategory: 'Sports'
      }
    ];

    setCustomers(mockCustomers);
    setCustomerStats({
      totalCustomers: mockCustomers.length,
      newThisMonth: mockCustomers.filter(c => new Date(c.customerSince) > new Date('2024-03-01')).length,
      returningCustomers: mockCustomers.filter(c => c.totalOrders > 1).length,
      averageOrderValue: mockCustomers.reduce((sum, c) => sum + (c.totalSpent / c.totalOrders), 0) / mockCustomers.length
    });
    setLoading(false);
  }, []);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleSendMessage = (customerId) => {
    alert(`Message feature for customer ${customerId} - Integration with email/SMS service needed`);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || customer.status === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-active', text: 'Active' },
      inactive: { class: 'status-inactive', text: 'Inactive' },
      vip: { class: 'status-vip', text: 'VIP' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return <div className="loading-spinner">Loading customers...</div>;
  }

  return (
    <div className="vendor-customers">
      <div className="customers-header">
        <h2>Customer Management</h2>
        <p>Manage your customer relationships and track customer insights</p>
      </div>

      {/* Customer Statistics */}
      <div className="customer-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{customerStats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>{customerStats.newThisMonth}</h3>
            <p>New This Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{customerStats.returningCustomers}</h3>
            <p>Returning Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{Math.round(customerStats.averageOrderValue)}</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="customers-controls">
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
          </select>
        </div>
        <div className="action-buttons">
          <button className="btn-secondary">Export Customer Data</button>
          <button className="btn-primary">Send Bulk Message</button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map(customer => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-since">Customer since {new Date(customer.customerSince).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div>{customer.email}</div>
                    <div className="phone">{customer.phone}</div>
                    <div className="city">{customer.city}</div>
                  </div>
                </td>
                <td>
                  <div className="order-count">{customer.totalOrders}</div>
                </td>
                <td>
                  <div className="total-spent">₹{customer.totalSpent.toLocaleString()}</div>
                </td>
                <td>
                  <div className="last-order">{new Date(customer.lastOrderDate).toLocaleDateString()}</div>
                </td>
                <td>
                  {getStatusBadge(customer.status)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewCustomer(customer)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      className="btn-message"
                      onClick={() => handleSendMessage(customer.id)}
                      title="Send Message"
                    >
                      💬
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages} ({filteredCustomers.length} customers)
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {/* Customer Detail Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowCustomerModal(false)}>
          <div className="modal-content customer-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customer Details</h3>
              <button className="close-btn" onClick={() => setShowCustomerModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="customer-detail-grid">
                <div className="customer-profile">
                  <div className="large-avatar">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4>{selectedCustomer.name}</h4>
                  {getStatusBadge(selectedCustomer.status)}
                </div>
                <div className="customer-details">
                  <div className="detail-group">
                    <label>Contact Information</label>
                    <p>📧 {selectedCustomer.email}</p>
                    <p>📱 {selectedCustomer.phone}</p>
                    <p>📍 {selectedCustomer.city}</p>
                  </div>
                  <div className="detail-group">
                    <label>Order History</label>
                    <p>Total Orders: {selectedCustomer.totalOrders}</p>
                    <p>Total Spent: ₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                    <p>Average Order: ₹{Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}</p>
                    <p>Last Order: {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</p>
                  </div>
                  <div className="detail-group">
                    <label>Preferences</label>
                    <p>Preferred Category: {selectedCustomer.preferredCategory}</p>
                    <p>Customer Since: {new Date(selectedCustomer.customerSince).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => handleSendMessage(selectedCustomer.id)}>
                Send Message
              </button>
              <button className="btn-primary">View Order History</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorCustomers;