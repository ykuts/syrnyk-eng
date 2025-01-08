import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
//import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../../../config';

const ProductList = ({ products, onDelete, onEdit, onAddNew }) => {
  //const { t } = useTranslation();
  // State for tracking image loading errors
  const [imageErrors, setImageErrors] = useState({});

  /* // Helper function for forming image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Remove possible /uploads/ duplication
    const cleanPath = path.replace(/^\/uploads\//, '');
    return `${process.env.REACT_APP_API_URL}/uploads/${cleanPath}`;
  }; */

  // Default image URL
  const defaultImageUrl = '/placeholder.jpg';

  const handleImageError = (productId) => {
    if (!imageErrors[productId]) {
      setImageErrors(prev => ({
        ...prev,
        [productId]: true
      }));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <Button onClick={onAddNew}>Add Product</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Weight</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
              {product.image && !imageErrors[product.id] ? (
                <img 
                  src={getImageUrl(product.image, 'product')}
                  alt={product.name} 
                  style={{ height: '40px', width: '40px', objectFit: 'cover' }} 
                  onError={() => handleImageError(product.id)}
                />
              ) : (
                <img 
                  src={defaultImageUrl}
                  alt="Placeholder" 
                  style={{ height: '40px', width: '40px', objectFit: 'cover' }}
                />
              )}
              </td>
              <td>{product.name}</td>
              <td>{product.category?.name}</td>
              <td>{product.price} CHF</td>
              <td>{product.weight}</td>
              <td>{product.stock}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => onEdit(product)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductList;