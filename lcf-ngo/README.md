# 🏃 Let's Celebrate Fitness — NGO Website + Admin Panel

A full-stack MERN application for the **Let's Celebrate Fitness (LCF)** non-profit organization. Built with MongoDB, Express, React, Node.js, and Tailwind CSS.

---

## 📁 Project Structure

```
lcf-ngo/
├── backend/
│   ├── config/
│   │   └── cloudinary.js         # Cloudinary + Multer setup
│   ├── middleware/
│   │   └── auth.js               # JWT auth middleware
│   ├── models/
│   │   ├── Admin.js              # Admin user model
│   │   ├── Page.js               # CMS page/section model
│   │   ├── Event.js              # Event model
│   │   ├── Gallery.js            # Gallery image model
│   │   └── Contact.js            # Contact form submission model
│   ├── routes/
│   │   ├── auth.js               # Login, me, change-password
│   │   ├── pages.js              # CMS page CRUD
│   │   ├── events.js             # Events CRUD
│   │   ├── gallery.js            # Gallery CRUD
│   │   ├── contact.js            # Contact form + inbox
│   │   └── upload.js             # Image upload via Cloudinary
│   ├── utils/
│   │   └── seed.js               # Database seeder
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js          # All Axios API calls
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── index.js      # HeroSection, StatsSection, Cards, CTA...
│   │   │   └── layout/
│   │   │       └── PublicLayout.js # Navbar + Footer
│   │   ├── context/
│   │   │   └── AuthContext.js    # JWT admin auth context
│   │   ├── pages/                # Public website pages
│   │   │   ├── HomePage.js
│   │   │   ├── AboutPage.js
│   │   │   ├── InitiativesPage.js
│   │   │   ├── EventsPage.js
│   │   │   ├── ImpactPage.js
│   │   │   ├── GalleryPage.js
│   │   │   ├── GetInvolvedPage.js
│   │   │   └── ContactPage.js
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AdminLayout.js     # Sidebar + top bar
│   │   │   │   └── FormComponents.js  # Reusable admin form elements
│   │   │   └── pages/
│   │   │       ├── AdminLogin.js
│   │   │       ├── AdminDashboard.js
│   │   │       ├── HomeEditor.js
│   │   │       ├── AboutEditor.js
│   │   │       ├── InitiativesEditor.js
│   │   │       ├── EventsManager.js
│   │   │       ├── GalleryManager.js
│   │   │       ├── ContactEditor.js
│   │   │       └── MessagesInbox.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── package.json                  # Root: run both apps together
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Cloudinary account (for image uploads)

---

### Step 1 — Clone & Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

### Step 2 — Configure Environment Variables

```bash
# In the backend folder, copy the example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lcf_ngo
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_EMAIL=admin@letscelebratefitness.org
ADMIN_PASSWORD=Admin@LCF2024
```

**Cloudinary Setup:**
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret

**MongoDB Atlas Setup (optional, instead of local):**
1. Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get the connection string and set it as `MONGO_URI`

---

### Step 3 — Seed the Database

```bash
cd backend && npm run seed
```

This will:
- Create the admin user (email/password from .env)
- Populate all 8 pages with initial content
- Create 5 seeded events

---

### Step 4 — Run the Application

```bash
# From the root folder — runs both backend + frontend together
npm run dev
```

Or run separately:
```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 3000)
cd frontend && npm start
```

---

## 🌐 URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin` | Admin dashboard |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:5000/api/health` | API health check |

---

## 🔐 Admin Login

Default credentials (set in `.env`):
- **Email:** `admin@letscelebratefitness.org`
- **Password:** `Admin@LCF2024`

> ⚠️ Change the password after first login!

---

## 📋 REST API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/auth/me` | Yes | Get current admin |
| PUT | `/api/auth/password` | Yes | Change password |

### Pages (CMS)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/pages/:pageName` | No | Get page data |
| PUT | `/api/pages/:pageName` | Yes | Update full page |
| PATCH | `/api/pages/:pageName/sections/:idx` | Yes | Update one section |
| PATCH | `/api/pages/:pageName/reorder` | Yes | Reorder sections |

### Events
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events` | No | List visible events |
| GET | `/api/events/all` | Yes | All events (admin) |
| POST | `/api/events` | Yes | Create event |
| PUT | `/api/events/:id` | Yes | Update event |
| DELETE | `/api/events/:id` | Yes | Delete event |

### Gallery
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/gallery` | No | Visible images |
| GET | `/api/gallery/all` | Yes | All images (admin) |
| POST | `/api/gallery` | Yes | Add image record |
| PUT | `/api/gallery/:id` | Yes | Update image |
| DELETE | `/api/gallery/:id` | Yes | Delete image |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | Yes | Upload image to Cloudinary |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | No | Submit contact form |
| GET | `/api/contact` | Yes | List all messages |
| PATCH | `/api/contact/:id/read` | Yes | Mark as read |
| DELETE | `/api/contact/:id` | Yes | Delete message |

---

## 🎨 Admin Panel Features

### Content Editors
- **Home Editor** — Hero, stats, about snippet, initiatives preview, founder snippet, media badges, CTA
- **About Editor** — Page hero, story paragraphs, founder full bio + highlights, mission & vision, media coverage
- **Initiatives Editor** — Add/edit/remove initiative cards with icon, title, description, and image
- **Contact Editor** — Email, phone, address, all social media links

### Content Management
- **Events Manager** — Full CRUD: create, edit, delete events with image upload
- **Gallery Manager** — Bulk image upload, category management, visibility toggle, edit metadata
- **Messages Inbox** — Read contact form submissions, reply via email, delete

### CMS Controls
- ✅ **Visibility toggle** — Show/hide any section without deleting it
- ✅ **Section reorder** — Move sections up/down on any page
- ✅ **Image upload** — Cloudinary-powered with local preview
- ✅ **Live preview** — "View Public Site" link in admin header

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#5A1E5C` |
| Primary Dark | `#3E1240` |
| Primary Light | `#EFE6F2` |
| Accent | `#F2C94C` |
| Font Display | Playfair Display |
| Font Body | DM Sans |

---

## 📝 TODO Placeholders

The following items need to be filled in by the NGO:

1. **Contact Page** → Email, phone number, physical address
2. **Social Media Links** → Facebook, Instagram, Twitter, YouTube URLs
3. **Images** → Upload all section images via the Admin Panel
4. **Events** → Add upcoming events through Events Manager

---

## 🔧 Production Deployment

### Backend (e.g. Railway, Render, Heroku)
1. Set all environment variables in the platform
2. Set `NODE_ENV=production`
3. Deploy the `backend/` folder

### Frontend (e.g. Vercel, Netlify)
1. Set `REACT_APP_API_URL=https://your-backend-url.com/api`
2. Deploy the `frontend/` folder
3. Set build command: `npm run build`
4. Set publish directory: `build`

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Tailwind CSS |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken, bcryptjs) |
| Images | Multer + Cloudinary |
| State | React Context API |
| HTTP Client | Axios |
| Notifications | React Toastify |

---

Built for **Let's Celebrate Fitness (LCF)** — a non-profit organization focused on fitness and social impact.
