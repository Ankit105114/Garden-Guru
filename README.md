# GardenGuru - MERN Home Gardening Assistant

## Overview
GardenGuru is a smart gardening assistant that helps users track, plan, and care for their plants. It features a plant library, personalized garden dashboard, growth tracking with logs, and care reminders.

## Features (Checklist Status)
- [x] **Add plants with care instructions**: Users can contribute to the global Plant Library.
- [x] **Set reminders**: Watering, Pruning, Fertilizing, Medicine, Harvesting.
- [x] **Log plant growth**: Track progress with photos, notes, and height measurements.
- [x] **Pest/Disease Info**: Each plant detail page lists pests and diseases.
- [x] **Share garden info**: Resources page for sharing books/blogs/videos.
- [x] **Admin/Mgmt**: Delete functionality for both user garden items and global library plants.

## Tech Stack
- **Frontend**: React, TailwindCSS, Lucide Icons, React Calendar
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Auth**: JWT (JSON Web Tokens)

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token
- `GET /api/auth/user` - Get current user info

### Plants (Library)
- `GET /api/plants` - Get all plants (supports `?search=` query)
- `GET /api/plants/:id` - Get specific plant details
- `POST /api/plants` - Add new plant to library
- `DELETE /api/plants/:id` - Delete plant from library

### Garden (My Garden)
- `GET /api/garden` - Get user's garden items
- `POST /api/garden` - Add plant to user's garden
- `DELETE /api/garden/:id` - Remove plant from garden
- `POST /api/garden/:id/logs` - Add growth log (notes, photo, height)
- `GET /api/garden/:id/logs` - Get logs for specific garden item

### Reminders
- `GET /api/reminders` - Get all user reminders
- `POST /api/reminders` - Create a new reminder
- `PUT /api/reminders/:id` - Toggle completion status
- `DELETE /api/reminders/:id` - Delete reminder

### Resources
- `GET /api/resources` - Get shared resources
- `POST /api/resources` - Add new resource
- `DELETE /api/resources/:id` - Delete resource

## Setup
1. `npm install` in both `client` and `server` folders.
2. Create `server/.env` with `MONGO_URI` and `JWT_SECRET`.
3. `npm run dev` in both folders to start.