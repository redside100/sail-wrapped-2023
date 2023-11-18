from flask import Flask, request
from flask_cors import CORS
import requests
from util import check_for_bad_words
import db

app = Flask(__name__)
CORS(app)

API_ENDPOINT = "https://discord.com/api/v10"
CLIENT_ID = "1174821530623021128"
CLIENT_SECRET = ""
REDIRECT_URI = "http://localhost:3000"

with open("client_secret", "r") as f:
    CLIENT_SECRET = f.read()

db.init()


def token_check(token):
    guild_ids = {guild["id"] for guild in get_guilds(token)}
    # check if in sail
    if "169611319501258753" not in guild_ids:
        return False
    return True


@app.route("/")
def hello():
    return "Sail Wrapped 2023 - HI :D"


@app.route("/api/login", methods=["POST"])
def login():
    try:
        body = request.json
        code = body.get("code")
        res = exchange_code(code)
        info = get_token_info(res["access_token"])

        # check if in sail
        if not token_check(res["access_token"]):
            return {
                "status": "not ok",
                "reason": "You are not in the Sail Discord server.",
            }

        return {
            "status": "ok",
            **res,
            **info,
        }
    except Exception:
        return {"status": "not ok", "reason": "Unable to retrieve token from Discord."}


@app.route("/api/refresh", methods=["POST"])
def refresh():
    try:
        token = request.headers.get("token")
        res = refresh_token(token)
        info = get_token_info(res["access_token"])

        guild_ids = {guild["id"] for guild in get_guilds(res["access_token"])}
        # check if in sail
        if "169611319501258753" not in guild_ids:
            return {
                "status": "not ok",
                "reason": "You are not in the Sail Discord server.",
            }

        return {
            "status": "ok",
            **res,
            **info,
        }
    except Exception:
        return {"status": "not ok", "reason": "Unable to retrieve token from Discord."}


@app.route("/api/logout", methods=["POST"])
def logout():
    try:
        token = request.headers.get("token")
        revoke_access_token(token)
        return {"status": "ok"}
    except Exception:
        return {"status": "not ok", "reason": "Unable to revoke token from Discord."}


@app.route("/api/info", methods=["GET"])
def get_info():
    try:
        token = request.headers.get("token")
        res = get_token_info(token)
        return {"status": "ok", **res}
    except Exception:
        return {"status": "not ok", "reason": "Invalid token (possibly expired)"}


@app.route("/api/media/random", methods=["GET"])
def get_random_media():
    try:
        token = request.headers.get("token")
        # check if in sail
        if not token_check(token):
            return {
                "status": "not ok",
                "reason": "You are not in the Sail Discord server.",
            }
        media = db.get_random_media()
        return {
            "status": "ok",
            **media,
        }
    except Exception as e:
        return {"status": "not ok", "reason": "Invalid token (possibly expired)"}


@app.route("/api/trends", methods=["POST"])
def get_trends_data():
    try:
        token = request.headers.get("token")
        word = request.json.get("word")
        if not token_check(token):
            return {
                "status": "not ok",
                "reason": "You are not in the Sail Discord server.",
            }

        if len(word.split(" ")) > 1:
            return {
                "status": "not ok",
                "reason": "Should only be one word",
            }

        if len(word) > 40:
            return {
                "status": "not ok",
                "reason": "Word is too long",
            }

        if check_for_bad_words(word):
            return {
                "status": "not ok",
                "reason": "Word contains banned search term",
            }

        trend_data = db.get_trend_data_for_word(word)
        return {
            "status": "ok",
            "data": trend_data,
        }
    except Exception as e:
        return {"status": "not ok", "reason": "Invalid token (possibly expired)"}


def exchange_code(code):
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    r = requests.post(
        f"{API_ENDPOINT}/oauth2/token",
        data=data,
        headers=headers,
        auth=(CLIENT_ID, CLIENT_SECRET),
    )
    r.raise_for_status()
    return r.json()


def get_token_info(token):
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{API_ENDPOINT}/oauth2/@me", headers=headers)
    r.raise_for_status()
    return r.json()


def get_guilds(token):
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{API_ENDPOINT}/users/@me/guilds", headers=headers)
    r.raise_for_status()
    return r.json()


def revoke_access_token(token):
    data = {"token": token, "token_type_hint": "access_token"}
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    requests.post(
        f"{API_ENDPOINT}/oauth2/token/revoke",
        data=data,
        headers=headers,
        auth=(CLIENT_ID, CLIENT_SECRET),
    )


def refresh_token(refresh_token):
    data = {"grant_type": "refresh_token", "refresh_token": refresh_token}
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    r = requests.post(
        f"{API_ENDPOINT}/oauth2/token",
        data=data,
        headers=headers,
        auth=(CLIENT_ID, CLIENT_SECRET),
    )
    r.raise_for_status()
    return r.json()
