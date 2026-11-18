# CookMate API Collection (V1)

This collection covers the V1 endpoints only. For the current V2 API contract, use the public Swagger UI linked below.

Postman Local Mode no longer loads JSON collections from this workspace folder automatically. Import the collection file manually:

1. In Postman, choose **Import**.
2. Select `collections/CookMate API.postman_collection.json`.
3. The collection's `baseUrl` defaults to the production API, `https://cookmate-j4o2.onrender.com`. Set it to `http://localhost:5000` for local development.
4. Run **Register** or **Login** first. The collection stores the returned JWT in its `token` variable for authenticated requests.

## Public production API

- API base URL: <https://cookmate-j4o2.onrender.com>
- Swagger UI: <https://cookmate-j4o2.onrender.com/api-docs>
- Health check: <https://cookmate-j4o2.onrender.com/api/v1/health>
- Public recipe list: <https://cookmate-j4o2.onrender.com/api/v1/recipes>

The recipe endpoint can return `{"count":0,"recipes":[]}` when no recipes have been added; that is a successful response. Use the health and recipe-list requests for safe production smoke checks. Requests that create, update, or delete data should only be sent with intentional test data and an authorized account.

The collection is kept in Postman Collection v2.1 JSON format for importing into Postman and running V1 requests.

## apidoc-style source

Endpoint annotations using the `@api` comment format are maintained in `docs/api.apidoc.js`. They document V1 methods, paths, parameters, request bodies, responses, authentication, and errors. Swagger is the current V2 reference; the Postman collection remains the runnable V1 request set.
