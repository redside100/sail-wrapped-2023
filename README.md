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

Create `client_secret` in `backend` directory containing a single line of your Discord Application's secret token
```
python -m venv venv
venv\scripts\activate (or equivalent)
cd backend
pip install -r requirements.txt
flask --app main --debug run
```
