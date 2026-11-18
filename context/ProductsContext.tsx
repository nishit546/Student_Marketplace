"use client";

import * as React from "react";
import { Product } from "@/types";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

export interface ProductsContextType {
  products: Product[];
  myListings: Product[];
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "status"> & {
      id?: string;
      status?: "Available" | "Reserved" | "Sold";
    }
  ) => Promise<Product>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  markAsSold: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
  isLoaded: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = "campuskart_custom_products";
const SOLD_STATUS_KEY = "campuskart_status_overrides";
const MIGRATED_KEY = "campuskart_migrated";

// Default demo seller
export const DEMO_USER = {
  name: "Arnav Gupta",
  email: "arnav.gupta@college.edu",
  college: "Hostel Block B, Room 312",
  year: "3rd Year, Computer Science",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
  phone: "+91 98765 43210",
};

const ProductsContext = React.createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>(SAMPLE_PRODUCTS);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Helper to load fallback products from localStorage + sample data
  const loadFallbackProducts = React.useCallback((): Product[] => {
    try {
      const storedCustom = localStorage.getItem(STORAGE_KEY);
      const storedStatus = localStorage.getItem(SOLD_STATUS_KEY);

      let customList: Product[] = [];
      let statusMap: Record<string, "Available" | "Reserved" | "Sold"> = {};

      if (storedCustom) customList = JSON.parse(storedCustom);
      if (storedStatus) statusMap = JSON.parse(storedStatus);

      const updatedSample = SAMPLE_PRODUCTS.map((p) => {
        const id = p.id || p._id || "";
        return statusMap[id] ? { ...p, status: statusMap[id] } : p;
      });

      const updatedCustom = customList.map((p) => {
        const id = p.id || p._id || "";
        return statusMap[id] ? { ...p, status: statusMap[id] } : p;
      });

      return [...updatedCustom, ...updatedSample];
    } catch {
      return SAMPLE_PRODUCTS;
    }
  }, []);

  // Fetch all products from MongoDB API
  const refreshProducts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const formatted: Product[] = json.data.map((item: Record<string, unknown>) => {
          const docId = (item.id || item._id || "") as string;
          return {
            ...item,
            id: docId,
            _id: docId,
          } as unknown as Product;
        });

        setProducts(formatted);
        return;
      }

      // If empty or unexpected response, use fallback
      setProducts(loadFallbackProducts());
    } catch (err) {
      console.warn("MongoDB API connection not active, using fallback local storage:", err);
      setProducts(loadFallbackProducts());
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [loadFallbackProducts]);

  // Initial load & automatic one-time migration from Phase 3 localStorage
  React.useEffect(() => {
    const initAndMigrate = async () => {
      try {
        const hasMigrated = localStorage.getItem(MIGRATED_KEY);
        const storedCustom = localStorage.getItem(STORAGE_KEY);

        if (!hasMigrated && storedCustom) {
          const customList: Product[] = JSON.parse(storedCustom);
          if (Array.isArray(customList) && customList.length > 0) {
            try {
              const migrateRes = await fetch("/api/products/migrate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: customList }),
              });
              if (migrateRes.ok) {
                localStorage.setItem(MIGRATED_KEY, "true");
              }
            } catch {
              // Ignore network failure during migration attempt
            }
          }
        }
      } catch (err) {
        console.error("Migration error:", err);
      }

      await refreshProducts();
    };

    initAndMigrate();
  }, [refreshProducts]);

  // Add a new product via POST /api/products
  const addProduct = async (
    newProdData: Omit<Product, "id" | "createdAt" | "status"> & {
      id?: string;
      status?: "Available" | "Reserved" | "Sold";
    }
  ): Promise<Product> => {
    const tempId = newProdData.id || `prod-${Date.now()}`;
    const optimisticProduct: Product = {
      ...newProdData,
      id: tempId,
      _id: tempId,
      status: newProdData.status || "Available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setProducts((prev) => [optimisticProduct, ...prev]);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdData.name,
          description: newProdData.description,
          price: newProdData.price,
          category: newProdData.category,
          condition: newProdData.condition,
          listingType: newProdData.listingType,
          images: newProdData.images,
          seller: newProdData.seller,
          location: newProdData.location,
          status: newProdData.status || "Available",
          featured: Boolean(newProdData.featured),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const serverProduct: Product = {
            ...result.data,
            id: result.data.id || result.data._id || tempId,
            _id: result.data._id || result.data.id || tempId,
          };

          // Update local state with real MongoDB _id
          setProducts((prev) =>
            prev.map((p) => (p.id === tempId ? serverProduct : p))
          );

          // Update backup storage
          try {
            const storedCustom = localStorage.getItem(STORAGE_KEY);
            const currentList: Product[] = storedCustom ? JSON.parse(storedCustom) : [];
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify([serverProduct, ...currentList.filter((p) => p.id !== tempId)])
            );
          } catch {
            // Ignore storage quotas
          }

          return serverProduct;
        }
      }
    } catch (err) {
      console.warn("API POST failed, keeping local copy:", err);
    }

    // Backup to localStorage if offline
    try {
      const storedCustom = localStorage.getItem(STORAGE_KEY);
      const currentList: Product[] = storedCustom ? JSON.parse(storedCustom) : [];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([optimisticProduct, ...currentList])
      );
    } catch {
      // Ignore storage quotas
    }

    return optimisticProduct;
  };

  // Update existing product via PUT /api/products/[id]
  const updateProduct = async (
    id: string,
    updatedFields: Partial<Product>
  ): Promise<boolean> => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => {
        const pId = p.id || p._id;
        if (pId === id) {
          return {
            ...p,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Call API
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.warn("API PUT failed, saving locally:", err);
    }

    // Keep localStorage in sync as backup
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

      if (updatedFields.status) {
        const storedStatus = localStorage.getItem(SOLD_STATUS_KEY);
        const statusMap = storedStatus ? JSON.parse(storedStatus) : {};
        statusMap[id] = updatedFields.status;
        localStorage.setItem(SOLD_STATUS_KEY, JSON.stringify(statusMap));
      }
    } catch {
      // Ignore storage errors
    }

    return true;
  };

  // Delete product via DELETE /api/products/[id]
  const deleteProduct = async (id: string): Promise<boolean> => {
    // Optimistic UI removal
    setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));

    // Call API
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("API DELETE failed:", err);
    }

    // Keep localStorage in sync
    try {
      const storedCustom = localStorage.getItem(STORAGE_KEY);
      if (storedCustom) {
        const currentList: Product[] = JSON.parse(storedCustom);
        const updatedList = currentList.filter((p) => (p.id || p._id) !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }

      const storedStatus = localStorage.getItem(SOLD_STATUS_KEY);
      if (storedStatus) {
        const statusMap = JSON.parse(storedStatus);
        delete statusMap[id];
        localStorage.setItem(SOLD_STATUS_KEY, JSON.stringify(statusMap));
      }
    } catch {
      // Ignore storage errors
    }

    return true;
  };

  // Mark product as sold
  const markAsSold = (id: string): Promise<boolean> => {
    return updateProduct(id, { status: "Sold" });
  };

  // Look up product by id
  const getProductById = React.useCallback(
    (id: string): Product | undefined => {
      return products.find((p) => (p.id || p._id) === id);
    },
    [products]
  );

  // My listings
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
        refreshProducts,
        isLoaded,
        isLoading,
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
