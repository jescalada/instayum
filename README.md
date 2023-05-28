# InstaYum!
Rediscover the joy of cooking.  
Powered by Google Cloud, MongoDB Atlas, Vue and Nest.js.

## Requirements
`.env` file with the following structure is required to launch the app:  
```
MONGODB_USER=<your-user-here>
MONGODB_PASSWORD=<your-password-here>
MONGODB_URI=<your-uri-here>
MONGODB_DBNAME=<your-db-name-here>
```

## Launch the app
1. Create an `.env` file in the root directory, and fill it in with your MongoDB connection data.  
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
4. Finally, go to `http://localhost:5173/` in your browser.
