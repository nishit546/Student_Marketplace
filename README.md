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
- Client-side `localStorage` persistence across all pages and refreshes.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) design system & primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Storage**: React Context + Browser `localStorage` (Phase 1–3)

---

## 📁 Project Structure

```text
├── app/
│   ├── layout.tsx              # Root layout with Navbar, Footer & ProductsProvider
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Tailwind 4 theme & color tokens
│   ├── explore/
│   │   └── page.tsx            # Explore Marketplace
│   ├── product/
│   │   └── [id]/
│   │       ├── page.tsx        # Dynamic Product Details page
│   │       └── not-found.tsx   # Custom 404 page
│   ├── sell/
│   │   └── page.tsx            # Create Listing page
│   └── my-listings/
│       └── page.tsx            # Seller Management dashboard
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Responsive navigation bar
│   │   └── Footer.tsx          # Campus trust badges & quick links
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
│   └── ProductsContext.tsx     # Centralized product state & CRUD
├── lib/
│   ├── sample-data.ts          # Default campus product catalog
│   └── utils.ts                # Formatting & cn helpers
└── types/
    └── index.ts                # TypeScript interfaces
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

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### 4. Build for Production
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
