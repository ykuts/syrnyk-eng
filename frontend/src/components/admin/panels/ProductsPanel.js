import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import ProductList from './ProductsPanelsComp/ProductList';
import ProductForm from './ProductsPanelsComp/ProductForm';
import { apiClient } from '../../../utils/api';
//import { useTranslation } from 'react-i18next';

const ProductsPanel = () => {
  //const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/products');
      setProducts(data);
    } catch (err) {
      setError('Error loading products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiClient.get('/categories');
      setCategories(data);
    } catch (err) {
      setError('Error loading categories');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const product = products.find(p => p.id === id);
    
    // Delete main image and additional images if they exist
    if (product.image || (product.images && product.images.length > 0)) {
      const allImages = [product.image, ...(product.images || [])].filter(Boolean);
      
      for (const imagePath of allImages) {
        const filename = imagePath.split('/').pop();
        try {
          await apiClient.delete(`/upload/products/${filename}`);
        } catch (err) {
          console.error('Error deleting image:', imagePath, err);
        }
      }
    }

        await apiClient.delete(`/products/${id}`);
        await fetchProducts();
    } catch (err) {
      setError('Error deleting product');
      console.error(err);
    }
  };

  // Opening the form for editing
  const handleEdit = (product) => {
    const cleanedProduct = {
      ...product,
      image: product.image ? product.image.replace(/^\/+/, '') : '',
      images: (product.images || []).map(img => img.replace(/^\/+/, ''))
    };

    setSelectedProduct(cleanedProduct);
    setShowModal(true);
  };

  // Creating or updating a product
  const handleSave = async (productData) => {
    setLoading(true);
    try {
      if (selectedProduct) {
        // Use PUT instead of POST for updates
        await apiClient.put(`/products/${selectedProduct.id}`, productData);
    } else {
        await apiClient.post('/products/add', productData);
    }
    
    await fetchProducts();
    setShowModal(false);
    setSelectedProduct(null);
    } catch (err) {
      setError('Error saving product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !products.length) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <ProductList
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onAddNew={() => {
          setSelectedProduct(null);
          setShowModal(true);
        }}
      />

      <ProductForm
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
        product={selectedProduct}
        categories={categories}
        loading={loading}
      />
    </Container>
  );
};

export default ProductsPanel;