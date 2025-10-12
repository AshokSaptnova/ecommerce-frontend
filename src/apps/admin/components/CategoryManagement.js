import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminShared.css';
import '../styles/CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: null
  });

  const token = localStorage.getItem('adminToken');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('${config.api.baseUrl}/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Fetch categories error:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = modalMode === 'add' 
        ? '${config.api.baseUrl}/admin/categories'
        : `http://127.0.0.1:8000/admin/categories/${selectedCategory.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCategories();
        handleCloseModal();
        alert(`Category ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
      } else {
        alert(`Failed to ${modalMode} category`);
      }
    } catch (error) {
      alert(`Error ${modalMode === 'add' ? 'creating' : 'updating'} category`);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchCategories();
        alert('Category deleted successfully!');
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      alert('Error deleting category');
    }
  };

  const handleAddCategory = () => {
    setModalMode('add');
    setFormData({ name: '', description: '', parent_id: null });
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setModalMode('edit');
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id
    });
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', description: '', parent_id: null });
    setSelectedCategory(null);
  };

  const getCategoryProducts = (categoryId) => {
    // This would typically come from the API
    return categories.find(c => c.id === categoryId)?.product_count || 0;
  };

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="category-management">
      <div className="page-header">
        <h2>Category Management</h2>
        <p>Organize your product catalog with categories</p>
        <button onClick={handleAddCategory} className="btn-primary">
          Add New Category
        </button>
      </div>

      {/* Quick Stats */}
      <div className="category-stats">
        <div className="stat-item">
          <span>Total Categories</span>
          <strong>{categories.length}</strong>
        </div>
        <div className="stat-item">
          <span>Parent Categories</span>
          <strong>{categories.filter(c => !c.parent_id).length}</strong>
        </div>
        <div className="stat-item">
          <span>Subcategories</span>
          <strong>{categories.filter(c => c.parent_id).length}</strong>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Categories Table */}
      <div className="categories-table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Parent Category</th>
              <th>Products</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="category-name">
                  <strong>{category.name}</strong>
                </td>
                <td className="description">
                  {category.description || 'No description'}
                </td>
                <td className="parent">
                  {category.parent_id 
                    ? categories.find(c => c.id === category.parent_id)?.name || 'Unknown'
                    : 'Root Category'
                  }
                </td>
                <td className="products-count">
                  {getCategoryProducts(category.id)} products
                </td>
                <td>{new Date(category.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditCategory(category)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'Add New Category' : 'Edit Category'}</h3>
              <button onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Parent Category</label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({...formData, parent_id: e.target.value || null})}
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter(c => c.id !== selectedCategory?.id) // Don't show self as parent
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {modalMode === 'add' ? 'Create Category' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className="no-data">
          <p>No categories found. Create your first category to get started.</p>
          <button onClick={handleAddCategory} className="btn-primary">
            Add First Category
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;