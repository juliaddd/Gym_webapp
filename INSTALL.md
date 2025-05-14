# Installation Instructions

Follow these steps to install and run the project locally:

1. **Clone the Repository**
        ```
        git clone https://gitlab.ujaen.es/yd000015/WBT2425_team10.git
        cd WBT2425_team10
        ```

2.  **Database Setup:**
    * Create a database in phpMyAdmin.
    * Import the project's database into it.
    * Import files category.sql, user.sql, training.sql to add data to your database
    * Configure the `webapp` user with CRUD privileges for this database.
    * In the `adtabase.py` file, replace `PASSWORD` with your database password in the line `SQLALCHEMY_DATABASE_URL = "mysql+pymysql://webapp:PASSWORD@localhost/webapp"`.

2.  **Backend (FastAPI) Setup and Run:**
    * Create a virtual environment:
        ```
        python -m venv .venv
        ```
    * Activate the virtual environment:
        * Windows: `.venv\Scripts\activate`
        * macOS/Linux: `source .venv/bin/activate`
    * Install dependencies:
        ```
        pip install -r requirements.txt
        ```
    * Navigate to the `fastapi` directory:
        ```
        cd fastapi
        ```
    * Run the FastAPI server:
        ```
        fastapi dev main.py
        ```

3.  **Frontend (React) Setup and Run:**
    * Navigate to the `react` directory:
        ```
        cd react
        ```
    * Install dependencies:
        ```
        npm install
        ```
    * Run the React application:
        ```
        npm run dev
        ```

After completing these steps, the project should be running locally.