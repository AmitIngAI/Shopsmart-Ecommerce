package com.shopsmart.product_service.service;

import com.shopsmart.product_service.model.Product;
import com.shopsmart.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(String id, Product product) {
        product.setId(id);
        return productRepository.save(product);
    }
    
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }
    
    public List<Product> getFeaturedProducts() {
        return productRepository.findByRatingGreaterThanEqual(4.5);
    }
    
    public List<Product> getProductsByTag(String tag) {
        return productRepository.findByTag(tag);
    }
    
    public List<Product> getDeals() {
        return productRepository.findByDiscountGreaterThan(30);
    }
}