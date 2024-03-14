# Express MySQL Authentication App

This application demonstrates a basic Express.js server that connects to a MySQL database to facilitate user sign-up and sign-in functionalities. It uses bcrypt for password hashing to ensure security best practices.

## End points

The application supports the following endpoints:

- `GET /`: A simple route that returns "Hello World!".
- `GET /budgetdata`: Fetches budget data from the MySQL database.
- `POST /signup`: Endpoint for user registration. Expects `username` and `password` in the request body.
- `POST /signin`: Endpoint for user login. Expects `username` and `password` in the request body.

## Authentication Approach

For the sign-in process, we adopt a two-step approach for security and data integrity reasons:

1. **Fetching the User**: The server fetches the user data from the database using the provided username. This step ensures that user data retrieval is based solely on the username, avoiding direct comparison of passwords at the database level.

2. **Password Verification**: Once the user data is retrieved, we use bcrypt to compare the provided password with the hashed password stored in the database. Bcrypt's comparison method is secure and accounts for the hashing process's intricacies, ensuring that even if two passwords look similar, they must match exactly as hashed values to pass verification.

This is best possible approach
