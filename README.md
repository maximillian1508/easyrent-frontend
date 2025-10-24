# EasyRent Frontend

A modern React-based frontend application for managing rental properties, built with Mantine UI components and Redux state management.

## Overview

EasyRent Frontend is a comprehensive property rental management platform that enables landlords and tenants to manage properties, applications, contracts, payments, and maintenance requests efficiently.

## Tech Stack

- **Framework**: React 18.2
- **UI Library**: Mantine 7.11
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Mantine Core + Custom CSS
- **Payment Processing**: Stripe
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Authentication**: JWT with jwt-decode

## Features

- **Authentication & Authorization**
  - User registration and login
  - Email verification
  - JWT-based session management

- **Property Management**
  - Browse available properties
  - View property details
  - Search and filter properties

- **Application System**
  - Submit rental applications
  - Track application status

- **Contract Management**
  - View and manage rental contracts
  - Digital contract signing

- **Payment Processing**
  - Secure payment via Stripe
  - Transaction history
  - Payment tracking

- **Complaint/Maintenance**
  - Submit maintenance requests
  - Track complaint status

- **User Dashboard**
  - Personalized user experience
  - Role-based views (Landlord/Tenant)

## Project Structure

```
src/
├── app/               # Redux store configuration
├── components/        # Reusable React components
├── config/            # App configuration
├── features/          # Feature-based modules
│   ├── applications/  # Rental application management
│   ├── auth/          # Authentication
│   ├── complaints/    # Maintenance requests
│   ├── contracts/     # Contract management
│   ├── properties/    # Property listings
│   ├── transactions/  # Payment transactions
│   └── users/         # User management
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   ├── AboutUs/
│   ├── EmailVerification/
│   ├── Faq/
│   ├── Home/
│   ├── Register/
│   └── RegisterConfirmation/
├── App.jsx            # Main app component
└── index.jsx          # Application entry point
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see easyrent-backend)

## Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd easyrent-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Available Scripts

### `npm start`

Runs the app in development mode on port 3004.
Open [http://localhost:3004](http://localhost:3004) to view it in your browser.

The page will reload when you make changes.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
The build is optimized and minified for best performance.

### `npm run eject`

**Warning: This is a one-way operation!**

Ejects from Create React App configuration for full control over build tools.

## Development

### Code Formatting

This project uses Biome for code formatting:

```bash
npx biome format --write .
```

### Key Dependencies

- **@mantine/core**: UI component library
- **@mantine/hooks**: React hooks for common use cases
- **@mantine/notifications**: Toast notifications
- **@mantine/modals**: Modal management
- **@mantine/dates**: Date picker components
- **@reduxjs/toolkit**: State management
- **react-router-dom**: Client-side routing
- **@stripe/react-stripe-js**: Stripe payment integration
- **axios**: HTTP client for API calls

## API Integration

The frontend communicates with the backend API through Axios. API endpoints are configured in the feature slices using Redux Toolkit's `createAsyncThunk`.

Base API URL should be set via environment variable `REACT_APP_API_URL`.

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token is stored in Redux state and localStorage
4. Token is included in subsequent API requests via Axios interceptors
5. Protected routes check for valid token

## Deployment

### Production Build

```bash
npm run build
```

The build folder will contain optimized static files ready for deployment.

### Docker Support

Build the production image:
```bash
docker build -f Dockerfile.prod -t easyrent-frontend:latest .
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Related Projects

- [EasyRent Backend](../easyrent-backend/README.md) - Backend API server
