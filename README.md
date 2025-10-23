# Express TypeScript API Template

A production-ready API template built with Express.js, TypeScript, and Prisma ORM. Includes built-in authentication with email/password support, PostgreSQL database integration, and middleware patterns for common API scenarios.

## Features

- Express 5.x with TypeScript strict mode
- Authentication via Better Auth with email/password support
- Session management and token-based authorization
- PostgreSQL database with Prisma ORM
- Protected routes with middleware-based access control
- Global error handling middleware
- Type-safe request/response handling
- Development mode with hot reload
- Production-ready build pipeline

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+ (local or remote)
- npm 10+

### Installation

1. Clone this repository
```bash
git clone https://github.com/raworiginal/express-ts-api-template.git
cd express-ts-api-template
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

4. Set up the database
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

The server will start on http://localhost:3000

## Development

### Available Commands
```bash
npm run dev       # Start development server with hot reload
npm run build     # Compile TypeScript to JavaScript
npm start         # Run production build
```

### Database Commands
```bash
npx prisma migrate dev      # Create and apply migrations
npx prisma db push          # Push schema changes (development only)
npx prisma studio          # Open database GUI
npx prisma migrate reset    # Reset database (development only)
```

## Architecture

### Project Structure
```
express-ts-api-template/
├── src/
│   ├── lib/
│   │   ├── auth.ts              # Better Auth configuration
│   │   └── prisma.ts            # Prisma Client singleton
│   ├── middleware/
│   │   ├── auth.middleware.ts   # Token validation
│   │   └── error.middleware.ts  # Global error handling
│   ├── routes/
│   │   └── user.routes.ts       # Example protected routes
│   ├── types/
│   │   └── express.d.ts         # Express type extensions
│   └── server.ts                # Main application entry point
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Migration history
└── dist/                        # Compiled output (after build)
```

### Request Flow

All incoming requests follow this flow:

1. HTTP request arrives at Express
2. Better Auth handles `/api/auth/*` routes (login, register, logout, etc.)
3. JSON middleware parses request body
4. Application routes process the request
5. Auth middleware validates tokens on protected routes
6. Global error handler catches any errors
7. Response is sent back to client

## Authentication

### Built-in Auth Routes

The template includes Better Auth configured with email/password support. Access auth endpoints at `/api/auth/*`:

- `POST /api/auth/sign-up/email` - Register a new user
- `POST /api/auth/sign-in/email` - Log in an existing user
- `POST /api/auth/sign-out` - Log out the current user
- `GET /api/auth/session` - Get current session information

### Using Protected Routes

Protected routes require a valid Bearer token in the Authorization header:
```bash
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Example route implementation:
```typescript
import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', requireAuth, (req: Request, res: Response) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user,
  });
});

export default router;
```

Then mount in `src/server.ts`:
```typescript
app.use('/api/user', userRoutes);
```

## API Examples

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password_123",
    "name": "John Doe"
  }'
```

### Access Protected Route
```bash
# Copy the token from sign-up response
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:
```
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
```

The application loads environment variables using `dotenv` at startup.

### TypeScript Configuration

- Target: ES2022
- Module Resolution: bundler
- Strict Mode: enabled
- Output Directory: `./dist`

All TypeScript features with strict type checking are available.

## Database Schema

The template includes four core models:

- **User** - User accounts with email, name, and profile information
- **Account** - Multi-provider credential storage (OAuth, email/password)
- **Session** - Token-based sessions with expiration and metadata
- **Verification** - Temporary records for email verification workflows

Extend the schema by editing `prisma/schema.prisma` and running:
```bash
npx prisma migrate dev --name migration_name
```

## Error Handling

The application includes a global error handler middleware that catches all unhandled errors and returns consistent error responses:
```json
{
  "error": "Error message"
}
```

Route handlers should catch errors or let them bubble to the global handler.

## Adding New Features

### Adding Routes

1. Create a new route file in `src/routes/`
2. Import necessary dependencies and middleware
3. Define route handlers
4. Export the router
5. Mount it in `src/server.ts`

### Adding Database Models

1. Update `prisma/schema.prisma` with new model definitions
2. Run `npx prisma migrate dev --name model_name`
3. Use new models in your route handlers via the Prisma Client

### Extending Middleware

Middleware functions can be created in `src/middleware/` and applied to routes or globally:
```typescript
app.use(customMiddleware);           // Apply globally
router.use(customMiddleware);        // Apply to router
router.get('/route', customMiddleware, handler); // Apply to specific route
```

## Production Deployment

1. Build the application
```bash
npm run build
```

2. Set production environment variables in deployment platform

3. Run migrations on production database
```bash
npx prisma migrate deploy
```

4. Start the production server
```bash
npm start
```

The compiled JavaScript is located in `./dist` and can be served by any Node.js hosting platform.

## Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 5.1.0 | HTTP framework |
| TypeScript | 5.9.3 | Type safety and development |
| Prisma | 6.18.0 | Database ORM |
| Better Auth | 1.3.28 | Authentication system |
| PostgreSQL | 12+ | Database |
| tsx | 4.20.6 | TypeScript execution in development |

## Planned Additions

The following features are planned for upcoming releases:

### Request Validation

- **Zod** - Runtime schema validation for request bodies and query parameters
- Integrated validation middleware for all API routes
- Type-safe validation with automatic TypeScript type inference
- Custom error responses for validation failures

### CORS Configuration

- **CORS Middleware** - Cross-Origin Resource Sharing setup
- Configurable allowed origins for development and production
- Support for credentials, specific HTTP methods, and custom headers
- Environment-based configuration

### Structured Logging

- **Winston** - Production-grade logging library
- Separate logs for different log levels (info, warn, error, debug)
- Request/response logging middleware
- Automatic error tracking with stack traces
- Log rotation for production deployments

### Email Verification

- Email verification workflow during user registration
- Verification token generation and expiration
- Resend verification email functionality
- Automatic account activation after email confirmation
- Integration with email service provider

### Password Reset

- Secure password reset flow with email verification
- Password reset token generation with expiration
- Token validation before password update
- Email notification for successful password changes
- Account security best practices

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
