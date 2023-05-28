# InstaYum!
Rediscover the joy of cooking.  
Powered by Google Cloud, MongoDB Atlas, Vue and Nest.js.

## Requirements
`.env` file with the following structure is required to launch the app:  
`MONGODB_USER=<your-user-here>`  
`MONGODB_PASSWORD=<your-password-here>`  
`MONGODB_URI=<your-uri-here>`  
`MONGODB_DBNAME=<your-db-name-here>`  

## Launch the app
Open a terminal in the root directory and type:
1. `npm i`
2. `cd instayum-front`  
3. `npm run dev`  

Open another terminal in the root directory:  
1. `cd instayum-back`  
2. `npm run start:dev`  

Finally, go to `http://localhost:5173/` in your browser.
