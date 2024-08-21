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

- **Node.js**: Ensure you have Node.js (version 20 or higher) installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node.js comes with npm (Node Package Manager) installed. Alternatively, you can use **yarn** if preferred.

### Backend Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ethervortex/stock-app.git
   cd stock-app
   ```
2. **Install backend dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   
   Create a .env file in the backend directory and add the necessary environment variables
   ```bash
   DATABASE_URL=xx
   PORT=3000
   SECRET=<your own secret>
   ```
4. **xx**:

### Building frontend

To build the frontend, use:
```bash
   npm run build
```

### Running the app

To start the development server, use:
```bash
   npm run dev
```

To start the app in production mode, use:
```bash
   npm start
```
### Testing

To run tests for the application, use the following command:
```bash
   npm test
```

### Eslint

Run ESLint to check for code quality and style issues. To run ESLint, use:
```bash
   npm run lint
```
