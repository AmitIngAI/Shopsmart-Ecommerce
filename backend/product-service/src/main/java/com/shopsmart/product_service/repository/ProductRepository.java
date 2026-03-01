package com.shopsmart.product_service.repository;

import com.shopsmart.product_service.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    List<Product> findByCategory(String category);
    
    List<Product> findByCategoryAndSubcategory(String category, String subcategory);
    
    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'brand': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'keywords': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Product> searchProducts(String keyword);
    
    List<Product> findByRatingGreaterThanEqual(Double rating);
    
    List<Product> findByTag(String tag);
    
    List<Product> findByDiscountGreaterThan(Integer discount);
}