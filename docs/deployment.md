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

## Deploy the backend on Render

The repository includes a Render Blueprint at `render.yaml`. It configures a Node.js web service from `server/`, runs `npm ci` and `npm start`, and checks `GET /api/v1/health`. Render's documented Node web service requirements are to bind to `0.0.0.0` and use the assigned `PORT`; the API server does this.

1. Make sure the Render Blueprint changes have been merged into the `develop` branch.
2. In the Render Dashboard, create a **Blueprint** and connect the public `tuananh-0/cookmate` GitHub repository. Select the `develop` branch and the repository's `render.yaml`.
3. Review the planned service before applying it. The Blueprint uses the Free plan in the Virginia region, matching the service created for CookMate.
4. When prompted for `MONGO_URI`, enter the current Atlas connection string after rotating any credential that was exposed. Never put it in the repository or a Pull Request. Render generates `JWT_SECRET`; it sets `JWT_EXPIRE=7d` and `NODE_ENV=production`.
5. After the first service is created, open its **Connect → Outbound** panel in Render and copy the outbound IP ranges for the service's configured region. Add those CIDR ranges to the Atlas project's **Network Access / IP Access List**. Atlas must allow the Render service's outbound addresses as well as your development machine if you still connect locally. Render's [outbound IP guide](https://render.com/docs/outbound-ip-addresses) explains where to find the current ranges; these are shared ranges and can change, so review them if connectivity later stops.
6. Apply or redeploy the Blueprint and watch the service's deploy logs. A successful deploy should show `MongoDB connected` and then `CookMate API is listening on port ...`.
7. Copy the service's public `onrender.com` URL and request `/api/v1/health` and `/api/v1/recipes` in Postman. Both should return HTTP 200. An empty recipes array is valid if the Atlas database has no recipes yet.

Render Free services can spin down after 15 minutes without inbound requests, so the first request after inactivity may take about a minute. Render describes Free instances as suitable for hobby/testing rather than production; review [current Free plan limits](https://render.com/docs/free). See Render's [Blueprint reference](https://render.com/docs/blueprint-spec) and [web service port requirements](https://render.com/docs/web-services) for the configuration details.

After the API deploy succeeds, configure its custom domain (for example, `api.cookmate.id.vn`) in Render and add the DNS records shown by Render in the P.A Việt Nam domain dashboard. Keep this separate from the frontend domain setup. Render documents that web services bind to `0.0.0.0` and use `PORT`; see [Render web services](https://render.com/docs/web-services). The Free plan spins services down when idle and can have a cold-start delay, so it is intended for hobby/testing rather than production; see [Free plan limitations](https://render.com/docs/free).

## Deploy the frontend on Render

The same `render.yaml` Blueprint also defines a Render Static Site for the React/Vite client.

1. After the frontend Blueprint change is merged into `develop`, create or update the Blueprint in Render using the `develop` branch. Its backend service is named `cookmate`, matching the existing Render service.
2. Review the `cookmate-web` static site. It builds from `client/` with `npm ci && npm run build` and publishes `dist/`.
3. Confirm the build-time variable `VITE_API_URL` is `https://cookmate-j4o2.onrender.com/api/v1`. This value is included in the public frontend bundle, so it must contain no credentials or other secrets.
4. Apply the Blueprint and wait for the static site deploy to succeed. Open its `onrender.com` URL, then visit `/`, `/recipes`, and `/login`. Refresh a nested route such as `/recipes` to verify the SPA rewrite returns the React app.
5. In the browser, confirm recipes load from the production API and the browser console has no network/CORS errors. Render's React Router fallback uses a rewrite to `/index.html`; see [Static Site redirects and rewrites](https://render.com/docs/redirects-rewrites).

After frontend testing succeeds, add `cookmate.id.vn` as a custom domain on the static site and configure the DNS records shown by Render in the P.A Việt Nam dashboard. Keep `api.cookmate.id.vn` for the backend if you later add that API custom domain.
