"use client";

import { useState, useEffect } from "react";
import { useNexus } from "@/hooks/useNexus";
import { EventLog } from "@/components/EventLog";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
}

export default function Products() {
  const { trackEvent } = useNexus();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    trackEvent("page_view", {
      page: "products",
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
    });

    // Generate sample products
    const sampleProducts: Product[] = [
      { id: "1", name: "Wireless Headphones", price: 99.99, category: "electronics", rating: 4.5, image: "🎧", description: "High-quality wireless headphones with noise cancellation" },
      { id: "2", name: "Smart Watch", price: 199.99, category: "electronics", rating: 4.3, image: "⌚", description: "Feature-rich smartwatch with health tracking" },
      { id: "3", name: "Laptop Stand", price: 49.99, category: "accessories", rating: 4.7, image: "💻", description: "Adjustable laptop stand for ergonomic setup" },
      { id: "4", name: "Coffee Mug", price: 19.99, category: "home", rating: 4.2, image: "☕", description: "Insulated coffee mug with temperature control" },
      { id: "5", name: "Yoga Mat", price: 29.99, category: "fitness", rating: 4.6, image: "🧘", description: "Non-slip yoga mat for home workouts" },
      { id: "6", name: "Bluetooth Speaker", price: 79.99, category: "electronics", rating: 4.4, image: "🔊", description: "Portable Bluetooth speaker with deep bass" },
      { id: "7", name: "Desk Lamp", price: 39.99, category: "home", rating: 4.1, image: "💡", description: "LED desk lamp with adjustable brightness" },
      { id: "8", name: "Running Shoes", price: 89.99, category: "fitness", rating: 4.8, image: "👟", description: "Comfortable running shoes for daily use" },
    ];

    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, [trackEvent]);

  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    trackEvent("product_search", {
      search_term: term,
      timestamp: new Date().toISOString(),
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    trackEvent("category_filter", {
      category,
      previous_category: selectedCategory,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    trackEvent("sort_change", {
      sort_by: sort,
      previous_sort: sortBy,
      timestamp: new Date().toISOString(),
    });
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    trackEvent("view_mode_change", {
      view_mode: mode,
      previous_mode: viewMode,
      timestamp: new Date().toISOString(),
    });
  };

  const handleProductClick = (product: Product) => {
    trackEvent("product_view", {
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      product_price: product.price,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAddToCart = (product: Product) => {
    trackEvent("add_to_cart", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      timestamp: new Date().toISOString(),
    });
    alert(`${product.name} added to cart!`);
  };

  const categories = ["all", "electronics", "accessories", "home", "fitness"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Browse and discover amazing products</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`px-3 py-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`px-3 py-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div className={`${viewMode === "list" ? "flex-shrink-0 w-32" : ""}`}>
                <div className={`${viewMode === "list" ? "h-32" : "h-48"} bg-gray-100 flex items-center justify-center text-4xl`}>
                  {product.image}
                </div>
              </div>
              <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <h3 
                  className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => handleProductClick(product)}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">${product.price}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        <div className="mt-8 text-center text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Event Log */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Events</h3>
          <EventLog />
        </div>
      </div>
    </div>
  );
}
