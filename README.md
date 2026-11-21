# CampusKart – Student Second-Hand Marketplace

![CampusKart Banner](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80)

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_TSX-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_%2B_Mongoose-47a248?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-orange)](#license)

**CampusKart** is a modern, student-exclusive second-hand marketplace designed specifically for university communities. It provides a secure, peer-to-peer campus platform where students can buy, sell, exchange, or give away textbooks, scientific calculators, dorm furniture, electronics, stationery, and other academic essentials.

---

## 📌 Problem Statement

Every semester, college students face recurring challenges:
1. **High Textbook & Equipment Costs**: Purchasing new engineering textbooks, scientific calculators (e.g. Casio fx-991EX), and dorm essentials at retail prices creates a heavy financial burden.
2. **Post-Semester Waste**: Senior students frequently discard or abandon reusable books, lab instruments, and furniture due to the lack of an efficient local outlet.
3. **Friction with General Marketplaces**: Platforms like OLX, Quikr, or Facebook Marketplace involve strangers, shipping logistics, distance hurdles, scam risks, and lack campus-level trust.

---

## 💡 Solution Overview

**CampusKart** resolves this by confining discovery and transactions to the verified student community:
- **Zero Shipping & Zero Fees**: Transactions happen directly via safe, on-campus physical meetups (hostel blocks, department foyers, campus libraries).
- **Flexible Transaction Types**: Supports cash sales (`For Sale`), item swaps (`Exchange`), and zero-cost donations (`Free Giveaway`).
- **Structured Negotiations & Inquiries**: Buyers can submit price counter-offers or structured inquiries without public spam.
- **Unified Seller Control**: Complete dashboard tracking inventory, live offer acceptance (with automated competing-offer cleanup), and inquiry resolution.

---

## 🏗️ Architecture Overview

CampusKart is built on a full-stack Next.js architecture with serverless API Route Handlers and a MongoDB database layer connected through Mongoose.

```mermaid
graph TD
    Client["Client (Browser / React 19)"]
    Context["Global State (ProductsContext & FavoritesContext)"]
    API["Next.js Serverless Route Handlers (/api/*)"]
    Mongoose["Mongoose ODM Models (Product, Favorite, Enquiry, Offer)"]
    MongoDB[("MongoDB Database (Atlas / Local)")]

    Client -->|User Interactions| Context
    Context -->|Optimistic UI Updates| Client
    Context -->|HTTP Fetch / REST| API
    API -->|Schema Validation & Queries| Mongoose
    Mongoose -->|Connection Pool (lib/mongodb.ts)| MongoDB
    MongoDB -->|Query Results| Mongoose
    Mongoose -->|JSON Response| API
    API -->|Synchronized State| Context
```

### Data Flow Breakdown
1. **Client Request**: A student performs an action (e.g., searches, favorites an item, creates a listing, or makes an offer).
2. **Context Layer**: React Context (`ProductsContext`, `FavoritesContext`) triggers an **optimistic UI update** so interactions feel instant.
3. **API Route Handlers**: RESTful endpoints (`/api/products`, `/api/favorites`, `/api/enquiries`, `/api/offers`, `/api/dashboard/stats`) receive requests, validate request bodies, and enforce business rules (e.g., offer price ≤ asking price; prevent inquiries on sold products).
4. **Mongoose Models**: Schemas enforce types, string lengths, unique compound indexes (e.g., preventing duplicate favorites), and relationship references via `ObjectId`.
5. **Database**: Persistent documents are queried, updated, or created in MongoDB.

---

## 🗄️ Database Schema & Data Models

### 1. Product Model (`models/Product.ts`)
| Field | Type | Validation / Description |
|---|---|---|
| `name` | `String` | Required, 3–120 characters, indexed for full-text search |
| `description` | `String` | Required, min 10 characters, indexed for full-text search |
| `price` | `Number` | Required, min 0 (0 for Free/Exchange) |
| `category` | `String` | Required (Books, Electronics, Calculators, Furniture, etc.) |
| `condition` | `String` | Required (New, Like New, Good, Fair) |
| `listingType` | `String` | Enum: `For Sale`, `Exchange`, `Free` |
| `images` | `[String]` | Array of image URLs, validates at least 1 image |
| `seller` | `Subdocument` | Name, college email, hostel/room location, phone, avatar |
| `status` | `String` | Enum: `Available`, `Reserved`, `Sold` (default: `Available`) |
| `featured` | `Boolean` | Highlight flag for homepage display |
| `timestamps` | `Date` | Automatic `createdAt` and `updatedAt` |

### 2. Favorite Model (`models/Favorite.ts`)
| Field | Type | Validation / Description |
|---|---|---|
| `userId` | `String` | Indexed student identifier |
| `productId` | `ObjectId` | References `Product` model |
| `index` | `Compound` | `{ userId: 1, productId: 1 }` **UNIQUE** (prevents duplicate favorites) |

### 3. Enquiry Model (`models/Enquiry.ts`)
| Field | Type | Validation / Description |
|---|---|---|
| `product` | `ObjectId` | References `Product` model (blocked on sold items) |
| `buyerName` | `String` | Required, 2–80 characters |
| `buyerEmail` | `String` | Required, validated college email format |
| `message` | `String` | Required, min 10 characters |
| `status` | `String` | Enum: `Pending`, `Responded`, `Closed` |

### 4. Offer Model (`models/Offer.ts`)
| Field | Type | Validation / Description |
|---|---|---|
| `product` | `ObjectId` | References `Product` model (For Sale only, blocked on sold items) |
| `buyerName` | `String` | Required, 2–80 characters |
| `buyerEmail` | `String` | Required, validated college email format |
| `offeredPrice` | `Number` | Required, positive number, cannot exceed original price |
| `message` | `String` | Optional buyer negotiation note |
| `status` | `String` | Enum: `Pending`, `Accepted`, `Rejected` |

---

## 🚀 Key Features

### 1. Modern Responsive Homepage (`/`)
- Hero section with live keyword pills, search bar, and campus trust statistics.
- Interactive category directory with item count tags.
- Filterable **Featured Products** and **Recently Added** listings.
- 3-step **How CampusKart Works** guide.

### 2. Explore Marketplace (`/explore`)
- Real-time search across titles, descriptions, categories, and seller names.
- Multi-facet filters: Category, Condition, Listing Type (Sale, Exchange, Free), Min/Max Price.
- Multi-mode sorting: Newest First, Price: Low to High, Price: High to Low.
- Active filter badges and one-click filter reset.

### 3. Dynamic Product Details (`/product/[id]`)
- Multi-image gallery with thumbnail selection and aspect zoom.
- Student seller verification card and campus pickup location.
- **Contact Seller Modal**: Validated enquiry form saving to MongoDB.
- **Make an Offer Modal**: Price negotiation modal enforcing boundary rules.
- **Favorite Button**: Real-time heart button synchronized with cards and database.
- Sold item restrictions and Free/Exchange listing safeguards.

### 4. Sell Item Portal (`/sell`)
- Multi-photo image upload with client-side preview.
- Quick campus presets (Calculators, Textbooks, Electronics).
- Dynamic price toggling: sets ₹0 and disables price for Free Giveaways and Exchanges.
- Instant publishing with redirect to the newly created product.

### 5. Wishlist & Favorites (`/favorites`)
- Dedicated saved items page tracking bookmarked products across sessions.
- Direct remove action and instant navigation to product details.
- Header counter pill and badge counter on Navbar heart icon.
- Empty state with CTA to browse the explore page.

### 6. Seller Dashboard & Analytics (`/dashboard`)
- **Overview (`/dashboard`)**: Aggregated metrics (Total Listings, Active, Sold, Pending Enquiries, Pending Offers, Active Inventory Value in ₹) and recent activity widgets.
- **Listings Manager (`/dashboard/listings`)**: Product search, status filtering, editing modal, status toggle (Mark Sold / Relist), and deletion with confirmation.
- **Enquiries Manager (`/dashboard/enquiries`)**: Review buyer inquiries with filter tabs (`All`, `Pending`, `Responded`, `Closed`) and status updates.
- **Offers Manager (`/dashboard/offers`)**: Review price offers with calculated discount percentages.
  - **Safe Offer Acceptance**: Accepts the selected offer, marks the product as **Sold**, and automatically rejects other competing pending offers.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (v16.4 App Router) | React server components, serverless route handlers, fast client navigation |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety across components, models, and API responses |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS design system |
| **Components** | [shadcn/ui](https://ui.shadcn.com/) | Accessible, customizable UI component primitives |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent icons |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) | Document database with schema enforcement and connection caching |
| **Deployment** | [Vercel](https://vercel.com/) | Edge hosting, continuous deployment, and serverless runtime |

---

## 📡 API Reference

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Query products (`q`, `category`, `condition`, `listingType`, `minPrice`, `maxPrice`, `sort`) |
| `POST` | `/api/products` | Create a new listing with input validation |
| `GET` | `/api/products/:id` | Retrieve product by MongoDB `_id` or custom string ID |
| `PUT` | `/api/products/:id` | Update product fields |
| `DELETE` | `/api/products/:id` | Delete product listing |
| `POST` | `/api/products/migrate` | One-time migration endpoint from local client storage |

### Favorites
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/favorites` | Retrieve favorited products for the user |
| `POST` | `/api/favorites` | Add product to favorites (enforces compound unique index) |
| `DELETE` | `/api/favorites/:id` | Remove product from favorites by favorite ID or product ID |

### Enquiries
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/enquiries` | Query enquiries by `sellerEmail` or `productId` |
| `POST` | `/api/enquiries` | Submit enquiry (blocks enquiries on sold items) |
| `PATCH` | `/api/enquiries/:id` | Update enquiry status (`Pending`, `Responded`, `Closed`) |

### Offers
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/offers` | Query offers by `sellerEmail` or `productId` |
| `POST` | `/api/offers` | Propose offer (validates `0 < price <= asking`, For Sale only) |
| `PATCH` | `/api/offers/:id` | Update offer status (`Pending`, `Accepted`, `Rejected`) |

### Dashboard Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated metrics & recent activity for the seller |

---

## 📸 Application Screenshots

| Page | Description | Route |
|---|---|---|
| **1. Homepage** | Hero section with quick search, category cards, featured products, and how it works | `/` |
| **2. Explore Marketplace** | Multi-facet filtering (category, condition, type, price), sorting, and responsive product grid | `/explore` |
| **3. Product Details** | Multi-image gallery, student seller verification card, contact modal, offer modal, and favorite button | `/product/:id` |
| **4. Sell Product** | Listing creation form with image preview, campus presets, and inline validation | `/sell` |
| **5. Favorites Page** | Saved items wishlist with remove button, counter pill, and empty state | `/favorites` |
| **6. Seller Dashboard** | Overview statistics (listings, active, sold, enquiries, offers, active value) and recent tables | `/dashboard` |
| **7. My Listings** | Inventory manager with search, status filters, edit modal, and status toggles | `/dashboard/listings` |
| **8. Enquiries & Offers** | Review incoming buyer messages and manage price negotiations with acceptance flow | `/dashboard/enquiries` & `/dashboard/offers` |

> *Tip for academic evaluators: Run the application locally or on Vercel to inspect each live page.*

---

## 🚦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/nishit546/Student_Marketplace.git
cd Student_Marketplace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variable Setup
Create a `.env.local` file in the root directory (refer to `.env.example`):

```env
# MongoDB Connection String (MongoDB Atlas or Local MongoDB)
# Example Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campuskart?retryWrites=true&w=majority

# Example Local:
MONGODB_URI=mongodb://localhost:27017/campuskart
```

> **Security Note**: `.env.local` is listed in `.gitignore` and is never committed to Git.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Verification Commands
```bash
# Type check without emitting files
npx tsc --noEmit

# Lint check
npm run lint

# Production build
npm run build
```

---

## 🌐 MongoDB Atlas Setup

To connect CampusKart to a cloud database for production:

### 1. Create a MongoDB Atlas Cluster
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new organization / project (e.g. `CampusKart`).
3. Click **Create Deployment** and select the **M0 Free Tier** cluster in your preferred region.

### 2. Create a Database User
1. In the Atlas left navigation, go to **Security** → **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** authentication method:
   - **Username**: `campuskart_admin` (or your choice)
   - **Password**: Enter a secure password (avoid special characters like `@`, `:`, `/` or URL-encode them).
4. Under **Database User Privileges**, select **Read and write to any database**.
5. Click **Add User**.

### 3. Configure Network Access (Crucial for Vercel)
Vercel serverless functions use dynamic IP addresses across AWS regions. To allow Vercel to connect:
1. In the Atlas left navigation, go to **Security** → **Network Access**.
2. Click **Add IP Address**.
3. Select **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Click **Confirm**. *(Status will transition from "Pending" to "Active")*.

### 4. Obtain the Connection String
1. Go to **Deployments** → **Database** → click **Connect** next to your cluster.
2. Choose **Drivers** (Node.js, version 5.5 or later).
3. Copy the SRV connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user credentials.
5. Append `/campuskart` before `?retryWrites` to target the `campuskart` database:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campuskart?retryWrites=true&w=majority
   ```

---

## 🚀 Vercel Deployment Guide

Follow these steps to deploy CampusKart publicly:

### 1. Push All Code to GitHub
Ensure all latest code and production fixes are committed and pushed:
```bash
git add .
git commit -m "Prepare CampusKart for deployment"
git push origin main
```

### 2. Import Repository into Vercel
1. Navigate to [Vercel](https://vercel.com/) and click **Log in** (choose **Continue with GitHub**).
2. On your Vercel Dashboard, click **Add New...** → **Project**.
3. Locate `Student_Marketplace` from the GitHub repository list and click **Import**.

### 3. Configure the Project
1. **Project Name**: `campuskart` (or keep default).
2. **Framework Preset**: Confirm **Next.js** is automatically detected.
3. **Root Directory**: `./` (leave default).
4. **Build and Output Settings**: Leave defaults (`npm run build`).

### 4. Add Environment Variables
Expand the **Environment Variables** section:
- **Key**: `MONGODB_URI`
- **Value**: Your full MongoDB Atlas connection string (e.g. `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campuskart?retryWrites=true&w=majority`)
- **Environments**: Check all three: **Production**, **Preview**, and **Development**.
- Click **Add**.

### 5. Deploy & Verify
1. Click **Deploy**.
2. Vercel will initiate the build pipeline:
   - Installing dependencies (`npm install`)
   - Type-checking with TypeScript
   - Prerendering static and serverless dynamic API routes
3. Once completed (approx. 60–90 seconds), Vercel displays the celebration screen with your live production URL (e.g. `https://campuskart.vercel.app`).
4. Click **Visit** to open your live marketplace!

---

## 👤 Demo Seller Profile

For demonstration and testing purposes, the application includes a pre-configured student seller identity:
- **Name**: Arnav Gupta
- **Email**: `arnav.gupta@college.edu`
- **Location**: Hostel Block B, Room 312
- **Department**: 3rd Year, Computer Science

---

## ⚠️ Known Limitations & Future Improvements

1. **Authentication**: Real user authentication (NextAuth.js or Clerk) is planned for the next major version; the platform currently uses a consistent demo account (`arnav.gupta@college.edu`) to ensure frictionless testing.
2. **Cloud Storage**: Product images accept URLs and Base64 previews; integrating Cloudinary or AWS S3 will provide dedicated asset storage.
3. **Database Transactions**: Multi-document transactions require a MongoDB replica set (such as MongoDB Atlas). A robust sequential alternative with verification has been implemented for standalone local MongoDB instances.
4. **Chat & Real-time WebSockets**: Buyer-seller communication currently operates via enquiries and offers with status workflows; real-time messaging can be added in subsequent releases.

---

## 📄 License

This project is licensed under the MIT License.
