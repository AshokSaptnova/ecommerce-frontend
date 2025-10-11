import React, { useState, useEffect, useCallback } from 'react';
import Toast from '../../../shared/components/Toast';
import '../../styles/VendorOrders.css';

const STATUS_BUTTONS = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

const PAYMENT_OPTIONS = [
  { value: '', label: 'All Payments' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' }
];

const SORTABLE_FIELDS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'total_amount', label: 'Order Total' },
  { value: 'status', label: 'Order Status' },
  { value: 'payment_status', label: 'Payment Status' }
];

const VendorOrders = ({ vendorData }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    payment_status: '',
    date_from: '',
    date_to: ''
  });
  const [sortOptions, setSortOptions] = useState({ by: 'created_at', order: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [paymentCounts, setPaymentCounts] = useState({});

  const normalizeOrder = useCallback((order) => ({
    ...order,
    items: order.items || order.order_items || [],
    status: (order.status || 'pending').toLowerCase(),
    payment_status: (order.payment_status || 'pending').toLowerCase()
  }), []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    setInfoMessage('');

    if (!vendorData?.id) {
      setOrders([]);
      setTotalRecords(0);
      setTotalPages(0);
      setStatusCounts({});
      setPaymentCounts({});
      setLoading(false);
      setInfoMessage('Vendor profile not loaded. Please refresh the page.');
      return;
    }

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

      const accessToken = localStorage.getItem('vendorToken');
      const response = await fetch(`http://127.0.0.1:8000/vendors/${vendorData.id}/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const normalizedItems = (data.items || []).map(normalizeOrder);
        setOrders(normalizedItems);

        const meta = data.meta || {};
        setTotalRecords(meta.total || 0);
        setTotalPages(meta.pages || 0);
        if (meta.page && meta.page !== page) {
          setPage(meta.page);
        }
        if (meta.page_size && meta.page_size !== pageSize) {
          setPageSize(meta.page_size);
        }
        setStatusCounts(meta.status_counts || {});
        setPaymentCounts(meta.payment_status_counts || {});

        if ((meta.total || 0) === 0) {
          setInfoMessage('No orders found for your catalog yet.');
        }
      } else {
        let message = `Unable to fetch orders (status ${response.status})`;
        try {
          const payload = await response.json();
          if (payload?.detail) {
            message = Array.isArray(payload.detail)
              ? payload.detail.map((item) => item.msg || item).join(', ')
              : payload.detail;
          }
        } catch (_) {
          // ignore parse errors
        }
        setError(message);
        setOrders([]);
        setTotalRecords(0);
        setTotalPages(0);
        setStatusCounts({});
        setPaymentCounts({});
      }
    } catch (err) {
      console.error('Error fetching vendor orders:', err);
      setError('Network error fetching orders. Please try again.');
      setOrders([]);
      setTotalRecords(0);
      setTotalPages(0);
      setStatusCounts({});
      setPaymentCounts({});
    } finally {
      setLoading(false);
    }
  }, [vendorData, page, pageSize, sortOptions, filters, normalizeOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const accessToken = localStorage.getItem('vendorToken');
      
      if (!vendorData?.id) {
        setToast({ 
          message: 'Vendor profile not loaded', 
          type: 'error' 
        });
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/vendors/${vendorData.id}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        
        setToast({ 
          message: `Order status updated to ${newStatus.toUpperCase()}`, 
          type: 'success' 
        });
        
        // Refetch orders to get updated counts from backend
        fetchOrders();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.detail || 'Failed to update order status';
        setToast({ 
          message: `Error: ${message}`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setToast({ 
        message: 'Network error: Unable to update order status', 
        type: 'error' 
      });
    }
  };

  const handleStatusFilterChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setPage(1);
  };

  const handlePaymentFilterChange = (event) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, payment_status: value }));
    setPage(1);
  };

  const handleDateChange = (key) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ status: '', payment_status: '', date_from: '', date_to: '' });
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

  const handlePageSizeChange = (event) => {
    const value = Number(event.target.value) || 10;
    setPageSize(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    if (totalPages && newPage > totalPages) return;
    setPage(newPage);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9500',
      processing: '#007aff',
      shipped: '#5856d6',
      delivered: '#11998e',
      cancelled: '#ff3b30'
    };
    return colors[status] || '#6e6e73';
  };

  const formatCurrency = (value) => Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const getVendorItems = (order) => (order.items || []).filter(
    (item) => item.product?.vendor_id === vendorData?.id
  );

  const getVendorOrderTotal = (order) => getVendorItems(order).reduce((total, item) => {
    const unitPrice = item.unit_price ?? item.price ?? 0;
    return total + unitPrice * item.quantity;
  }, 0);

  const totalRevenue = orders.reduce((sum, order) => sum + getVendorOrderTotal(order), 0);

  const startItem = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = totalRecords === 0 ? 0 : Math.min(startItem + orders.length - 1, totalRecords);

  const hasActiveFilters = Boolean(
    filters.status || filters.payment_status || filters.date_from || filters.date_to
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="vendor-orders">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="page-header">
        <h1>Orders Management</h1>
        <p>Track and manage your orders</p>
      </div>

      {error && (
        <div className="orders-error">
          <span role="img" aria-label="warning">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!error && infoMessage && (
        <div className="orders-info">
          <span role="img" aria-label="info">ℹ️</span>
          <p>{infoMessage}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{totalRecords}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{statusCounts['pending'] || 0}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <h3>{statusCounts['processing'] || 0}</h3>
            <p>Processing</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{statusCounts['shipped'] || 0}</h3>
            <p>Shipped</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{statusCounts['delivered'] || 0}</h3>
            <p>Delivered</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{formatCurrency(totalRevenue)}</h3>
            <p>Revenue (Current Page)</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <h3>{paymentCounts['completed'] || 0}</h3>
            <p>Payments Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🕒</div>
          <div className="stat-content">
            <h3>{paymentCounts['pending'] || 0}</h3>
            <p>Payments Pending</p>
          </div>
        </div>
      </div>

      {/* Status Toggle Filters */}
      <div className="orders-filters">
        {STATUS_BUTTONS.map(({ value, label }) => (
          <button
            key={value || 'all'}
            className={filters.status === value ? 'active' : ''}
            onClick={() => handleStatusFilterChange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="orders-advanced-filters">
        <div className="filter-control">
          <label>Payment Status</label>
          <select value={filters.payment_status} onChange={handlePaymentFilterChange}>
            {PAYMENT_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-control">
          <label>From Date</label>
          <input type="date" value={filters.date_from} onChange={handleDateChange('date_from')} />
        </div>
        <div className="filter-control">
          <label>To Date</label>
          <input type="date" value={filters.date_to} onChange={handleDateChange('date_to')} />
        </div>
        <div className="filter-control">
          <label>Sort By</label>
          <select value={sortOptions.by} onChange={handleSortByChange}>
            {SORTABLE_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>{field.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-control">
          <label>Sort Order</label>
          <select value={sortOptions.order} onChange={handleSortOrderChange}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
        <div className="filter-control filter-actions">
          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => {
            const vendorItems = getVendorItems(order);
            const vendorTotal = getVendorOrderTotal(order);

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order {order.order_number ? `#${order.order_number}` : `#${order.id}`}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div
                    className="order-status"
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {(order.status || '').toUpperCase()}
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span className="label">Customer:</span>
                    <span className="value">{order.customer_name || order.user?.full_name || `User #${order.user_id || 'Guest'}`}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{order.customer_email || order.user?.email || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Amount:</span>
                    <span className="value price">₹{formatCurrency(vendorTotal)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Payment Status:</span>
                    <span className="value">{(order.payment_status || 'pending').toUpperCase()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Items:</span>
                    <span className="value">
                      {vendorItems.length > 0
                        ? vendorItems.map((item) => `${item.product_name || item.product?.name || 'Product'} × ${item.quantity}`).join(', ')
                        : 'No items for your catalog'}
                    </span>
                  </div>
                </div>

                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button className="btn-view">View Details</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No orders found</h2>
          <p>
            {filters.status
              ? `No ${filters.status} orders at the moment`
              : 'You don\'t have any orders yet'}
          </p>
        </div>
      )}

      {/* Pagination */}
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
    </div>
  );
};

export default VendorOrders;
