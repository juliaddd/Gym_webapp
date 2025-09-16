# Installation Instructions

Follow these steps to install and run the project locally:

1. **Clone the Repository**
        ```
        git clone [https://gitlab.ujaen.es/yd000015/WBT2425_team10.git](https://github.com/juliaddd/Gym_webapp.git)
        cd Gym_webapp
        ```

2.  **Database Setup:**
    1. Create a new database (e.g., webapp) using phpMyAdmin
    2. Import the schema and seed data:

        - Category.sql
        - User.sql
        - Training.sql

    3. Configure the `webapp` user with CRUD privileges for this database.
    4. Create `.env` file and set your database password:
    
     `SQLALCHEMY_DATABASE_URL = "mysql+pymysql://webapp:PASSWORD@localhost/webapp"`.

3.  **Backend (FastAPI) Setup and Run:**

    1. Create a virtual environment:
        ```
        python -m venv .venv
        ```
    2. Activate the virtual environment:
        * Windows: `.venv\Scripts\activate`
        * macOS/Linux: `source .venv/bin/activate`
    3. Install dependencies:
        ```
        pip install -r requirements.txt
        ```
    4. Navigate to the `fastapi` directory:
        ```
        cd fastapi
        ```
    5. Run the FastAPI server:
        ```
        fastapi dev main.py
        ```

4.  **Frontend (React) Setup and Run:**
    1. Navigate to the `react` directory:
        ```
        cd react
        ```
    2. Install dependencies:
        ```
        npm install
        ```
    3. Run the React application:
        ```
        npm run dev
        ```

    After completing these steps, react app will run at http://localhost:3000.

5. **Test Credentials**

    | Role  | Login                  | Password     |
    | ----- | ---------------------- | ------------ |
    | Admin | `cooladmin2@gmail.com` | `COOLadmin2` |
    | User  | `testuser2@gmail.com`  | `TESTuser2`  |



    After logging in admin acount you can  create a new user and try out user features.
    Last training data update was 08.09.2025 - 15.09.2025. If you want to see charts, scroll to this dates.
