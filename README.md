# Personal Expense Tracker API

## Objective

This project aims to develop a RESTful API for managing personal financial records, enabling users to track income and expenses, retrieve transaction history, and generate financial summaries.

## Tools and Technologies

- **Backend Framework**: Node.js with Express.js
- **Database**: 
  - SQLite (for simplicity) or 
  - MongoDB (if you prefer a NoSQL solution)

## Requirements

### Database Setup

**For SQLite**:
- Create a database with the following tables:
  - **transactions**: 
    - `id` (INTEGER, PRIMARY KEY)
    - `type` (TEXT: "income" or "expense")
    - `category` (TEXT)
    - `amount` (REAL)
    - `date` (DATE)
    - `description` (TEXT)
  - **categories**: 
    - `id` (INTEGER, PRIMARY KEY)
    - `name` (TEXT)
    - `type` (TEXT: "income" or "expense")

**For MongoDB**:
- Define collections:
  - **transactions**: 
    ```json
    {
      "type": "income/expense",
      "category": "string",
      "amount": "number",
      "date": "date",
      "description": "string"
    }
    ```
  - **categories**: 
    ```json
    {
      "name": "string",
      "type": "income/expense"
    }
    ```

### API Endpoints

1. **POST /transactions**: 
   - Adds a new transaction (income or expense).
   - **Request Body**:
     ```json
     {
       "type": "income/expense",
       "category": "string",
       "amount": "number",
       "date": "YYYY-MM-DD",
       "description": "string"
     }
     ```

2. **GET /transactions**: 
   - Retrieves all transactions.

3. **GET /transactions/:id**: 
   - Retrieves a transaction by ID.

4. **PUT /transactions/:id**: 
   - Updates a transaction by ID.
   - **Request Body** (same structure as POST).

5. **DELETE /transactions/:id**: 
   - Deletes a transaction by ID.

6. **GET /summary**: 
   - Retrieves a summary of transactions (total income, total expenses, balance).

### Functionality

- Implement route handlers for each endpoint.
- Provide error handling for common issues (invalid transaction IDs, invalid inputs, etc.).
- **Optional**: Implement user authentication to secure routes and associate transactions with specific users.

## Deliverables

- Source code hosted in a GitHub repository.
- A `README.md` file that includes:
  - Setup and run instructions.
  - API documentation.
  - Postman screenshots demonstrating each API call.

## Bonus (Optional)

- Implement user authentication and link transactions to specific users.
- Add pagination to the `GET /transactions` endpoint.
- Create an endpoint for generating reports (e.g., monthly spending by category).

---

