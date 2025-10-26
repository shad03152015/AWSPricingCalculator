# AWS Pricing Calculator

A full-stack web application for estimating AWS service costs using real-time pricing data from the AWS Pricing API.

## Features

- 🧮 **Interactive Calculator**: Configure multiple AWS services with detailed parameters
- 💾 **Estimate Management**: Save, edit, duplicate, and compare cost estimates
- 🔗 **Flexible Sharing**: Share estimates via public/private links with optional password protection
- 🔐 **User Authentication**: Secure account system with JWT authentication
- 📊 **Real-time Pricing**: Fetches current AWS pricing via AWS Pricing API
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Built with React, Tailwind CSS, and Headless UI

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router v6 for routing
- Redux Toolkit for state management
- Tailwind CSS for styling
- Headless UI for accessible components
- Axios for API requests

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- AWS SDK v3 for Pricing API
- bcryptjs for password hashing

## Architecture

### System Overview

```
Frontend (React SPA) → Backend API (Express) → MongoDB
                               ↓
                        AWS Pricing API
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components (Layout, ProtectedRoute)
│   ├── pages/           # Page components (Calculator, Estimate, etc.)
│   ├── store/           # Redux slices (auth, calculator, estimates)
│   ├── utils/           # Utilities (api, constants)
│   ├── App.jsx          # Main app with routing
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── index.html           # HTML template
```

### Backend Structure

```
backend/
├── src/
│   ├── models/          # Mongoose models (User, Estimate, SharedEstimate)
│   ├── routes/          # Express routes (auth, estimates, pricing, shared)
│   ├── middleware/      # Middleware (auth)
│   └── services/        # Service layer (awsPricing)
└── server.js            # Server entry point
```

## Supported AWS Services

**Current Implementation:**
- EC2 (Elastic Compute Cloud)
- S3 (Simple Storage Service)
- RDS (Relational Database Service)
- Lambda
- CloudFront
- DynamoDB
- ECS (Elastic Container Service)
- EBS (Elastic Block Store)
- Route 53
- ElastiCache

**Note:** Full pricing calculations are implemented for EC2, S3, Lambda, and RDS. Other services have placeholder implementations that can be expanded.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB 7+ (or use Docker Compose)
- AWS account (optional, for your own AWS credentials)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AWSPricingCalculator
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up MongoDB:**

   **Option A: Using Docker Compose (recommended for development)**
   ```bash
   cd ..
   docker-compose up -d
   ```

   **Option B:** Install MongoDB locally or use MongoDB Atlas

