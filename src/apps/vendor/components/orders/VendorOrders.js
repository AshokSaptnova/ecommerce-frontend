import React, { useState, useEffect, useCallback } from 'react';
import Toast from '../../../shared/components/Toast';
import { vendorApi } from '../../services/vendorApi';
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      const data = await vendorApi.getOrders(vendorData.id, params.toString(), accessToken);
      
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
    } catch (err) {
      console.error('Error fetching vendor orders:', err);
      setError(err.message || 'Network error fetching orders. Please try again.');
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

      await vendorApi.updateOrderStatus(vendorData.id, orderId, newStatus, accessToken);
      
      setToast({ 
        message: `Order status updated to ${newStatus.toUpperCase()}`, 
        type: 'success' 
      });
      
      // Refetch orders to get updated counts from backend
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setToast({ 
        message: error.message || 'Network error: Unable to update order status', 
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

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const vendorItems = getVendorItems(order);
                const vendorTotal = getVendorOrderTotal(order);

                return (
                  <tr key={order.id}>
                    <td className="order-id">
                      #{order.order_number || `ORD-${order.id}`}
                    </td>
                    <td className="customer-info">
                      <div className="customer-name">
                        {order.customer_name || order.user?.full_name || 'Guest'}
                      </div>
                      <div className="customer-email">
                        {order.customer_email || order.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="order-items">
                      {vendorItems.length} item{vendorItems.length !== 1 ? 's' : ''}
                    </td>
                    <td className="order-total">
                      ₹{formatCurrency(vendorTotal)}
                    </td>
                    <td className="order-status">
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                          border: `1px solid ${getStatusColor(order.status)}40`
                        }}
                      >
                        {(order.status || 'pending').toUpperCase()}
                      </span>
                    </td>
                    <td className="order-actions">
                      <button 
                        className="btn-view"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleStatusChange(order.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="status-select"
                      >
                        <option value="">Update Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.order_number || selectedOrder.id}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="order-details-modal">
                {/* Customer Info */}
                <div className="info-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customer_name || selectedOrder.user?.full_name || 'Guest'}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email || selectedOrder.user?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone || 'Not provided'}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <p><strong>Status:</strong> 
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: `${getStatusColor(selectedOrder.status)}20`,
                        color: getStatusColor(selectedOrder.status),
                        marginLeft: '8px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px'
                      }}
                    >
                      {(selectedOrder.status || 'pending').toUpperCase()}
                    </span>
                  </p>
                  <p><strong>Payment Method:</strong> {selectedOrder.payment_method || 'N/A'}</p>
                  <p><strong>Payment Status:</strong> {(selectedOrder.payment_status || 'pending').toUpperCase()}</p>
                </div>

                {/* Vendor Items */}
                <div className="info-section">
                  <h4>Your Items in This Order</h4>
                  <div className="order-items-list">
                    {getVendorItems(selectedOrder).map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-details">
                          <h5>{item.product_name || item.product?.name || 'Product'}</h5>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ₹{formatCurrency(item.unit_price ?? item.price ?? 0)}</p>
                          <p><strong>Subtotal: ₹{formatCurrency(((item.unit_price ?? item.price ?? 0) * item.quantity))}</strong></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vendor Order Summary */}
                <div className="info-section">
                  <h4>Your Order Summary</h4>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Your Items:</span>
                      <span>{getVendorItems(selectedOrder).length}</span>
                    </div>
                    <div className="summary-row total">
                      <span><strong>Your Total:</strong></span>
                      <span><strong>₹{formatCurrency(getVendorOrderTotal(selectedOrder))}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="info-section">
                  <h4>Shipping Address</h4>
                  <div className="address-block">
                    {selectedOrder.shipping_address ? (
                      <>
                        <p>{selectedOrder.shipping_address.street_address}</p>
                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}</p>
                        <p>{selectedOrder.shipping_address.country}</p>
                      </>
                    ) : (
                      <p>No shipping address provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
