# PizzaHub - Pizza Ordering & Delivery Platform

PizzaHub is a role-based pizza ordering platform. Customers discover local pizza shops, browse menus and place orders. Restaurants (vendors) publish menu items and manage incoming orders. Admins manage users, review menu items and monitor transactions.

- **Live site:** https://pizzahub-client-sooty.vercel.app
- **Client repository:** https://github.com/HelloRudra/Pizzahub_client
- **Server repository:** https://github.com/HelloRudra/Pizzahub_server
- **Server API:** https://pizzahub-server-sigma.vercel.app

## Important Features

**Customer**
- Browse, search, filter by category and location, and sort by price
- View item details with an image gallery
- Place orders with delivery date, address and special instructions
- Duplicate active orders for the same item and date are blocked
- Track order status with a timeline and cancel pending orders

**Vendor**
- Add, edit, delete and activate/deactivate menu items (images uploaded to ImgBB)
- Free plan allows 3 active items; Premium is unlimited
- Accept or reject pending customer orders (once only)
- Upgrade to Premium through Stripe Checkout (featured placement and Premium badge)

**Admin**
- Dashboard with platform statistics and a chart
- Search, filter, block and unblock users
- Approve, reject, deactivate and delete menu items
- Read-only transactions list (payments cannot be edited)

**Platform**
- Better Auth with email/password and Google sign-in
- Server-side JWT verification and role checks on every protected API
- Premium activated only by a verified Stripe webhook
- Responsive UI, toast notifications, loading and empty states, custom 404 page
- Order status timeline (optional feature)

## Technology Stack

| Area | Packages |
|---|---|
| Framework | next, react, react-dom |
| Auth | better-auth (MongoDB adapter, JWT plugin, Google OAuth) |
| Database driver | mongodb |
| UI | tailwindcss, shadcn/ui (Radix UI), lucide-react, sonner |
| Animation | motion (Framer Motion) |
| Image hosting | ImgBB API |

## Installation and Local Setup

```bash
git clone https://github.com/HelloRudra/Pizzahub_client.git
cd Pizzahub_client
npm install
```

Create `.env.local` (see variable names below), then:

```bash
npm run dev
```

Open http://localhost:3000. The server must be running too (see the server repository).

## Environment Variables

Create a `.env.local` file with these names (never commit real values):

```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
DB_NAME=
NEXT_PUBLIC_API_URL=
IMGBB_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Roles and Admin Access

- Public sign-up allows **Customer** and **Vendor** only. The auth hook forces any other role (including `admin`) to `customer`.
- Admin accounts are assigned directly in the database: create a normal account, then set its `role` to `admin`.
- Google sign-in creates customer accounts; vendors register with email and password.
- Users cannot change their own role or subscription through profile updates (stripped by a server hook).

## Challenge Requirements

### 1. Advanced search and sorting
The Browse Menu page calls `GET /api/menu-items` with these query parameters:

| Parameter | Purpose |
|---|---|
| `search` | Case-insensitive name search |
| `category` | Exact category filter |
| `location` | Case-insensitive location search |
| `sort` | `price_asc` or `price_desc` (default: newest first) |
| `page`, `limit` | Pagination |

Flow: the client debounces typing (400 ms), builds the query string, and the server builds a MongoDB filter (always `status: 'approved'`), escapes user input before using it in a regex, sorts, and paginates.

### 2. JWT / token verification
1. The browser requests a short-lived JWT from Better Auth (`/api/auth/token`).
2. `apiFetch` sends it as `Authorization: Bearer <token>`.
3. The Express `verifyToken` middleware verifies the signature against Better Auth's public keys (JWKS) and checks the issuer and expiry. An invalid or expired token returns **401**.
4. The user is loaded from the database. Blocked users receive **403**. The role always comes from the database, never from the client.
5. `requireRole(...)` returns **403** for the wrong role, and each route checks resource ownership.

## Test Instructions

- Admin: `ADMIN_EMAIL_HERE` (password provided in the submission form)
- Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP