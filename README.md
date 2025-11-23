# Devbase Studio

**The WordPress of React and React Native**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/badge/version-0.1.0--alpha-orange.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

> Build production-ready web and mobile applications in hours, not months. Zero code required, infinite customization possible.

**Website:** [DevbaseStudio.com](https://devbasestudio.com)  
**Author:** Oxford Pierpont  
**Organization:** The Oxford Pierpont Corporation  
**Website:** [oxfordpierpont.com](https://oxfordpierpont.com)

---

## 🎯 Vision

Devbase Studio is an open-source, visual development platform that democratizes app creation by providing:

- **Visual Builder** - Drag-and-drop interface for designing web and mobile apps
- **Pre-built Modules** - Complete feature sets (Social Network, Ride-Hailing, E-commerce, etc.)
- **Function Library** - Plug-and-play capabilities for custom functionality
- **One-Click Publishing** - Deploy to web, iOS, and Android simultaneously
- **Zero Vendor Lock-in** - Users own everything, deploy anywhere
- **100% Free Forever** - No subscription fees, no feature paywalls

**Mission:** Make building apps as accessible as WordPress made building websites, but for modern React and React Native applications.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git
- (Optional) Supabase account for backend
- (Optional) AWS account for production hosting

### Installation

```bash
# Clone the repository
git clone https://github.com/oxford-pierpont/devbase-studio.git
cd devbase-studio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# Open http://localhost:3000
```

### Create Your First App

1. **Open Devbase Studio** at http://localhost:3000
2. **Click "New Project"** and name your app
3. **Choose a UI Kit** (Modern Minimalist, Bold & Colorful, etc.)
4. **Add Features:**
   - Option A: Install a pre-built module (e.g., Social Network Module)
   - Option B: Drag components and attach functions
5. **Customize** branding, colors, and settings
6. **Click "Publish"** to deploy

Your app is now live on web, iOS, and Android!

---

## 🏗️ Architecture Overview

Devbase Studio uses a three-layer architecture:

```
┌─────────────────────────────────────────────────┐
│  Layer 1: UI Kits (Visual Design System)       │
│  - Pre-built themes and component styles       │
│  - Tailwind CSS + shadcn/ui foundation         │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  Layer 2: Modules (Complete Features)          │
│  - Social Network (Facebook-like)              │
│  - Ride-Hailing (Uber-like)                    │
│  - Food Delivery (DoorDash-like)               │
│  - Marketplace (eBay-like)                     │
│  - 10+ more pre-built modules                  │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  Layer 3: Functions (Atomic Capabilities)      │
│  - Location tracking, routing, geocoding       │
│  - Payment processing, pricing algorithms      │
│  - Real-time chat, notifications               │
│  - 100+ plug-and-play functions                │
└─────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend (Visual Builder):**
- React 18 + TypeScript
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- Monaco Editor (code editor)
- React DnD (drag & drop)
- Zustand (state management)
- TanStack Query (data fetching)

**Code Generation:**
- Babel (AST parsing/transformation)
- Next.js (web apps)
- React Native + Expo (mobile apps)
- Prettier (code formatting)

**Backend/Database:**
- Supabase (Postgres, Auth, Real-time, Storage)
- Edge Functions (Deno)
- Row Level Security (RLS)

**Deployment:**
- Vercel (web hosting)
- Expo EAS (mobile builds)
- Expo Updates (OTA updates)
- AWS (user-owned infrastructure)
- GitHub Actions (CI/CD)

**Mobile:**
- React Native
- Expo SDK 51+
- Expo Router (navigation)
- EAS Build (cloud compilation)

---

## 📦 Project Structure

```
devbase-studio/
├── apps/
│   ├── web/                    # Visual builder (Next.js)
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # React components
│   │   │   ├── builder/      # Visual builder UI
│   │   │   ├── canvas/       # Drag & drop canvas
│   │   │   └── panels/       # Properties, layers panels
│   │   ├── lib/              # Utilities
│   │   └── public/           # Static assets
│   │
│   └── mobile/                 # Mobile preview app (Expo)
│       ├── app/               # Expo Router
│       └── components/        # Mobile components
│
├── packages/
│   ├── ui/                    # Shared UI components (shadcn/ui)
│   ├── config/                # Shared configurations
│   ├── tsconfig/              # TypeScript configs
│   └── eslint-config/         # ESLint configs
│
├── modules/                    # Pre-built feature modules
│   ├── social-network/
│   │   ├── components/       # React components
│   │   ├── database/         # SQL schemas
│   │   ├── api/              # Backend logic
│   │   ├── mobile/           # React Native screens
│   │   ├── hooks/            # React hooks
│   │   └── module.config.json
│   │
│   ├── ride-hailing/
│   ├── food-delivery/
│   ├── marketplace/
│   └── ...                    # More modules
│
├── functions/                  # Function library
│   ├── location/
│   │   ├── getUserLocation.ts
│   │   ├── calculateRoute.ts
│   │   └── trackLocation.ts
│   │
│   ├── matching/
│   ├── payments/
│   ├── communication/
│   └── ...                    # More function categories
│
├── generators/                 # Code generation
│   ├── web/                   # Next.js generator
│   ├── mobile/                # React Native generator
│   ├── api/                   # API generator
│   └── database/              # Schema generator
│
├── ui-kits/                   # Design systems
│   ├── modern-minimalist/
│   ├── bold-colorful/
│   ├── corporate-professional/
│   └── ...
│
├── docs/                      # Documentation
│   ├── getting-started.md
│   ├── modules/              # Module documentation
│   ├── functions/            # Function reference
│   └── guides/               # Tutorials
│
└── examples/                  # Example projects
    ├── social-app/
    ├── food-delivery-app/
    └── ...
```

---

## 🎨 Core Features

### 1. Visual Builder

Intuitive drag-and-drop interface for designing applications:

- **Canvas** - WYSIWYG design surface
- **Component Library** - 100+ pre-built components
- **Properties Panel** - Configure component behavior
- **Layers Panel** - Component hierarchy tree
- **Live Preview** - Real-time preview on multiple devices
- **Code Editor** - Monaco editor for advanced users

### 2. UI Kits (Design Systems)

Pre-designed themes for instant professional appearance:

- Modern Minimalist
- Bold & Colorful
- Corporate Professional
- Mobile-First
- E-commerce Luxury
- Dark Mode variants
- Custom theme creator

Each UI kit includes:
- Color schemes
- Typography systems
- Component variants
- Layout patterns
- Animation presets

### 3. Pre-built Modules

Complete, production-ready feature sets:

**Social Network Module:**
- User profiles and authentication
- Friend/follow systems
- Activity feed with algorithms
- Posts (text, images, video)
- Nested comments
- Reactions and likes
- Real-time messaging
- Notifications
- Groups and communities
- Privacy controls
- Moderation tools

**Ride-Hailing Module:**
- Real-time GPS tracking
- Driver-rider matching
- Route optimization
- ETA calculation
- Dynamic pricing (surge)
- Payment integration
- Rating systems
- Ride history

**Food Delivery Module:**
- Restaurant listings
- Menu management
- Order placement
- Kitchen display system
- Delivery tracking
- Driver assignment
- Multi-restaurant orders

**Marketplace Module:**
- Product listings
- Shopping cart
- Checkout flow
- Seller profiles
- Reviews and ratings
- Inventory management
- Order tracking

**Plus 10+ more modules in development**

### 4. Function Library

Plug-and-play capabilities for custom apps:

**Location & Mapping (20+ functions):**
- Get User Location
- Real-time Tracking
- Calculate Distance
- Calculate Route
- Optimize Multi-Stop Route
- Geocode Address
- Reverse Geocode
- Geofencing

**Matching & Algorithms (15+ functions):**
- Find Nearest Item
- Match by Proximity
- Match by Preferences
- Calculate Compatibility
- Weighted Ranking
- Queue Management

**Payments & Billing (10+ functions):**
- Calculate Dynamic Price
- Process Payment (Stripe)
- Apply Discount Code
- Split Payment
- Calculate Tax
- Refund Transaction
- Calculate Commission

**Communication (12+ functions):**
- Send Push Notification
- Send Email
- Send SMS
- Real-time Chat
- Video Call
- Voice Call
- Group Chat

**Security & Verification (8+ functions):**
- Verify Phone Number
- Verify Email
- Background Check
- Verify Identity Document
- Biometric Authentication
- Two-Factor Authentication

**Media & Content (10+ functions):**
- Upload Image (auto-optimization)
- Upload Video (transcoding)
- Scan QR Code
- Generate QR Code
- Speech-to-Text
- Text-to-Speech
- AI Content Moderation

### 5. One-Click Publishing

Deploy to all platforms simultaneously:

**Web Deployment:**
- Vercel (instant)
- AWS Amplify (user's account)
- Netlify (instant)
- Self-hosted (Docker)

**Mobile Deployment:**
- Over-The-Air (OTA) updates (30 seconds)
- Full app builds when needed
- Automatic App Store submission helpers
- TestFlight distribution

**Features:**
- Single "Publish" button
- Automatic Git commits
- Environment management
- Rollback capability
- Preview deployments
- Staging environments

### 6. Real-Time Everything

Built-in WebSocket support via Supabase Realtime:

- Live activity feeds
- Real-time notifications
- Chat with typing indicators
- Live location tracking
- Collaborative editing
- Live data syncing
- Optimistic updates

### 7. Database Management

Visual database builder with full Postgres power:

- Drag-and-drop schema design
- Automatic migrations
- Row Level Security (RLS)
- Relationships (one-to-many, many-to-many)
- Indexes and constraints
- Full-text search
- Real-time subscriptions

### 8. Authentication & Security

Enterprise-grade security by default:

**OAuth Providers:**
- Google, Facebook, Apple, GitHub
- Microsoft, Twitter, Discord
- Custom OIDC providers

**Features:**
- Magic link authentication
- Phone number (SMS)
- Email/password
- Multi-factor authentication (MFA)
- Session management
- Role-based access control (RBAC)
- Row Level Security (RLS)
- Automatic CSRF protection
- XSS prevention
- SQL injection prevention

### 9. Code Export

Full code ownership and portability:

**Export Formats:**
- Next.js project (web)
- React Native/Expo project (mobile)
- API endpoints (TypeScript)
- Database schema (SQL)

**Code Quality:**
- TypeScript throughout
- ESLint compliant
- Prettier formatted
- Comprehensive comments
- Type-safe API clients
- Unit test stubs

---

## 📖 Usage Examples

### Example 1: Building a Social Network

```typescript
// 1. Create new project
const project = createProject({
  name: "MySocialApp",
  uiKit: "modern-minimalist"
});

// 2. Install Social Network Module
installModule(project, "social-network", {
  features: {
    posts: true,
    comments: true,
    messaging: true,
    groups: true,
    stories: false // Optional features
  },
  feedAlgorithm: "engagement", // or "chronological"
  privacyDefault: "friends"
});

// 3. Customize
customizeBranding(project, {
  primaryColor: "#3B82F6",
  logo: "./assets/logo.png",
  fontFamily: "Inter"
});

// 4. Publish
publish(project, {
  web: true,
  ios: true,
  android: true
});

// Result: Complete social network live in 30 minutes
```

### Example 2: Building Custom Uber with Functions

```typescript
// 1. Create project
const project = createProject({
  name: "RideShare",
  uiKit: "mobile-first"
});

// 2. Design UI (visual drag-and-drop)
const homeScreen = createScreen("Home");

const mapComponent = addComponent(homeScreen, {
  type: "Map",
  config: {
    showUserLocation: true,
    zoomLevel: 15
  }
});

const requestButton = addComponent(homeScreen, {
  type: "Button",
  text: "Request Ride",
  variant: "primary"
});

// 3. Attach functions
attachFunction(requestButton, {
  functionId: "get-user-location",
  trigger: "onClick",
  onSuccess: [
    {
      type: "runFunction",
      functionId: "match-nearest-driver",
      config: {
        vehicleType: "car",
        maxDistance: 5
      }
    }
  ]
});

// 4. Publish
publish(project);

// Result: Working Uber clone in 2-3 days
```

### Example 3: Adding Features to Existing App

```typescript
// Add food delivery to existing app
installModule(existingProject, "food-delivery");

// Customize restaurant commission
configureModule(existingProject, "food-delivery", {
  commission: 0.15, // 15%
  deliveryFee: 3.99,
  minOrder: 15
});

// Publish update (OTA - instant)
publish(existingProject);

// Result: New feature live in 30 seconds
```

---

## 🤝 Contributing

We welcome contributions! Devbase Studio is built by the community, for the community.

### Ways to Contribute

1. **Build Functions** - Add new capabilities to the function library
2. **Create Modules** - Build complete feature sets
3. **Design UI Kits** - Create new design systems
4. **Improve Code Generation** - Enhance generated code quality
5. **Write Documentation** - Guides, tutorials, API docs
6. **Report Bugs** - GitHub issues
7. **Suggest Features** - Feature requests
8. **Translate** - Localization and i18n

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/devbase-studio.git
cd devbase-studio

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/my-new-function

# Make changes and commit
git commit -m "Add new function: Calculate Shipping Cost"

# Push and create PR
git push origin feature/my-new-function
```

### Code Style

- TypeScript for all code
- ESLint + Prettier for formatting
- Conventional Commits for commit messages
- Comprehensive JSDoc comments
- Unit tests for functions and modules

### Pull Request Process

1. Update documentation
2. Add tests
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

---

## 📚 Documentation

**Getting Started:**
- [Installation Guide](docs/installation.md)
- [Your First App](docs/first-app.md)
- [Core Concepts](docs/concepts.md)

**Modules:**
- [Module Overview](docs/modules/overview.md)
- [Creating Modules](docs/modules/creating.md)
- [Module API Reference](docs/modules/api.md)

**Functions:**
- [Function Library Reference](docs/functions/reference.md)
- [Creating Functions](docs/functions/creating.md)
- [Function Chains](docs/functions/chains.md)

**UI Kits:**
- [UI Kit System](docs/ui-kits/overview.md)
- [Creating UI Kits](docs/ui-kits/creating.md)
- [Theming Guide](docs/ui-kits/theming.md)

**Deployment:**
- [Publishing Guide](docs/deployment/publishing.md)
- [AWS Integration](docs/deployment/aws.md)
- [Mobile App Stores](docs/deployment/app-stores.md)

**Advanced:**
- [Code Export](docs/advanced/code-export.md)
- [Custom Code](docs/advanced/custom-code.md)
- [API Integration](docs/advanced/api-integration.md)

**Tutorials:**
- [Build Instagram Clone](docs/tutorials/instagram.md)
- [Build Uber Clone](docs/tutorials/uber.md)
- [Build Twitter Clone](docs/tutorials/twitter.md)

---

## 🗺️ Roadmap

### Phase 1: MVP (Months 1-4)
- ✅ Visual builder foundation
- ✅ Component library (50+ components)
- ✅ Function library (50+ functions)
- ✅ Social Network Module
- ✅ Code generation (Next.js + React Native)
- ✅ Web deployment (Vercel)
- 🚧 Mobile deployment (Expo)
- 🚧 Database visual builder

### Phase 2: Core Modules (Months 5-8)
- 🔄 Ride-Hailing Module
- 🔄 Food Delivery Module
- 🔄 Marketplace Module
- 🔄 E-commerce Module
- 🔄 Events & Ticketing Module
- 📋 AWS deployment integration
- 📋 Module marketplace MVP

### Phase 3: Advanced Features (Months 9-12)
- 📋 Collaboration features (teams)
- 📋 Version control UI
- 📋 Advanced analytics
- 📋 A/B testing tools
- 📋 SEO optimization tools
- 📋 Performance monitoring
- 📋 Enterprise features

### Phase 4: Ecosystem (Year 2)
- 📋 Plugin marketplace launch
- 📋 Premium modules by third parties
- 📋 Theme marketplace
- 📋 Template library
- 📋 Component marketplace
- 📋 AI code generation
- 📋 No-code backend builder

**Legend:** ✅ Complete | 🚧 In Progress | 🔄 Planned | 📋 Future

---

## 💼 Business Model

**Free Forever:**
- Visual builder
- All modules
- All functions
- Code export
- Community support

**Optional Revenue (Ecosystem):**
- Module marketplace (70/30 split)
- Premium modules by third parties
- Consulting services (third party)
- Hosting services (third party)
- Training/certification (third party)

**Core platform remains 100% free and open source.**

---

## 🔒 Security

Security is a top priority:

- **Regular Security Audits** - Third-party penetration testing
- **Dependency Scanning** - Automated vulnerability checks
- **Code Review** - All PRs reviewed for security
- **OWASP Compliance** - Following best practices
- **Responsible Disclosure** - security@devbasestudio.com

**Security Features:**
- Row Level Security (RLS) by default
- Prepared statements (SQL injection prevention)
- CSRF token validation
- XSS sanitization
- Rate limiting
- Input validation (Zod schemas)
- Secure password hashing (bcrypt)
- JWT token management
- Environment variable encryption

---

## 📄 License

**GNU General Public License v3.0**

Devbase Studio is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

See [LICENSE](LICENSE) file for details.

---

## 🌟 Community

**Join the community:**

- **Discord** - [Join our Discord server](https://discord.gg/devbase-studio)
- **Twitter** - [@DevbaseStudio](https://twitter.com/devbasestudio)
- **GitHub Discussions** - [Start a discussion](https://github.com/oxford-pierpont/devbase-studio/discussions)
- **Blog** - [devbasestudio.com/blog](https://devbasestudio.com/blog)
- **Newsletter** - [Subscribe for updates](https://devbasestudio.com/newsletter)

**Get Help:**
- [Documentation](https://docs.devbasestudio.com)
- [Community Forum](https://community.devbasestudio.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/devbase-studio)
- [GitHub Issues](https://github.com/oxford-pierpont/devbase-studio/issues)

---

## 🙏 Acknowledgments

**Inspired by:**
- WordPress - For showing us how to democratize web development
- Webflow - For visual builder inspiration
- Supabase - For open-source backend infrastructure
- Vercel - For deployment excellence
- Expo - For React Native tooling

**Built with open-source:**
- React, Next.js, TypeScript
- Tailwind CSS, shadcn/ui
- Supabase, Postgres
- Expo, React Native
- And 100+ other amazing projects

---

## 📞 Contact

**Oxford Pierpont**  
The Oxford Pierpont Corporation  
Website: [oxfordpierpont.com](https://oxfordpierpont.com)  
Email: oxford@oxfordpierpont.com

**Devbase Studio**  
Website: [DevbaseStudio.com](https://devbasestudio.com)  
Email: hello@devbasestudio.com  
Support: support@devbasestudio.com  
Security: security@devbasestudio.com

---

## ⭐ Star Us on GitHub

If you find Devbase Studio useful, please give us a star on GitHub! It helps others discover the project and motivates us to keep building.

[![GitHub stars](https://img.shields.io/github/stars/oxford-pierpont/devbase-studio?style=social)](https://github.com/oxford-pierpont/devbase-studio)

---

**Built with ❤️ by Oxford Pierpont and the open-source community**

*Making app development accessible to everyone*
