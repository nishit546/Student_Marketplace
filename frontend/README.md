# CampusKart Frontend Module

This folder contains the complete user interface, pages, components, global state providers, and styling for the CampusKart marketplace.

---

## 📁 Directory Structure

```text
frontend/
├── app/                     # Next.js App Router Pages & Layouts
│   ├── dashboard/           # Seller dashboard (overview, listings, enquiries, offers)
│   ├── explore/             # Marketplace catalog with live multi-filter search
│   ├── favorites/           # Student saved wishlist
│   ├── product/[id]/        # Dynamic product details with gallery, offer & contact modals
│   ├── sell/                # Listing creation portal with photo preview
│   ├── globals.css          # Tailwind CSS v4 styling & color tokens
│   ├── layout.tsx           # Root layout with Navbar, Footer & Global Context Providers
│   └── page.tsx             # Marketplace homepage with Hero, Categories & Featured items
├── components/              # Reusable UI Primitives and Domain Components
│   ├── dashboard/           # Edit modal, delete confirmation modal, listing cards
│   ├── favorites/           # EmptyFavorites state
│   ├── home/                # Hero, Categories, Featured, Recent products, How-It-Works
│   ├── layout/              # Responsive Navbar with live badge counter & Footer
│   ├── products/            # ProductCard, Gallery, ContactSellerModal, MakeOfferModal
│   ├── sell/                # SellProductForm, ImageUploader, FormField
│   └── ui/                  # Button, Badge, Input, Card, FormErrorMessage
├── context/                 # Centralized React State Providers
│   ├── FavoritesContext.tsx # Live favorites sync with optimistic UI updates
│   └── ProductsContext.tsx  # Product catalog and live CRUD synchronization
├── public/                  # Static assets and icons
└── types/                   # TypeScript interfaces (Product, Enquiry, Offer, DashboardStats)
```

---

## 🎨 UI/UX Features

- **Styling**: Tailwind CSS v4 with custom `#ff4000` orange accent.
- **Components**: Accessible shadcn/ui primitives.
- **State Management**: Real-time optimistic UI updates with automatic API synchronization.
