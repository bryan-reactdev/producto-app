# ProductoApp

A mobile application for product management built with React Native (Expo) frontend and Express backend.

## Features

- **Product Management**: Add, view, and delete products
- **Barcode Scanning**: Scan product barcodes to find existing products
- **Admin Mode**: PIN-protected admin mode for creation and deletion features
- **Image Upload**: Upload product images with automatic optimization
- **Barcode Generation**: Generate and download barcodes for products
- **Search**: Search products by name or barcode

## Admin Mode

The app includes a PIN-protected admin mode that restricts creation and deletion features to authorized users only:

- **PIN**: `1234` (configurable in `frontend/src/hooks/useAdminMode.js`)
- **Admin Features**:
  - Add new products
  - Delete existing products
  - Create products from scanned barcodes
- **Regular User Features**:
  - View all products
  - Scan barcodes to find products
  - Download product barcodes

To enable admin mode:
1. Tap the "Admin Mode" button on the main screen
2. Enter the PIN when prompted
3. Admin features will become available
4. Tap "Admin Mode ON" to disable admin mode

## Project Structure

- `/frontend` - React Native Expo application
- `/backend` - Express.js API server

## Requirements

- Node.js 16+
- MySQL database
- Expo CLI (for frontend development)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials and other configuration.

5. Set up the database:
```bash
npm run setup-db
```

6. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL.

5. Start the Expo development server:
```bash
npm start
```

## Production Deployment

### Option 1: Docker Deployment (Recommended)

The easiest way to deploy the backend and database is using Docker:

1. Make sure Docker and Docker Compose are installed on your server.

2. Clone this repository to your server:
```bash
git clone https://github.com/yourusername/producto-app.git
cd producto-app
```

3. Set environment variables or create a `.env` file in the project root:
```bash
# Required environment variables
DB_PASSWORD=your_secure_password
MYSQL_ROOT_PASSWORD=your_secure_root_password
API_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

4. Build and start the containers:
```bash
docker-compose up -d
```

5. The backend API will be available at http://your-server-ip:3000

### Option 2: Manual Backend Deployment

1. Set up your production server with Node.js and MySQL.

2. Clone this repository and navigate to the backend directory.

3. Install production dependencies:
```bash
npm install --production
```

4. Create a `.env` file with production settings:
```bash
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=producto-db
DB_PORT=3306
API_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

5. Set up the database:
```bash
npm run setup-db
```

6. Start the server in production mode:
```bash
npm run start:prod
```

7. For PM2 or other process managers:
```bash
pm2 start npm --name "producto-backend" -- run start:prod
```

### Frontend Deployment

#### Option 1: Expo EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

3. Configure EAS in your project:
```bash
cd frontend
eas build:configure
```

4. Update your `app.json` with your Expo project ID.

5. Build the app for the desired platforms:
```bash
eas build --platform android  # For Android
eas build --platform ios      # For iOS
eas build --platform all      # For both
```

6. Submit to app stores:
```bash
eas submit --platform android
eas submit --platform ios
```

#### Option 2: Expo Classic Build

1. In the frontend directory, build the production version:
```bash
expo build:android  # For Android
expo build:ios      # For iOS
```

2. For web deployment:
```bash
expo build:web
```

3. Deploy the generated static files to your web server.

## Production Checklist

Before deploying to production, ensure the following:

- [ ] Environment variables are properly set
- [ ] Database is properly configured and secured
- [ ] API endpoints are secured with proper authentication (if needed)
- [ ] Frontend is configured to use the production API URL
- [ ] Error handling is implemented for all API calls
- [ ] Images are properly optimized
- [ ] Performance testing has been done
- [ ] Security testing has been done
- [ ] Admin PIN is changed from default (1234) to a secure value

## Monitoring and Maintenance

- Set up logging with Winston (already included in backend)
- Consider setting up monitoring with tools like PM2, New Relic, or Datadog
- Regularly backup the database
- Keep dependencies updated

## License

MIT 