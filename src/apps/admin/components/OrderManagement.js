import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/adminApi';
import Toast from '../../shared/components/Toast';
import '../styles/AdminShared.css';
import '../styles/OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    payment_status: '',
    date_from: '',
    date_to: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOptions, setSortOptions] = useState({
    by: 'created_at',
    order: 'desc'
  });

  const token = localStorage.getItem('adminToken');

  const normalizeOrder = useCallback((order) => ({
    ...order,
    items: order.items || order.order_items || [],
    status: (order.status || 'pending').toLowerCase(),
    payment_status: (order.payment_status || 'pending').toLowerCase(),
  }), []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());
      params.append('sort_by', sortOptions.by);
      params.append('sort_order', sortOptions.order);
      if (filters.status) params.append('status', filters.status);
      if (filters.payment_status) params.append('payment_status', filters.payment_status);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);

      const data = await adminApi.getOrders(params.toString(), token);
      const normalizedItems = (data.items || []).map(normalizeOrder);
      setOrders(normalizedItems);

      const meta = data.meta || {};
      setTotalRecords(meta.total || 0);
      setTotalPages(meta.pages || 0);
      if (meta.page && meta.page !== page) {
        setPage(meta.page);
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, sortOptions, token, normalizeOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    if (totalPages && newPage > totalPages) return;
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value) || 10;
    setPageSize(newSize);
    setPage(1);
  };

  const handleSortByChange = (event) => {
    const value = event.target.value;
    setSortOptions((prev) => ({ ...prev, by: value }));
    setPage(1);
  };

  const handleSortOrderChange = (event) => {
    const value = event.target.value;
    setSortOptions((prev) => ({ ...prev, order: value }));
    setPage(1);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus, token);
      
      setToast({ 
        message: `Order status updated to ${newStatus.toUpperCase()}`, 
        type: 'success' 
      });
      
      // Refetch orders to get updated data
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setToast({ 
        message: 'Network error: Unable to update order status', 
        type: 'error' 
      });
    }
  };

  const getStatusColor = (status) => {
    const statusKey = (status || '').toLowerCase();
    switch (statusKey) {
      case 'pending': return '#ff9500';
      case 'processing': return '#007aff';
      case 'shipped': return '#5856d6';
      case 'delivered': return '#34c759';
      case 'cancelled': return '#ff3b30';
      default: return '#6e6e73';
    }
  };

  const calculateOrderTotal = (order) => {
    const items = order.items || order.order_items || [];
    return items.reduce((total, item) => {
      const unitPrice = item.unit_price ?? item.price ?? 0;
      return total + (unitPrice * item.quantity);
    }, 0) || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusCounts = orders.reduce((acc, order) => {
    const key = (order.status || 'pending').toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = orders.reduce((total, order) => total + calculateOrderTotal(order), 0);

  const startItem = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = totalRecords === 0 ? 0 : Math.min(startItem + orders.length - 1, totalRecords);

  const formatStatus = (status) => (status ? status.toUpperCase() : 'PENDING');

  const renderAddress = (address) => {
    if (!address) {
      return <p>No address provided.</p>;
    }

    const fields = [
      { key: 'full_name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'address_line_1', label: 'Address Line 1' },
      { key: 'address_line_2', label: 'Address Line 2' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'postal_code', label: 'Postal Code' },
      { key: 'country', label: 'Country' }
    ];

    return fields.map(({ key, label }) => (
      <p key={key}><strong>{label}:</strong> {address[key] || '—'}</p>
    ));
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-management">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="page-header">
        <h2>Order Management</h2>
        <p>Manage all customer orders across vendors</p>
      </div>

      {/* Quick Stats */}
      <div className="order-stats">
        <div className="stat-item">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="stat-item">
          <span>Pending</span>
          <strong>{statusCounts['pending'] || 0}</strong>
        </div>
        <div className="stat-item">
          <span>Processing</span>
          <strong>{statusCounts['processing'] || 0}</strong>
        </div>
        <div className="stat-item">
          <span>Delivered</span>
          <strong>{statusCounts['delivered'] || 0}</strong>
        </div>
        <div className="stat-item">
          <span>Total Revenue</span>
          <strong>₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Order Status:</label>
          <select
            value={filters.status}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, status: value }));
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Payment Status:</label>
          <select
            value={filters.payment_status}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, payment_status: value }));
              setPage(1);
            }}
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From Date:</label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, date_from: value }));
              setPage(1);
            }}
          />
        </div>

        <div className="filter-group">
          <label>To Date:</label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, date_to: value }));
              setPage(1);
            }}
          />
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortOptions.by} onChange={handleSortByChange}>
            <option value="created_at">Date Created</option>
            <option value="total_amount">Order Total</option>
            <option value="status">Status</option>
            <option value="payment_status">Payment Status</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort Order:</label>
          <select value={sortOptions.order} onChange={handleSortOrderChange}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">#{order.order_number || order.id}</td>
                <td className="customer-info">
                  <div>
                    <strong>{order.customer_name || order.user?.full_name || 'Guest Checkout'}</strong>
                    <span>{order.customer_email || order.user?.email || 'N/A'}</span>
                    {!order.user_id && order.session_id && (
                      <span className="session-id">Session: {order.session_id}</span>
                    )}
                  </div>
                </td>
                <td>{formatDate(order.created_at)}</td>
                <td>{(order.items || []).length} items</td>
                <td className="total">₹{calculateOrderTotal(order).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                      border: `1px solid ${getStatusColor(order.status)}40`
                    }}
                  >
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="actions">
                  <div className="action-buttons">
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="btn-view"
                    >
                      View
                    </button>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleStatusUpdate(order.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="status-select"
                    >
                      <option value="">Update Status</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <div className="pagination-info">
          {totalRecords > 0 ? (
            <span>
              Showing {startItem}-{endItem} of {totalRecords} orders
            </span>
          ) : (
            <span>No orders to display</span>
          )}
        </div>
        <div className="pagination-actions">
          <label className="page-size-select">
            Rows per page:
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
          <div className="pagination-buttons">
            <button onClick={() => handlePageChange(1)} disabled={page <= 1}>
              « First
            </button>
            <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              ‹ Prev
            </button>
            <span className="pagination-page">
              Page {totalPages > 0 ? `${page} of ${totalPages}` : page}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={totalPages > 0 ? page >= totalPages : orders.length < pageSize}
            >
              Next ›
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={totalPages <= 1 || page >= totalPages}
            >
              Last »
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.id}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                {/* Customer Info */}
                <div className="info-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customer_name || selectedOrder.user?.full_name || 'Guest Checkout'}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email || selectedOrder.user?.email || 'Not provided'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone || 'Not provided'}</p>
                  <p><strong>Order Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                  <p><strong>Status:</strong> 
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: `${getStatusColor(selectedOrder.status)}20`,
                        color: getStatusColor(selectedOrder.status),
                        marginLeft: '8px'
                      }}
                    >
                      {formatStatus(selectedOrder.status)}
                    </span>
                  </p>
                  <p><strong>Payment Method:</strong> {selectedOrder.payment_method || 'N/A'}</p>
                  <p><strong>Payment Status:</strong> {formatStatus(selectedOrder.payment_status)}</p>
                </div>

                {/* Order Items */}
                <div className="info-section">
                  <h4>Order Items</h4>
                  <div className="order-items">
                    {(selectedOrder.items || []).map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-details">
                          <h5>{item.product_name || item.product?.name || 'Product'}</h5>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ₹{(item.unit_price ?? item.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p><strong>Subtotal: ₹{(((item.unit_price ?? item.price ?? 0) * item.quantity) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="info-section">
                  <h4>Order Summary</h4>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Total Items:</span>
                      <span>{(selectedOrder.items || []).length}</span>
                    </div>
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{(selectedOrder.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>₹{(selectedOrder.tax_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>₹{(selectedOrder.shipping_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="summary-row">
                      <span>Discount:</span>
                      <span>₹{(selectedOrder.discount_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="summary-row total">
                      <span><strong>Total Amount:</strong></span>
                      <span><strong>₹{(selectedOrder.total_amount || calculateOrderTotal(selectedOrder)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="info-section">
                  <h4>Shipping Address</h4>
                  <div className="address-block">
                    {renderAddress(selectedOrder.shipping_address)}
                  </div>
                </div>

                <div className="info-section">
                  <h4>Billing Address</h4>
                  <div className="address-block">
                    {renderAddress(selectedOrder.billing_address || selectedOrder.shipping_address)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="no-data">
          <p>No orders found matching the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;