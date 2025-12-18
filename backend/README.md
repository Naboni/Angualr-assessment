# Backend API - Terri Quintel Astrology

> ⚠️ **NOTE: DO NOT USE AI TOOLS**
> 
> **This assessment must be completed WITHOUT using AI tools like Cursor, ChatGPT, GitHub Copilot, etc.**
> 
> **Using AI tools will result in FAILURE of this assessment.**

Node.js/Express backend API with MongoDB for astrological chart management.

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── chartController.js   # Business logic
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   └── validators.js         # Request validation
├── models/
│   └── Chart.js              # Mongoose schema/model
├── routes/
│   ├── chartRoutes.js        # Chart routes
│   └── index.js              # Route aggregator
├── scripts/
│   └── seedData.js           # Database seeding script
├── server.js                 # Application entry point
└── package.json
```

## Setup

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/terri-quintel-astrology
```

4. Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

5. Seed the database (optional):
```bash
npm run seed
```

6. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Charts

#### Get All Charts
- `GET /api/charts`
- Query parameters:
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `sunSign` - Filter by sun sign
  - `isPublic` - Filter by public/private (true/false)
  - `sortBy` - Sort field (default: createdAt)
  - `sortOrder` - Sort order: asc/desc (default: desc)

#### Get Chart by ID
- `GET /api/charts/:id`

#### Calculate New Chart
- `POST /api/charts/calculate`
- Body:
```json
{
  "birthDate": "1990-05-15",
  "birthTime": "10:30",
  "birthLocation": "New York, NY",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "notes": "Optional notes",
  "createdBy": "user@example.com"
}
```

#### Update Chart
- `PUT /api/charts/:id`
- Body (all fields optional):
```json
{
  "name": "Updated Chart Name",
  "notes": "Updated notes",
  "isPublic": true,
  "birthTime": "11:00",
  "birthLocation": "Updated Location"
}
```

#### Delete Chart
- `DELETE /api/charts/:id`

#### Get Charts by Sun Sign
- `GET /api/charts/sign/:sign`
- Valid signs: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces

#### Get Statistics
- `GET /api/charts/stats/summary`
- Returns:
  - Total charts count
  - Public/private charts count
  - Recent charts (last 7 days)
  - Sign distribution

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [ ... ]
}
```

## Data Model

### Chart Schema
```javascript
{
  name: String,
  birthDate: Date,
  birthTime: String (HH:MM format),
  birthLocation: String,
  latitude: Number (optional),
  longitude: Number (optional),
  sunSign: String (enum: zodiac signs),
  moonSign: String (enum: zodiac signs),
  risingSign: String (enum: zodiac signs),
  planets: {
    sun: { sign: String, degree: Number },
    moon: { sign: String, degree: Number },
    mercury: { sign: String, degree: Number },
    venus: { sign: String, degree: Number },
    mars: { sign: String, degree: Number },
    jupiter: { sign: String, degree: Number },
    saturn: { sign: String, degree: Number },
    uranus: { sign: String, degree: Number },
    neptune: { sign: String, degree: Number },
    pluto: { sign: String, degree: Number }
  },
  notes: String (optional, max 1000 chars),
  isPublic: Boolean (default: false),
  createdBy: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Validation

The API uses `express-validator` for request validation:

- Birth date must be valid ISO8601 format
- Birth time must be HH:MM format (24-hour)
- Birth location: 2-200 characters
- Latitude: -90 to 90
- Longitude: -180 to 180
- Notes: max 1000 characters

## Error Handling

The API includes comprehensive error handling:
- 400: Bad Request (validation errors)
- 404: Not Found (resource not found)
- 500: Internal Server Error

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### MongoDB Connection

The app will automatically connect to MongoDB on startup. If the connection fails, the server will exit with an error message.

For MongoDB Atlas (cloud), update your `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## Notes

- The astrological calculations are currently mocked (random data). In a production app, you would integrate with an astrology calculation library.
- All timestamps are stored in UTC.
- The API supports pagination for large datasets.
- Charts can be marked as public or private.

