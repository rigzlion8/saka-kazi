# Saka-Kazi - Professional Service Marketplace

A comprehensive web application that connects customers with verified professional service providers across Kenya. Built with Next.js 15, MongoDB, and integrated with Paystack for secure payments.

## 🚀 Features

### Core Functionality
- **User Management**: Customer and provider registration with role-based access control
- **Service Discovery**: Browse providers by location, service type, and ratings
- **Order Management**: Complete order lifecycle from booking to completion
- **Payment Integration**: Secure payments via Paystack
- **Review System**: Rate and review service providers
- **Real-time Notifications**: In-app and email notifications
- **Admin Dashboard**: Comprehensive admin, ops, and finance dashboards

### User Roles
- **Customers**: Browse services, place orders, make payments, leave reviews
- **Providers**: Create profiles, manage services, receive orders, track payments
- **Admins**: User management, system configuration, analytics
- **Ops**: Provider verification, complaint resolution, quality control
- **Finance**: Payment tracking, financial reports, refunds

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based access control
- **Payments**: Paystack integration
- **Styling**: Tailwind CSS with custom component library
- **Deployment**: Docker containerization, Vercel/AWS ready

### Project Structure
```
/saka-kazi
├── /app                    # Next.js App Router
│   ├── /api               # API routes
│   ├── /auth              # Authentication pages
│   ├── /dashboard         # User dashboards
│   ├── /providers         # Provider discovery
│   └── /orders            # Order management
├── /components            # Reusable React components
├── /lib                   # Utility functions and services
├── /models                # MongoDB/Mongoose models
├── /types                 # TypeScript type definitions
├── /styles                # Global styles and Tailwind config
├── /public                # Static assets
└── /scripts               # Database seeding and utilities
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- Redis (optional, for caching)
- Docker & Docker Compose (for containerized development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/saka-kazi.git
   cd saka-kazi
   ```

2. **Set up Docker environment variables**
   ```bash
   cp .env.docker.example .env.docker
   # Edit .env.docker with your configuration
   # Note: Use service names (mongo, redis) not localhost
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - App: http://localhost:3000
   - MongoDB: localhost:27017
   - Mongo Express: http://localhost:8081 (admin/admin123)

5. **Seed the database (optional)**
   ```bash
   # After containers are running
   curl -X POST http://localhost:3000/api/seed
   ```

### Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB**
   ```bash
   # Start MongoDB locally or use MongoDB Atlas
   # Update MONGODB_URI in .env
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Configure all required environment variables
   ```

4. **Run database migrations**
   ```bash
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/saka-kazi

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Paystack Payment Integration
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@saka-kazi.com

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
```

## 📊 Database Schema

### Core Entities

#### Users
- Customer and provider accounts
- Role-based permissions
- Location tracking (GeoJSON)
- Verification status

#### Provider Profiles
- Service offerings
- Rate cards
- Certification documents
- Visibility settings

#### Orders
- Service details
- Payment status
- Location information
- Order lifecycle

#### Payments
- Paystack integration
- Payment tracking
- Refund handling

#### Reviews & Ratings
- Order-based reviews
- Rating system (1-5 stars)
- Quality metrics

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Deactivate user

### Providers
- `GET /api/providers` - Discover providers
- `POST /api/providers` - Create provider profile
- `PATCH /api/providers/:id/verify` - Verify provider (ops)
- `POST /api/providers/:id/upload-rate-card` - Upload rate card

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get user orders
- `PATCH /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/initiate` - Start payment
- `POST /api/payments/verify` - Verify payment (webhook)
- `GET /api/payments/:id` - Get payment details

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/providers/:id/reviews` - Get provider reviews

## 🎨 UI Components

### Design System
- **Colors**: Primary, secondary, success, warning, danger palettes
- **Typography**: Inter font family with responsive sizing
- **Components**: Buttons, forms, cards, tables, modals
- **Responsive**: Mobile-first design with Tailwind breakpoints

### Component Library
- Form components with validation
- Data tables with sorting/filtering
- Modal dialogs and overlays
- Navigation and sidebar components
- Dashboard widgets and charts

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions per user role
- **Input Validation**: Joi schema validation for all inputs
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configurable cross-origin policies
- **Rate Limiting**: API request throttling
- **Audit Logging**: Comprehensive activity tracking

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Production
```bash
docker build -t saka-kazi .
docker run -p 3000:3000 saka-kazi
```

### Environment-Specific Configs
- **Development**: Local MongoDB, development keys
- **Staging**: Staging database, test payment keys
- **Production**: Production database, live payment keys

## 📈 Performance & Scaling

### Optimization Strategies
- **Database Indexing**: Strategic MongoDB indexes for queries
- **Connection Pooling**: Mongoose connection management
- **Caching**: Redis for session and data caching
- **Image Optimization**: Next.js Image component with Cloudinary
- **Code Splitting**: Dynamic imports and lazy loading

### Monitoring & Analytics
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **User Analytics**: Usage patterns and insights
- **Database Performance**: Query optimization and monitoring

## 🧪 Testing

### Test Structure
```bash
npm run test              # Run all tests
npm run test:unit         # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e          # End-to-end tests
```

### Testing Tools
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Supertest**: API endpoint testing
- **Cypress**: E2E testing

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

## 📚 Documentation

### Additional Resources
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🆘 Support

### Getting Help
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Documentation**: Comprehensive docs and examples
- **Community**: Active developer community

### Common Issues
- **MongoDB Connection**: Check connection string and network access
- **Paystack Integration**: Verify API keys and webhook configuration
- **Build Errors**: Ensure Node.js version compatibility
- **Docker Issues**: Check container logs and port conflicts

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **MongoDB**: For the robust database solution
- **Paystack**: For secure payment processing
- **Tailwind CSS**: For the utility-first CSS framework
- **Open Source Community**: For inspiration and contributions

---

**Built with ❤️ for the Kenyan service industry**
