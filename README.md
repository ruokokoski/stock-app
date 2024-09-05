# stock-app

This stock market app is a 10-credit project developed for the Fullstack Open course at the University of Helsinki.

The application is a web application designed for monitoring stock markets. It fetches real-time stock data from a stock API, allowing users to track historical data for both indices and individual stocks. Detailed information and fundamental metrics for individual stocks can also be displayed. Users can create their own stock portfolios within the application, which are saved in a database. Additionally, users can create watchlists and screen stocks based on selected metrics.

## Tech Stack
- **Backend:** The backend of the application is built using **Node.js**, which is used to handle server-side logic, manage API requests, and interact with the database. Node.js provides an efficient environment for processing real-time data and handling asynchronous operations.
- **Frontend:** The frontend of the application is developed using **React**, a JavaScript library for building user interfaces, and **Vite**, a modern build tool that offers fast development server start-up and optimized build performance.
- **Database:** The application uses **PostgreSQL** as its database management system. PostgreSQL is a powerful, open-source relational database that provides robust performance, reliability, and support for complex queries.

## Documents
- [Requirement specs](./documents/requirement_specs.md)
- [Comparison of stock APIs](./documents/stock_apis.md)
- [Hours tracking](./documents/timetracking.md)

## Installation
### Prerequisites

1. **Node.js**: Ensure you have Node.js (version 20 or higher) installed. You can download it from [nodejs.org](https://nodejs.org/).
2. **npm**: Node.js comes with npm (Node Package Manager) installed. Alternatively, you can use **yarn** if preferred.
3. **Fly.io Signup**: Create an account on [Fly.io](https://fly.io) for deploying and hosting the application.
4. **API Registrations**:
   - **Tiingo API**: Sign up for a free Tiingo API key from [Tiingo](https://www.tiingo.com).
   - **TwelveData API**: Register for a free TwelveData API key at [TwelveData](https://twelvedata.com). 

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ruokokoski/stock-app.git
   cd stock-app
   ```
2. **Install backend dependencies**:
   ```bash
   npm install
   ```
3. **Create Fly.io app**:
   
   Create new fly.io app in the main directory of the cloned repository. Setup also Postgres database during creation as it is needed already in development phase. When creating the app, the password of the database is revealed. Remember to save it somewhere.
   ```bash
   fly launch
   ```
4. **Set Up Environment Variables**:
   
   Create a .env file in the main directory and add the necessary environment variables
   ```bash
   DATABASE_URL=postgres://postgres:<thepasswordishere>@127.0.0.1:5432/postgres
   PORT=3000
   SECRET=<your own secret>
   TIINGO_API_KEY=<your own API key>
   TWELVEDATA_API_KEY=<your own API key>
   ```
5. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

## Running the app in development mode

1. **Set up the local connection to the database**:

   You need to create a tunnel to connect your local machine to the Fly.io database. This allows the local app to use the remote Fly.io PostgreSQL database.
   
   Run the following command and leave it running while database is being used:
   ```bash
   flyctl proxy 5432 -a <fly.io-app-name>-db
   ```
  
2. **Start the development server**:

   In the root of your project, start the backend server by running:
   ```bash
   npm run dev
   ```

3. **Start the frontend**:

   Navigate to the frontend directory and start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application**:

   The app should now be accessible at http://localhost:5173. You can open this URL in your browser to view and interact with the app.

## Deploying the app to Fly.io

To deploy the stock market app to Fly.io, follow these steps:

1. **Build the frontend**:

   Before deploying, ensure that the frontend is built and ready for production. Run the following command in the frontend directory:
   ```bash
   cd frontend
   npm run build
   ```
   This command compiles the frontend and optimizes it for production, creating a dist folder that contains the static files to be served.

2. **Deploy the app to Fly.io**:

   Once the frontend is built, you're ready to deploy the app to Fly.io. Run the following command:
   ```bash
   fly deploy
   ```

3. **Post-Deployment Tasks**:

   After deploying, Fly.io will provide a public URL where your app is hosted. Visit this URL to check if everything is working as expected.


## Testing

To run tests for the application, use the following command:
```bash
   npm test
```

## Eslint

Run ESLint to check for code quality and style issues. To run ESLint, use:
```bash
   npm run lint
```
