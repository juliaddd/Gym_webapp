# Installation Instructions

Follow these steps to install and run the project using Docker:

1. **Clone the Repository**

    ```
    git clone https://github.com/juliaddd/Gym_webapp.git
    cd Gym_webapp
    ```
2.  **Configure `.env` File**

    Create a .env file in the root directory and set up the following variables:
    
     ```
    # Database connection URL for FastAPI
    SQLALCHEMY_DATABASE_URL=mysql+pymysql://webapp:yourpassword@db:3306/webapp

    # Database credentials for MariaDB service
    MYSQL_ROOT_PASSWORD=yourrootpassword
    MYSQL_DATABASE=webapp
    MYSQL_USER=webapp
    MYSQL_PASSWORD=yourpassword
    ```

    Replace yourpassword and yourrootpassword with your actual passwords.

3.  **Docker Setup and Run**

    Make sure you have Docker and Docker Compose installed.

    Build and run the containers
    ```
    docker-compose up --build
    ```
    
4.  **Access the Application**
    
    After successfully building the containers, you can access the application through your browser:

    - Frontend (React): http://localhost:3000
    - Backend (FastAPI): http://localhost:8000

6. **Test Credentials**

    | Role  | Login                  | Password     |
    | ----- | ---------------------- | ------------ |
    | Admin | `cooladmin2@gmail.com` | `COOLadmin2` |
    | User  | `testuser2@gmail.com`  | `TESTuser2`  |



    After logging into the admin account, you can create a new user and try out user features.
The last training data update was from 08.09.2025 to 15.09.2025. To see charts, select this date range.

6. **Stopping the Application**

    To stop the application, use:
    ```
    docker-compose down
    ```
