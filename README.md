# Zebra Project

## Clone Repository

To clone this repository to your local machine, use the following command:

```bash
git clone https://github.com/ProElecttro/Zebra-server.git
```

## Install Dependencies

Navigate to the project's root directory and install the dependencies using npm or yarn:

```bash
cd .\Zebra-server
npm install
```

## Setup Environment Variables

Create a file named `.env` in the root directory of your project with the following content:

```env
POSTGRES_USERNAME = "your_postgres_username"
POSTGRES_PASSWORD = "your_postgres_password"
TOKEN_SECRET = your_token_secret
```

Replace the placeholder values (`your_postgres_username`, `your_postgres_password`, `your_token_secret`) with your actual credentials and secrets.

**Note:**
- Do not share your `.env` file publicly or commit it to version control systems. It contains sensitive information.
- Ensure the values are surrounded by double quotes for username and password.

---

## Run the Application

To run the application in development mode with automatic code reloading, use:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3003`.

---

