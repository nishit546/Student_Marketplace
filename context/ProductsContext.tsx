"use client";

import * as React from "react";
import { Product } from "@/types";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

interface ProductsContextType {
  products: Product[];
  myListings: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt" | "status"> & { id?: string; status?: "Available" | "Reserved" | "Sold" }) => Product;
  updateProduct: (id: string, updatedFields: Partial<Product>) => boolean;
  deleteProduct: (id: string) => boolean;
  markAsSold: (id: string) => boolean;
  getProductById: (id: string) => Product | undefined;
  isLoaded: boolean;
}

const STORAGE_KEY = "campuskart_custom_products";
const SOLD_STATUS_KEY = "campuskart_status_overrides";

// Default demo seller
export const DEMO_USER = {
  name: "Arnav Gupta",
  email: "arnav.gupta@college.edu",
  college: "Hostel Block B, Room 312",
  year: "3rd Year, Computer Science",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
  phone: "+91 98765 43210",
};

const ProductsContext = React.createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>(SAMPLE_PRODUCTS);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Initialize and merge sample products with localStorage
  React.useEffect(() => {
    try {
      const storedCustom = localStorage.getItem(STORAGE_KEY);
      const storedStatus = localStorage.getItem(SOLD_STATUS_KEY);

      let customList: Product[] = [];
      let statusMap: Record<string, "Available" | "Reserved" | "Sold"> = {};

      if (storedCustom) {
        customList = JSON.parse(storedCustom);
      }
      if (storedStatus) {
        statusMap = JSON.parse(storedStatus);
      }

      // Merge sample products with status overrides
      const updatedSample = SAMPLE_PRODUCTS.map((p) => {
        const id = p.id || p._id || "";
        if (statusMap[id]) {
          return { ...p, status: statusMap[id] };
        }
        return p;
      });

      // Combine custom list (newest first) + sample products
      // Ensure custom items also receive status overrides if any
      const updatedCustom = customList.map((p) => {
        const id = p.id || p._id || "";
        if (statusMap[id]) {
          return { ...p, status: statusMap[id] };
        }
        return p;
      });

      setProducts([...updatedCustom, ...updatedSample]);
    } catch (err) {
      console.error("Failed to load products from localStorage", err);
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Add a new product
  const addProduct = (
    newProdData: Omit<Product, "id" | "createdAt" | "status"> & { id?: string; status?: "Available" | "Reserved" | "Sold" }
  ): Product => {
    const newId = newProdData.id || `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      _id: newId,
      status: newProdData.status || "Available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Save to localStorage custom list
    try {
      const storedCustom = localStorage.getItem(STORAGE_KEY);
      const currentList: Product[] = storedCustom ? JSON.parse(storedCustom) : [];
      const updatedList = [newProduct, ...currentList];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.error("Failed to save product to localStorage", err);
    }

    return newProduct;
  };

  // Update existing product
  const updateProduct = (id: string, updatedFields: Partial<Product>): boolean => {
    let updated = false;

    setProducts((prev) =>
      prev.map((p) => {
        const pId = p.id || p._id;
        if (pId === id) {
          updated = true;
          return {
            ...p,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Also update custom localStorage list if it is a custom product
    try {
      const storedCustom = localStorage.getItem(STORAGE_KEY);
      if (storedCustom) {
        const currentList: Product[] = JSON.parse(storedCustom);
        const updatedList = currentList.map((p) => {
          const pId = p.id || p._id;
          if (pId === id) {
            return { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
          }
          return p;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }

      // If status changed, save to status overrides map
      if (updatedFields.status) {
        const storedStatus = localStorage.getItem(SOLD_STATUS_KEY);
        const statusMap = storedStatus ? JSON.parse(storedStatus) : {};
        statusMap[id] = updatedFields.status;
        localStorage.setItem(SOLD_STATUS_KEY, JSON.stringify(statusMap));
      }
    } catch (err) {
      console.error("Failed to update product in localStorage", err);
    }

    return updated;
  };

  // Delete product
  const deleteProduct = (id: string): boolean => {
    setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));

    try {
      // Remove from custom list
      const storedCustom = localStorage.getItem(STORAGE_KEY);
      if (storedCustom) {
        const currentList: Product[] = JSON.parse(storedCustom);
        const updatedList = currentList.filter((p) => (p.id || p._id) !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }

      // Also clean up any status overrides
      const storedStatus = localStorage.getItem(SOLD_STATUS_KEY);
      if (storedStatus) {
        const statusMap = JSON.parse(storedStatus);
        delete statusMap[id];
        localStorage.setItem(SOLD_STATUS_KEY, JSON.stringify(statusMap));
      }
    } catch (err) {
      console.error("Failed to delete product from localStorage", err);
    }

    return true;
  };

  // Mark product as sold
  const markAsSold = (id: string): boolean => {
    return updateProduct(id, { status: "Sold" });
  };

  // Look up product by id
  const getProductById = React.useCallback(
    (id: string): Product | undefined => {
      return products.find((p) => (p.id || p._id) === id);
    },
    [products]
  );

  // My listings: products created by demo seller OR first sample product for demonstration
  const myListings = React.useMemo(() => {
    return products.filter(
      (p) =>
        p.seller.email === DEMO_USER.email ||
        p.seller.name.toLowerCase() === DEMO_USER.name.toLowerCase() ||
        p.id === "prod-1" ||
        p._id === "prod-1"
    );
  }, [products]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        myListings,
        addProduct,
        updateProduct,
        deleteProduct,
        markAsSold,
        getProductById,
        isLoaded,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = React.useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}

