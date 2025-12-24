# How to Reset the Database

Since we added a new `created_at` field to the User model, you must reset your database to apply the changes (unless you are using a migration tool like Alembic).

## Option 1: Docker (Recommended)

Run the following commands in your terminal:

```powershell
# Stop containers and remove volumes (THIS DELETES ALL DATA)
docker compose down -v

# Rebuild and start fresh
docker compose up --build
```

## Option 2: Local Development

If you are running the backend locally with `uvicorn` and a local Postgres instance (not Docker):

1. Connect to your Postgres database.
2. Drop the `users` table: `DROP TABLE users;`
3. Restart the backend. It will recreate the table with the new schema.
