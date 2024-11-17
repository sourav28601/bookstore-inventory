# Bookstore API

This API provides a set of endpoints to manage books and orders for a bookstore.

## Initial Project Setup

Follow these steps to set up and run the project locally:

1. Clone the Repository
   * `git clone https://github.com/sourav28601/bookstore-inventory.git`
   * `cd bookstore-inventory`

2. Install Dependencies
   * Ensure that Node.js and npm are installed on your system
   * Then run: `npm install`

3. Run the Application
   * Start the server with: `npm start`
   * The API will be accessible at `http://localhost:3000`

4. Swagger Documentation
   * View the Swagger UI for API documentation at:
   * `http://localhost:3000/api-docs/`
  
### API Documentation

The full API documentation can be found at:

[API Documentation](https://docs.google.com/document/d/17ArFTwMOl0qXlvtqVvyaBYudsIB-ArDkPt7IDEeMibI/edit?usp=sharing)

### Endpoints

- BASE_URL: `http://localhost:3000/api`
- Swagger URL: `http://localhost:3000/api-docs/`
- Register Customer: `POST /auth/signup`
- Login Customer: `GET /auth/login`
- Create Book: `POST /book/create`
- Get All Books: `GET /book/all`
- Update Book: `PUT /book/update/:{id}`
- Delete Book: `DELETE /book/delete/:{id}`
- Create Order: `POST /order/create`
- Get All Orders: `GET /order/all`
- Update Order: `PUT /order/update/:{id}`
- Delete Order: `DELETE /order/delete/:{id}`

---

### Authentication

- All API requests require authentication via a JWT Bearer Token.
- Include the token in the Authorization header of the request as follows:

---

### Book Management Endpoints

1. Create a Book

- Endpoint: `POST /book/create`
- Description: Adds a new book to the inventory.
- Request Body:
- Responses:
- `201`: Book created successfully.
- `400`: Invalid input data.

2. Get All Books

- Endpoint: `GET /book/all`
- Description: Retrieves a list of books, with optional filters and pagination.
- Query Parameters:
- `genre`: Filter by genre (string).
- `author`: Filter by author (string).
- `minPrice`: Minimum price filter (number).
- `maxPrice`: Maximum price filter (number).
- `page`: Pagination page number (default: 1).
- `limit`: Number of results per page (default: 10).
- Responses:
- `200`: List of books retrieved successfully.
- `400`: Invalid query parameters.

3. Update a Book

- Endpoint: `PUT /book/update/:{id}`
- Description: Updates an existing book's details.
- Request Body:
  { "title": "Book Title", "author": "Author Name", "genre": "Genre", "isbn": "123-456-789", "price": 19.99 }
- Responses:
- `201`: Book created successfully.
- `400`: Invalid input data.

2. Get All Books

- Endpoint: `GET /book/all`
- Description: Retrieves a list of books, with optional filters and pagination.
- Query Parameters:
- `genre`: Filter by genre (string).
- `author`: Filter by author (string).
- `minPrice`: Minimum price filter (number).
- `maxPrice`: Maximum price filter (number).
- `page`: Pagination page number (default: 1).
- `limit`: Number of results per page (default: 10).
- Responses:
- `200`: List of books retrieved successfully.
- `400`: Invalid query parameters.

3. Update a Book

- Endpoint: `PUT /book/update/:{id}`
- Description: Updates an existing book's details.
- Request Body:
  { "title": "Updated Title", "author": "Updated Author", "genre": "Updated Genre", "isbn": "Updated ISBN", "price": 25.99 }
- Responses:
- `200`: Book updated successfully.
- `400`: Invalid input data.
- `404`: Book not found.

4. Delete a Book

- Endpoint: `DELETE /book/delete/:{id}`
- Description: Deletes a book from the inventory.
- Responses:
- `200`: Book deleted successfully.
- `404`: Book not found.

---

### Order Management Endpoints

1. Create an Order

- Endpoint: `POST /order/create`
- Description: Creates a new order for one or more books.
- Request Body:
  { "customer": "customerID", "items": [ { "book": "bookID", "quantity": 2, "price": 19.99, "totalPrice": 39.98 } ] }
- Responses:
- `201`: Order created successfully.
- `400`: Invalid data or insufficient stock.

2. Get All Orders

- Endpoint: `GET /order/all`
- Description: Retrieves a list of orders, with optional filters and pagination.
- Query Parameters:
- `customer`: Filter by customer email (string).
- `status`: Filter by order status (e.g., "Pending", "Shipped").
- `startDate`: Filter by order start date.
- `endDate`: Filter by order end date.
- `page`: Pagination page number (default: 1).
- `limit`: Number of results per page (default: 10).
- Responses:
- `200`: Orders retrieved successfully.
- `400`: Invalid query parameters.

3. Update an Order

- Endpoint: `PUT /order/update/:{id}`
- Description: Updates an existing order (e.g., changing status or modifying order items).
- Request Body:
  { "status": "Shipped", "books": [ { "book": "bookID", "quantity": 2, "price": 19.99, "totalPrice": 39.98 } ] }

- Responses:
- `200`: Order updated successfully.
- `400`: Invalid input or insufficient stock.
- `404`: Order not found.

4. Delete an Order

- Endpoint: `DELETE /order/delete/:{id}`
- Description: Cancels an order and removes it from the system.
- Responses:
- `200`: Order deleted successfully.
- `404`: Order not found.

---

### Error Codes

- `400`: Bad Request – Invalid or missing parameters in the request.
- `401`: Unauthorized – Authentication is required.
- `404`: Not Found – Resource (book/order) not found.
- `500`: Internal Server Error – Unexpected error occurred.
