package com.shopsmart.product_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String brand;
    private Double price;
    private Double mrp;
    private Integer discount;
    private Double rating;
    private Integer reviews;
    private Integer stock;
    private String image;
    private String category;
    private String subcategory;
    private String tag;
    private String description;
    private List<String> keywords;
}