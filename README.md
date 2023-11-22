# Sail Wrapped 2023
Data processing, backend, and frontend for Sail Wrapped 2023.

Hacked together in 5 days! :D

## Data Collection and Processing
All data was collected using https://github.com/Tyrrrz/DiscordChatExporter, output into the `data` folder in JSON format with UTC normalized timestamps.

A template of the SQLite database can be found in `templates/messages.db`

I kinda half assed data processing so just run in this order:
```
pip install backend/requirements.txt
cp templates/messages.db compiled-data/messages.db
python process_messages.py
python process_users.py
python content_concat.py
python process_constants.py
python process_images.py
cp compiled-data/messages.db backend/messages.db
```

## Running locally for development

### Frontend
Change redirect URLs / API URLs to your own application's URLs in `frontend/sail/consts.js`
```
cd frontend/sail
npm install
npm run start
```

### Backend
Change `CLIENT_ID` and `REDIRECT_URI` in `main.py` 

Change the guild ID in `token_check` to check your own server ID for auth purposes

Create `client_secret` in `backend` directory containing a single line of your Discord Application's secret token
```
python -m venv venv
venv\scripts\activate (or equivalent)
cd backend
pip install -r requirements.txt
flask --app main --debug run
```

## Screenshots
![image](https://github.com/redside100/sail-wrapped-2023/assets/17993728/cceaf52d-13bb-4df4-9873-ddee77d39354)
![image](https://github.com/redside100/sail-wrapped-2023/assets/17993728/94bebe16-1e3a-489f-b3a2-1c74fe736816)
![image](https://github.com/redside100/sail-wrapped-2023/assets/17993728/ba52d7de-800f-487b-bfed-e2f5a6d86b8a)
![image](https://github.com/redside100/sail-wrapped-2023/assets/17993728/1a0f8f47-865b-4232-9f5f-f6116dbf45d6)
![image](https://github.com/redside100/sail-wrapped-2023/assets/17993728/e1bb762b-9e9a-4108-851e-c97ae0667e17)
![image](https://github.com/redside100/sail-wrapped-2023/assets/17993728/fae806ad-eb74-4b60-9b84-80559d0d2c93)
![image](https://github.com/redside100/sail-wrapped-2023/assets/17993728/23deab12-20c1-46f0-ae25-9d300d3409f8)