5. **Configure environment variables:**

   **Frontend** (create `frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   **Backend** (create `backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aws-pricing-calculator
   JWT_SECRET=your-secret-key-here-change-this
   FRONTEND_URL=http://localhost:5173
   ```

6. **Start development servers:**

   **Terminal 1 (backend):**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 (frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open application:**
   Navigate to http://localhost:5173

## API Documentation

### Authentication Endpoints

**POST /api/auth/register**
- Creates new user account
- Body: `{ name, email, password }`
- Returns: `{ user, token }`

**POST /api/auth/login**
- Authenticates user
- Body: `{ email, password }`
- Returns: `{ user, token }`

**GET /api/auth/me**
- Gets current user info
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

### Estimate Endpoints

**GET /api/estimates**
- Get all estimates for authenticated user
- Headers: `Authorization: Bearer <token>`
- Query: `?sort=createdAt&search=name`
- Returns: `{ estimates: [...] }`

**GET /api/estimates/:id**
- Get single estimate
- Headers: `Authorization: Bearer <token>`
- Returns: `{ estimate }`

**POST /api/estimates**
- Create new estimate
- Headers: `Authorization: Bearer <token>`
- Body: `{ name, description, services, totalMonthlyCost }`
- Returns: `{ estimate }`

**PATCH /api/estimates/:id**
- Update estimate
- Headers: `Authorization: Bearer <token>`
- Body: Partial estimate data
- Returns: `{ estimate }`

**DELETE /api/estimates/:id**
- Delete estimate
- Headers: `Authorization: Bearer <token>`
- Returns: `{ message }`

**POST /api/estimates/:id/duplicate**
- Duplicate estimate
- Headers: `Authorization: Bearer <token>`
- Returns: `{ estimate }`

**POST /api/estimates/:id/share**
- Create shareable link
- Headers: `Authorization: Bearer <token>`
- Body: `{ accessType, password?, expiresAt? }`
- Returns: `{ shareUrl, shareToken }`

### Pricing Endpoints

**GET /api/pricing/services**
- Get list of supported AWS services
- Returns: `{ services: [...] }`

**POST /api/pricing/calculate**
- Calculate cost for service configuration
- Body: `{ serviceCode, region, configuration }`
- Returns: `{ monthlyCost, breakdown }`
- Rate limited: 100 requests per 15 minutes

### Shared Estimate Endpoints

**GET /api/shared/:shareToken**
- Get shared estimate
- Query: `?password=xxx` (if required)
- Headers: `Authorization: Bearer <token>` (for private shares)
- Returns: `{ estimate, sharedBy, sharedAt }`

## Deployment

### Frontend (Vercel/Netlify)

**Vercel:**
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory: `frontend`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable: `VITE_API_URL=<your-backend-url>/api`
7. Deploy

**Netlify:**
1. Push code to GitHub
2. Import project in Netlify
3. Set base directory: `frontend`
4. Set build command: `npm run build`
5. Set publish directory: `frontend/dist`
6. Add environment variable: `VITE_API_URL=<your-backend-url>/api`
7. Deploy

### Backend (Heroku/Railway/Render)

**Heroku:**
```bash
cd backend
heroku create your-app-name
heroku addons:create mongolab
heroku config:set JWT_SECRET=your-secret
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
git subtree push --prefix backend heroku master
```

**Railway:**
1. Create new project
2. Deploy from GitHub (backend directory)
3. Add MongoDB plugin
4. Set environment variables
5. Deploy

**Render:**
1. Create new Web Service
2. Connect repository
3. Set root directory: `backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

### Environment Variables for Production

**Frontend:**
- `VITE_API_URL`: Your backend API URL

**Backend:**
- `NODE_ENV`: production
- `PORT`: Provided by hosting platform
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Strong random string (use `openssl rand -base64 32`)
- `FRONTEND_URL`: Your frontend URL (for CORS)
- `AWS_ACCESS_KEY_ID`: (optional) AWS credentials
- `AWS_SECRET_ACCESS_KEY`: (optional) AWS credentials

## Project Status

This implementation includes:
- ✅ Complete backend API with authentication and database models
- ✅ Full Redux state management setup
- ✅ Placeholder pages for Calculator, Estimate, SharedEstimate
- ✅ Login and Register pages with authentication
- ✅ Protected routes and navigation
- ✅ Comprehensive project structure
- ✅ Docker Compose for local MongoDB
- ✅ Environment configuration

**Next Steps for Full Implementation:**
- Expand Calculator page with full service configuration forms
- Implement accordion UI for service selection
- Add complete cost calculation integration
- Implement estimate save/share modals
- Add detailed estimate views and comparison features
- Implement shared estimate password protection UI
- Add loading states and error handling throughout
- Add form validation and user feedback

## Troubleshooting

**MongoDB connection error:**
- Verify MongoDB is running: `docker-compose ps`
- Check connection string in .env
- Ensure port 27017 is not in use

**AWS Pricing API errors:**
- AWS Pricing API is only available in us-east-1
- Check AWS service quotas if getting throttled
- Consider implementing request queuing for high load

**Authentication not working:**
- Verify JWT_SECRET is set in backend .env
- Check token is being sent in Authorization header
- Clear localStorage and try logging in again

**CORS errors:**
- Verify FRONTEND_URL in backend .env matches your frontend URL
- Check cors configuration in server.js

## License

MIT License - see LICENSE file for details

## Acknowledgments

- AWS Pricing API documentation
- React and Redux Toolkit communities
- Tailwind CSS and Headless UI teams

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Documentation: [repository-url]/wiki
