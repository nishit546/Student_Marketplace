# CampusKart Backend Module

This folder contains all backend services, database schemas, and RESTful API route handlers for the CampusKart student marketplace platform.

---

## 📁 Directory Structure

```text
backend/
├── api/                     # RESTful API Route Handlers
│   ├── dashboard/stats/     # GET: Aggregated seller metrics & recent activity
│   ├── enquiries/           # GET & POST enquiries; PATCH /api/enquiries/[id]
│   ├── favorites/           # GET & POST favorites; DELETE /api/favorites/[id]
│   ├── offers/              # GET & POST offers; PATCH /api/offers/[id] (Safe acceptance)
│   └── products/            # GET, POST, PUT, DELETE products; POST /migrate
├── lib/
│   ├── mongodb.ts           # Cached Mongoose connection pool & DNS fallback resolver
│   ├── sample-data.ts       # Default initial product catalog
│   └── utils.ts             # Price formatting and time helpers
└── models/                  # Mongoose Database Models
    ├── Enquiry.ts           # Buyer-seller enquiry schema
    ├── Favorite.ts          # Wishlist schema with compound unique index
    ├── Offer.ts             # Price negotiation schema with boundary validation
    └── Product.ts           # Product listing schema with full-text search indexes
```

---

## 📡 API Endpoints Summary

- **Products**: `/api/products`, `/api/products/[id]`, `/api/products/migrate`
- **Favorites**: `/api/favorites`, `/api/favorites/[id]`
- **Enquiries**: `/api/enquiries`, `/api/enquiries/[id]`
- **Offers**: `/api/offers`, `/api/offers/[id]`
- **Dashboard Analytics**: `/api/dashboard/stats`

---

## 🗄️ Database

- **Database Engine**: MongoDB Atlas / Local MongoDB
- **ODM**: Mongoose 9.x
- **Connection Configuration**: Managed via `MONGODB_URI` environment variable.
