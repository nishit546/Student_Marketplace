# CampusKart – Student Second-Hand Marketplace

![CampusKart Banner](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80)

**CampusKart** is a modern, student-focused second-hand marketplace designed specifically for university communities. Students can discover, buy, sell, exchange, or give away used textbooks, scientific calculators, dorm furniture, electronics, stationery, and other college essentials with fellow campus peers.

---

## 🚀 Key Features

### 1. Modern Responsive Homepage (`/`)
- Hero section with quick-search bar, trending keyword pills, and campus trust statistics.
- Interactive category directory (Books, Electronics, Furniture, Stationery, Sports, Other).
- Filterable **Featured Products** and **Recently Added** listings.
- 3-step **How CampusKart Works** campus workflow guide.
- High-conversion Call-to-Action for student sellers.

### 2. Explore Marketplace (`/explore`)
- Real-time search across product titles, descriptions, categories, and sellers.
- Multi-facet sidebar filters:
  - **Category**: Books, Electronics, Furniture, Stationery, Sports, Other
  - **Condition**: New, Like New, Good, Fair
  - **Listing Type**: For Sale, Exchange, Free Giveaway
  - **Price Range**: Min/Max custom pricing with quick presets
- Multi-mode sorting: Newest First, Price: Low to High, Price: High to Low.
- Synchronized active filter badge tags and one-click filter reset.

### 3. Dynamic Product Details (`/product/[id]`)
- Interactive multi-image gallery with thumbnail selection and aspect zoom.
- Pricing display with negotiable indicator and formatted currency in INR (`₹`).
- Student seller verification card and campus meetup details.
- Interactive buyer actions:
  - **Contact Seller Modal**: send inquiries directly to the seller's college email.
  - **Make an Offer Modal**: submit counter-offers with price negotiation.
  - **Save to Favorites**: persistent heart bookmark button.
- Related similar products carousel based on category.
- Branded 404 Not Found page for invalid listings.

### 4. Sell Item Portal (`/sell`)
- Multi-photo image uploader using browser `FileReader` for instant Base64 preview.
- Quick campus preset buttons for instant test listings.
- Form validation with inline error feedback for required fields.
- Dynamic price toggling: automatically handles Free Giveaways (₹0) and Exchanges.
- Instant publishing and redirect to the newly created product.

### 5. My Listings Management (`/my-listings`)
- Complete CRUD dashboard for demo student sellers.
- Overview inventory metrics: Total Listings, Active & Live, Sold Items.
- **Edit Listing**: modify product title, description, category, condition, price, and location.
- **Mark as Sold / Relist**: toggle status between Available and Sold.
- **Delete Listing**: permanent deletion with safety confirmation modal.

### 6. MongoDB Database & Next.js API Routes (Phase 4)
- **MongoDB Connection Pool**: Cached connection handling in `lib/mongodb.ts` optimized for Next.js App Router hot-reloading.
- **Mongoose Schema & Models**: Fully typed `Product` model in `models/Product.ts` with schema validations, text indexes, timestamps, and virtual ID mapping.
- **RESTful API Route Handlers**:
  - `GET /api/products`: Full filtering (search, category, condition, type, price range, seller email, sorting) and auto-seeding on fresh databases.
  - `POST /api/products`: Server-side input validation and persistent document creation.
  - `GET /api/products/[id]`: Single product retrieval supporting both MongoDB `ObjectId` and fallback string identifiers.
  - `PUT /api/products/[id]`: Partial product updates with validation.
  - `DELETE /api/products/[id]`: Permanent listing removal.
  - `POST /api/products/migrate`: Automatic one-time migration endpoint from Phase 3 `localStorage` data into MongoDB.
- **Resilient Fallback**: Optimistic client updates with offline/local fallback so the app continues to operate seamlessly even before database setup.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict TS/TSX throughout)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) design system & primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **State & Sync**: React Context + Next.js Route Handlers + Resilient Fallback

---

## 📁 Project Structure

```text
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts          # GET (list & auto-seed) & POST (create)
│   │       ├── [id]/
│   │       │   └── route.ts      # GET, PUT, DELETE by product ID
│   │       └── migrate/
│   │           └── route.ts      # One-time migration endpoint
│   ├── layout.tsx                # Root layout with Navbar, Footer & ProductsProvider
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Tailwind 4 theme & color tokens
│   ├── explore/
│   │   └── page.tsx              # Explore Marketplace
│   ├── product/
│   │   └── [id]/
│   │       ├── page.tsx          # Dynamic Product Details page
│   │       └── not-found.tsx     # Custom 404 page
│   ├── sell/
│   │   └── page.tsx              # Create Listing page
│   └── my-listings/
│       └── page.tsx              # Seller Management dashboard
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Responsive navigation bar
│   │   └── Footer.tsx            # Campus trust badges & quick links
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── CategorySection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── RecentProducts.tsx
│   │   ├── HowItWorks.tsx
│   │   └── SellCtaSection.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductSearch.tsx
│   │   ├── ProductSort.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductDetailsView.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── ContactSellerModal.tsx
│   │   ├── MakeOfferModal.tsx
│   │   └── ProductPageContainer.tsx
│   ├── sell/
│   │   ├── SellProductForm.tsx
│   │   ├── ImageUploader.tsx
│   │   └── FormField.tsx
│   ├── dashboard/
│   │   ├── MyListingCard.tsx
│   │   ├── EditProductForm.tsx
│   │   ├── EditProductModal.tsx
│   │   ├── DeleteConfirmation.tsx
│   │   └── DeleteConfirmationModal.tsx
│   └── ui/
│       ├── button.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       └── card.tsx
├── context/
│   └── ProductsContext.tsx       # Live MongoDB sync & CRUD state
├── lib/
│   ├── mongodb.ts                # Cached Mongoose connection handler
│   ├── sample-data.ts            # Default campus product catalog
│   └── utils.ts                  # Formatting & cn helpers
├── models/
│   └── Product.ts                # Mongoose Product Schema & validation
└── types/
    └── index.ts                  # Strict TypeScript interfaces
```

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

### 3. Configure MongoDB Environment Variables
Create a `.env.local` file in the root directory (based on `.env.example`):

```bash
# Using MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campuskart?retryWrites=true&w=majority

# Or using Local MongoDB
MONGODB_URI=mongodb://localhost:27017/campuskart
```

> **Note**: `.env.local` is included in `.gitignore` and is never committed to GitHub.

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 👤 Demo Seller Profile

For demonstration and testing purposes, the application includes a pre-configured student seller identity:
- **Name**: Arnav Gupta
- **Email**: arnav.gupta@college.edu
- **Campus**: Hostel Block B, Room 312
- **Department**: 3rd Year, Computer Science
