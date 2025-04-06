# Bookstore API

A simple RESTful API for managing books, authors, and genres with user authentication using JWT. The API allows users to register, login, and manage books, authors, and genres.

## Features

- **User Authentication**: JWT-based authentication for secure access to the API.
- **Book Management**: Create, read, update, and delete (CRUD) books.
- **Author Management**: CRUD operations for authors.
- **Genre Management**: CRUD operations for genres.
- **Relationships**: Assign authors and genres to books.
- **Filtering and Sorting**: Filter and sort books by title, author, and genre.

## Endpoints

### Authentication

- **POST /api/register**: Register a new user
  - Request Body: `{ "username": "user", "password": "password" }`
  - Response: `{ "message": "User registered successfully" }`

- **POST /api/login**: Login and get a JWT token
  - Request Body: `{ "username": "user", "password": "password" }`
  - Response: `{ "token": "your-jwt-token" }`

### Book Management

- **GET /api/books**: Get all books
  - Query Params: `?title={title}&author={author}&genre={genre}` (optional filtering)
  - Response: 
    ```json
    [ 
      { 
        "id": "bookId", 
        "title": "Book Title", 
        "author": "Author Name", 
        "genre": "Genre Name" 
      } 
    ]
    ```

- **POST /api/books**: Create a new book
  - Request Body: `{ "title": "Book Title", "authorId": "authorId", "genreId": "genreId" }`
  - Response: `{ "message": "Book created successfully" }`

- **GET /api/books/{bookId}**: Get book by ID
  - Response: 
    ```json
    { 
      "id": "bookId", 
      "title": "Book Title", 
      "author": "Author Name", 
      "genre": "Genre Name" 
    }
    ```

- **PUT /api/books/{bookId}**: Update a book
  - Request Body: `{ "title": "Updated Title", "authorId": "authorId", "genreId": "genreId" }`
  - Response: `{ "message": "Book updated successfully" }`

- **DELETE /api/books/{bookId}**: Delete a book
  - Response: `{ "message": "Book deleted successfully" }`

### Author Management

- **GET /api/authors**: Get all authors
  - Response:
    ```json
    [ 
      { 
        "id": "authorId", 
        "name": "Author Name" 
      } 
    ]
    ```

- **POST /api/authors**: Create a new author
  - Request Body: `{ "name": "Author Name" }`
  - Response: `{ "message": "Author created successfully" }`

- **GET /api/authors/{authorId}**: Get author by ID
  - Response:
    ```json
    { 
      "id": "authorId", 
      "name": "Author Name" 
    }
    ```

- **PUT /api/authors/{authorId}**: Update an author
  - Request Body: `{ "name": "Updated Author Name" }`
  - Response: `{ "message": "Author updated successfully" }`

- **DELETE /api/authors/{authorId}**: Delete an author
  - Response: `{ "message": "Author deleted successfully" }`

### Genre Management

- **GET /api/genres**: Get all genres
  - Response:
    ```json
    [ 
      { 
        "id": "genreId", 
        "name": "Genre Name" 
      } 
    ]
    ```

- **POST /api/genres**: Create a new genre
  - Request Body: `{ "name": "Genre Name" }`
  - Response: `{ "message": "Genre created successfully" }`

- **GET /api/genres/{genreId}**: Get genre by ID
  - Response:
    ```json
    { 
      "id": "genreId", 
      "name": "Genre Name" 
    }
    ```

- **PUT /api/genres/{genreId}**: Update a genre
  - Request Body: `{ "name": "Updated Genre Name" }`
  - Response: `{ "message": "Genre updated successfully" }`

- **DELETE /api/genres/{genreId}**: Delete a genre
  - Response: `{ "message": "Genre deleted successfully" }`

## Tech Stack

- **Backend**: Express.js (Node.js)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **ORM/ODM**: Mongoose (MongoDB Object Modeling)
- **Middleware**: Error handling middleware for managing API errors

## Requirements

- Node.js
- MongoDB instance running locally or via a cloud service (e.g., MongoDB Atlas)
- JWT Secret Key (for signing JWT tokens)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bosukeme/bookstore-api.git
   cd bookstore-api
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up your MongoDB connection in `.env`:
    ```bash
    MONGO_URI=mongodb://localhost:27017/bookstore
    PORT=3000
    NODE_ENV=development 
    JWT_SECRET=your-jwt-secret-key
    JWT_EXPIRES_IN=3600
    ```
4. Run the server:
    ```bash
    npm start
    ```
    The API will be running at http://localhost:3000


### Running Docker

Navigate to the root directory

```bash
docker-compose up --build
```

### visit 
```bash
http://localhost:3000/
```

To stop the containers

```bash
docker-compose stop
```

## Run Tests
```bash
npm test
```


## Testing
-  You can use Postman to test the API.
- Import the provided Postman collection to quickly get started with testing the API endpoints.
- <a href="https://universal-eclipse-789093.postman.co/workspace/Tut~3b57b19b-0969-4c17-9493-1b51587c990d/collection/8343801-02b66011-af4f-484f-8e56-8c616aaa624a?action=share&creator=8343801&active-environment=8343801-c29dabec-62f9-4a45-810e-ba39c3eece1e" target="_blank">  Postman Collection URL </a>


## Contributing
If you would like to contribute, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bugfix.
- Submit a pull request.


## Authors

Ukeme Wilson
- <a href="https://www.linkedin.com/in/ukeme-wilson-4825a383/">Linkedin</a>.
- <a href="https://medium.com/@ukemeboswilson">Medium</a>.
- <a href="https://www.ukemewilson.sbs/">Website</a>.
