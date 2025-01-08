import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ProductCard from "./ProductCard";
import { apiClient } from '../utils/api';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id: currentProductId } = useParams();

    // Get recommended products based on screen size
    const getVisibleProductCount = () => {
        const width = window.innerWidth;
        if (width >= 1200) return 4;
        if (width >= 768) return 3;
        if (width >= 576) return 2;
        return 1;
    };

    // Fetch products and filter recommendations
    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const products = await apiClient.get('/products');
            
            // Filter out current product and get random products
            const filteredProducts = products
                .filter(product => product.id !== parseInt(currentProductId))
                // Get products from the same category if possible
                .sort((a, b) => {
                    if (a.categoryId === products.find(p => p.id === parseInt(currentProductId))?.categoryId) return -1;
                    if (b.categoryId === products.find(p => p.id === parseInt(currentProductId))?.categoryId) return 1;
                    return Math.random() - 0.5;
                })
                .slice(0, getVisibleProductCount());

            setRecommendations(filteredProducts);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();

        // Handle window resize
        const handleResize = () => {
            fetchRecommendations();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentProductId]); // Re-fetch when product ID changes

    if (loading || recommendations.length === 0) {
        return null;
    }

    return (
        <Container>
            <Row>
                {recommendations.map((product) => (
                    <Col
                        key={product.id}
                        xs={12} 
                        sm={6} 
                        md={4} 
                        lg={3}
                        className="d-flex justify-content-center align-items-center p-3"
                        style={{ backgroundColor: 'white' }}
                    >
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Recommendations;