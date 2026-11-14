# MongoDB Atlas setup

This guide prepares the CookMate API to use a MongoDB Atlas cluster. The server already reads `MONGO_URI` from `server/.env`; it does not need a separate Atlas-specific code path.

## Create and secure an Atlas deployment

1. Create an Atlas project and database deployment in your MongoDB account.
2. Add a **database user** for the application. Give it only the permissions needed for the `cookmate` database (typically `readWrite`); this is separate from your Atlas website account.
3. Add the public IP address of the computer running the API to the project's IP access list. For local testing, use your current IP. For a hosted API, add the server host's required outbound IP addresses later. Avoid allowing access from every IP (`0.0.0.0/0`) unless you have a deliberate, temporary reason.
4. In Atlas, choose **Connect** for the deployment and copy the connection string for an application using the Node.js driver. Replace its username, password, and database name with the database user's values and `cookmate`.

MongoDB's official guides: [connect an application](https://www.mongodb.com/docs/atlas/driver-connection/) and [configure the IP access list](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

## Configure the local API

1. Copy `server/.env.example` to `server/.env` if you have not already created it.
2. Set `MONGO_URI` in `server/.env` to the Atlas connection string. Keep the URI private. If the database password contains reserved URI characters, percent-encode them before placing the password in the URI.
3. Keep `server/.env` out of Git. The repository `.gitignore` excludes it. Do not paste the URI or password into issues, pull requests, or chat.
4. Start the API:

   ```powershell
   cd server
   npm run dev
   ```

The API only starts listening after Mongoose connects, so `MongoDB connected` followed by the local API URL confirms the Atlas connection. Then request `GET http://localhost:5000/api/v1/health` and `GET http://localhost:5000/api/v1/recipes` in Postman. The recipes endpoint may return an empty list until recipes are created or seeded.

## Before deploying the API

- Set `MONGO_URI` and a new, strong `JWT_SECRET` in the hosting provider's secret/environment settings. Do not reuse local development secrets.
- Replace the local IP access-list entry with the API host's documented outbound IP address or addresses when available.
- Keep the database user scoped to the application database and rotate credentials if they are exposed.

The actual Atlas cluster and its credentials must be created in the project owner's Atlas account; this repository intentionally contains no live credentials.
