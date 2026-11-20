# CampusKart – Student Second-Hand Marketplace

![CampusKart Banner](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80)

**CampusKart** is a modern, student-focused second-hand peer-to-peer marketplace designed specifically for university communities. It enables college students to discover, buy, sell, exchange, or give away textbooks, scientific calculators, dorm furniture, electronics, stationery, and other campus essentials within a trusted peer environment.

---

## 🚀 Key Features

### 1. Modern Responsive Homepage (`/`)
- Hero section with search bar, trending campus keywords, and live trust metrics.
- Category browser (Books & Textbooks, Electronics, Calculators, Furniture, Stationery, Sports, Other).
- **Featured Products** and **Recently Added** listings fetched live from MongoDB.
- 3-step **How It Works** guide and high-conversion **Sell Item** CTA banner.

### 2. Explore Marketplace (`/explore`)
- Instant multi-field search across titles, descriptions, categories, and seller names.
- Multi-facet filters:
  - **Category**: Books, Electronics, Furniture, Stationery, Sports, Other.
  - **Condition**: New, Like New, Good, Fair.
  - **Listing Type**: For Sale, Exchange, Free Giveaway.
  - **Price Range**: Min and Max custom price filters with quick preset buttons.
- Multi-mode sorting: Newest First, Price: Low to High, Price: High to Low.
- Synchronized URL params and active filter count tags with one-click reset.

### 3. Dynamic Product Details (`/product/[id]`)
- Multi-image gallery with thumbnail selection and aspect zoom.
- Dual-price negotiation indicator with formatted INR currency (`₹`).
- Student seller verification card and campus meetup location.
- **Save to Favorites**: Real-time heart button synchronized with cards and database.
- **Contact Seller Modal**: Form with validation sending queries to `POST /api/enquiries`.
- **Make an Offer Modal**: Price negotiation modal enforcing rules (> 0, ≤ asking price, For Sale only).
- Automatic restriction handling for Sold items and Free/Exchange listings.

### 4. Create Listing Portal (`/sell`)
- Dynamic image uploader with browser `FileReader` preview and quick campus presets.
- Comprehensive inline error validation using `<FormErrorMessage />`.
- Intelligent price handling: automatically sets ₹0 and disables pricing for Free Giveaways and Exchanges.
- Instant listing creation and automatic redirect to the published product.

### 5. Personal Wishlist (`/favorites`)
- Dedicated saved items page tracking bookmarked products across sessions.
- Direct remove action and instant navigation to product details.
- Header counter pill and badge counter on Navbar heart icon.
- Empty state with CTA to browse the explore page.

### 6. Comprehensive Seller Dashboard (`/dashboard`)
- **Dashboard Overview (`/dashboard`)**:
  - Live aggregated metrics from MongoDB: Total Listings, Active & Live, Sold Items, Pending Enquiries, Pending Offers, and Active Inventory Value.
  - Quick action cards and recent activity tables for listings, enquiries, and offers.
- **My Listings Manager (`/dashboard/listings`)**:
  - Dedicated listing management with search, status filtering, and sorting.
  - Direct actions: View, Edit listing, Mark as Sold / Relist, and Delete with safety modal.
- **Enquiries Manager (`/dashboard/enquiries`)**:
  - Review buyer enquiries with filter tabs (`All`, `Pending`, `Responded`, `Closed`).
  - Expandable messages with buyer email, meetup notes, and status update actions.
- **Offers Manager (`/dashboard/offers`)**:
  - Review buyer price proposals with calculated discount percentages.
  - **Safe Offer Acceptance**: Accepts the selected offer, marks the product as **Sold**, and automatically rejects other competing pending offers.
  - Rejection action preserves product availability.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict TSX/TS throughout) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) design system & primitives |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── dashboard/stats/route.ts  # GET: Aggregated seller analytics
