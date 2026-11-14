# CookMate API Collection

Postman Local Mode no longer loads JSON collections from this workspace folder automatically. Import the collection file manually:

1. In Postman, choose **Import**.
2. Select `collections/CookMate API.postman_collection.json`.
3. Set the collection variable `baseUrl` to `http://localhost:5000` for local development, or to the deployed API origin.
4. Run **Register** or **Login** first. The collection stores the returned JWT in its `token` variable for authenticated requests.

The collection is kept in Postman Collection v2.1 JSON format so it can be imported into Postman and published as public API documentation.

## apidoc-style source

Endpoint annotations using the `@api` comment format are maintained in `docs/api.apidoc.js`. They document methods, paths, parameters, request bodies, responses, authentication, and errors. This is the source reference; the Postman collection remains the runnable request set.
