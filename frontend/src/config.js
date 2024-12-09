export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/default-product.png';
    if (imagePath.startsWith('http')) return imagePath;
    
    const cleanPath = imagePath
        .replace(/^\/uploads\//, '')
        .replace(/^products\//, '');
        
    return `${API_URL}/uploads/products/${cleanPath}`;
  
};

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
};