│   │   ├── enquiries/
│   │   │   ├── route.ts              # GET & POST enquiries
│   │   │   └── [id]/route.ts         # PATCH enquiry status
│   │   ├── favorites/
│   │   │   ├── route.ts              # GET & POST favorites (duplicate prevention)
│   │   │   └── [id]/route.ts         # DELETE favorite
│   │   ├── offers/
│   │   │   ├── route.ts              # GET & POST price offers
│   │   │   └── [id]/route.ts         # PATCH offer status
│   │   └── products/
│   │       ├── route.ts              # GET (with filtering & auto-seed) & POST
│   │       ├── [id]/route.ts         # GET, PUT, DELETE product
│   │       └── migrate/route.ts      # One-time migration endpoint
│   ├── dashboard/
│   │   ├── layout.tsx                # Responsive sidebar & mobile navigation
│   │   ├── page.tsx                  # Dashboard overview & analytics
│   │   ├── enquiries/page.tsx        # Enquiries management
│   │   ├── listings/page.tsx         # My Listings management
│   │   └── offers/page.tsx           # Price offers & acceptance flow
│   ├── explore/page.tsx              # Marketplace catalog with search & filters
│   ├── favorites/page.tsx            # Saved items wishlist
│   ├── product/[id]/
│   │   ├── page.tsx                  # Dynamic product details
│   │   └── not-found.tsx             # Branded 404 page
│   ├── sell/page.tsx                 # Create product listing
│   ├── layout.tsx                    # Root layout with Providers & Navbar/Footer
│   └── page.tsx                      # Homepage
├── components/
│   ├── dashboard/                    # Edit modal, delete modal, listing cards
│   ├── favorites/                    # EmptyFavorites state
│   ├── home/                         # Hero, Categories, Featured, Recent, CTAs
│   ├── layout/                       # Navbar with badge counter & Footer
│   ├── products/                     # ProductCard, Gallery, Contact & Offer modals
│   ├── sell/                         # SellProductForm, ImageUploader, FormField
│   └── ui/                           # Button, Badge, Input, Card, FormErrorMessage
├── context/
│   ├── FavoritesContext.tsx          # Real-time favorites sync & localStorage fallback
│   └── ProductsContext.tsx           # Real-time products sync & CRUD state
├── lib/
│   ├── mongodb.ts                    # Global connection caching for Next.js hot-reloads
│   ├── sample-data.ts                # Default initial campus catalog
│   └── utils.ts                      # Price formatters & cn helpers
├── models/
│   ├── Enquiry.ts                    # Mongoose Enquiry schema
│   ├── Favorite.ts                   # Mongoose Favorite schema (compound unique index)
│   ├── Offer.ts                      # Mongoose Offer schema
│   └── Product.ts                    # Mongoose Product schema (indexes & validation)
└── types/
    └── index.ts                      # Strict TypeScript interfaces
```

---

## 📡 API Reference

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Query products with `q`, `category`, `condition`, `listingType`, `minPrice`, `maxPrice`, `sort` |
| `POST` | `/api/products` | Create a new product listing (validates required fields) |
| `GET` | `/api/products/:id` | Retrieve product by MongoDB `_id` or custom string ID |
| `PUT` | `/api/products/:id` | Update product fields |
| `DELETE` | `/api/products/:id` | Delete product listing |
| `POST` | `/api/products/migrate` | One-time migration endpoint from Phase 3 client storage |

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

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/nishit546/Student_Marketplace.git
cd Student_Marketplace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
# MongoDB Atlas URI (Recommended for cloud/deployment):
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campuskart?retryWrites=true&w=majority

# Or Local MongoDB instance:
# MONGODB_URI=mongodb://localhost:27017/campuskart
```

> **Note**: `.env.local` is listed in `.gitignore` and is never committed to Git. A clean template is provided in `.env.example`.

### 4. Run development server
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

## 🌐 Deployment on Vercel

1. Push all code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the `Student_Marketplace` repository.
4. In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
5. In **MongoDB Atlas**:
   - Go to **Network Access** → Click **Add IP Address** → Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel serverless functions can connect.
6. Click **Deploy**. Vercel will build and assign a live production URL.

---

## 👤 Demo Seller Profile

For evaluation and demonstration purposes, CampusKart utilizes a consistent demo seller identity:
- **Name**: Arnav Gupta
- **Email**: `arnav.gupta@college.edu`
- **Location**: Hostel Block B, Room 312
- **Department**: 3rd Year, Computer Science

---

## ⚠️ Known Limitations & Future Improvements

1. **Authentication**: Real user authentication (e.g. NextAuth.js or Clerk) is not yet integrated; seller identity uses a consistent demo account (`arnav.gupta@college.edu`) to ensure full testability.
2. **Cloud Storage**: Product images currently accept direct image URLs and Base64 previews; integrating Cloudinary or AWS S3 will provide dedicated image hosting.
3. **Database Transactions**: Multi-document transactions require a MongoDB replica set (such as MongoDB Atlas). A robust sequential alternative with verification has been implemented for standalone local MongoDB instances.
4. **Chat & Real-time WebSockets**: Buyer-seller communication currently operates via enquiries and offers with status workflows; real-time messaging can be added in subsequent releases.
