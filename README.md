# InstaYum!
<img src="https://i.imgur.com/4cxYdeK.png" width="400">

### Rediscover the joy of cooking.  
Powered by Google Cloud, MongoDB Atlas, Vue and Nest.js.

## Requirements
To launch the backend locally, an `.env` file with the following structure is required
(in the backend directory) to launch the app:  
```
MONGODB_USER=<your-user-here>
MONGODB_PASSWORD=<your-password-here>
MONGODB_URI=<your-uri-here>
MONGODB_DBNAME=<your-db-name-here>
PORT=<your-port-here>
```

## Launch the app locally
1. Create an `.env` file in the backend directory, and fill it in with your MongoDB connection data and the port.  
2. Open a terminal in the root directory and type:
```
cd instayum-front
npm i
npm run dev
``` 

3. Open another terminal in the root directory:  
```
cd instayum-back
npm i
npm run start:dev
```
4. Finally, go to `http://localhost:3000/` in your browser.

## Deploy the app
If you would like to deploy the app to Google Cloud:
1. Add an `app.yaml` file in the backend directory with the following structure:
```
runtime: nodejs18

env_variables:
  MONGODB_USER: '<your-mongodb-user>'
  MONGODB_PASSWORD: '<your-mongodb-password>'
  MONGODB_URI: '<your-mongodb-URI>'
  MONGODB_DBNAME: '<your-mongodb-name>'

service: backend
env: standard
```

2. Add an `app.yaml` file in the frontend directory with the following structure:
```
runtime: nodejs18
handlers:
  # Serve all static files with urls ending with a file extension
  - url: /(.*\..+)$
    static_files: dist/\1
    upload: dist/(.*\..+)$
    # catch all handler to index.html
  - url: /.*
    static_files: dist/index.html
    upload: dist/index.html
env_variables:
  VITE_API_URL: "<your-backend-API-url>"
```

3. Using the terminal/Google Cloud CLI:
`gcloud app deploy instayum-back instayum-front`
