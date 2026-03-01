package com.shopsmart.product_service.loader;

import com.shopsmart.product_service.model.Product;
import com.shopsmart.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductDataLoader implements CommandLineRunner {
    
    private final ProductRepository productRepository;
    
    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            System.out.println("🔄 Loading products into database...");
            
            List<Product> products = Arrays.asList(
                new Product("1", "iPhone 15 Pro Max 256GB", "Apple", 134900.0, 159900.0, 16, 
                    4.8, 15234, 25, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
                    "Electronics", "Smartphones", "Bestseller",
                    "Experience the ultimate smartphone with A17 Pro chip", 
                    Arrays.asList("iphone", "apple", "smartphone")),
                
                new Product("2", "Samsung Galaxy S24 Ultra", "Samsung", 124999.0, 144999.0, 14,
                    4.7, 12456, 20, "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
                    "Electronics", "Smartphones", "Top Rated",
                    "Flagship Samsung smartphone with S Pen",
                    Arrays.asList("samsung", "galaxy", "smartphone")),
                
                new Product("13", "Premium Cotton Casual Shirt", "Allen Solly", 1299.0, 2499.0, 48,
                    4.3, 12345, 100, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
                    "Fashion", "Men", "Bestseller",
                    "Comfortable premium cotton casual shirt",
                    Arrays.asList("shirt", "casual", "men")),
                
                new Product("65", "Bluetooth Earbuds TWS", "Boat", 999.0, 2999.0, 67,
                    4.2, 56789, 200, "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
                    "Deals", "Audio", "Flash Sale",
                    "True wireless earbuds with deep bass",
                    Arrays.asList("earbuds", "tws", "bluetooth"))
            );
            
            productRepository.saveAll(products);
            System.out.println("✅ Loaded " + products.size() + " products successfully!");
        } else {
            System.out.println("ℹ️ Products already exist in database. Skipping data load.");
        }
    }
}