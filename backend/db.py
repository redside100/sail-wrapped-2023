import sqlite3
import cachetools.func
import orjson

from util import start_of_week_timestamp

conn = None


def init():
    global conn
    conn = sqlite3.connect("messages.db", check_same_thread=False)


@cachetools.func.ttl_cache(maxsize=1024, ttl=86400)
def get_stats():
    rows = conn.cursor().execute("SELECT key, value FROM constants").fetchall()
    data = {}
    for row in rows:
        key = row[0]
        if key.startswith("top_three"):
            value = orjson.loads(row[1])
        elif key == "average_messages_per_hour":
            value = float(row[1])
        else:
            value = int(row[1])

        data[key] = value

    return data


@cachetools.func.ttl_cache(maxsize=1024, ttl=86400)
def get_leaderboard_for_pattern(pattern: str):
    pattern = pattern.replace("%", "\\%").replace("_", "\\_")
    pattern = "%" + pattern.lower() + "%"
    rows = (
        conn.cursor()
        .execute(
            "SELECT author_id, author_name, author_avatar_url, count(author_name) FROM messages WHERE lower(content) LIKE ? ESCAPE '\\' AND NOT author_name = 'Deleted User' GROUP BY author_name ORDER BY count(author_name) DESC LIMIT 50",
            (pattern,),
        )
        .fetchall()
    )
    if rows is None:
        return []
    data = [
        {
            "id": str(row[0]),
            "name": row[1],
            "avatar_url": row[2],
            "count": row[3],
        }
        for row in rows
    ]
    return data


@cachetools.func.ttl_cache(maxsize=1024, ttl=86400)
def get_leaderboard(column):
    rows = (
        conn.cursor()
        .execute(
            f"SELECT user_id, user_name, user_avatar_url, {column} FROM users ORDER BY {column} DESC LIMIT 50"
        )
        .fetchall()
    )
    if rows is None:
        return []
    return [{
        "id": str(row[0]),
        "name": row[1],
        "avatar_url": row[2],
        "count": row[3],
    } for row in rows]


@cachetools.func.ttl_cache(maxsize=1024, ttl=86400)
def get_trend_data_for_word(word: str):
    row = (
        conn.cursor()
        .execute(
            "SELECT timestamps FROM words WHERE word = ?",
            (word.lower(),),
        )
        .fetchone()
    )
    if row is None:
        return []

    timestamps = orjson.loads(row[0])
    data = {}
    for timestamp in timestamps:
        day_timestamp = start_of_week_timestamp(timestamp)
        if day_timestamp not in data:
            data[day_timestamp] = 1
        else:
            data[day_timestamp] += 1

    return [
        {
            "timestamp": k,
            "count": data[k],
        }
        for k in data
    ]


def get_random_media():
    row = (
        conn.cursor()
        .execute(
            "SELECT url, timestamp FROM media WHERE id IN (SELECT id FROM media ORDER BY RANDOM() LIMIT 1)"
        )
        .fetchone()
    )
    return {
        "url": row[0],
        "timestamp": row[1],
    }


@cachetools.func.ttl_cache(maxsize=1024, ttl=86400)
def get_user_data(user_id):
    row = (
        conn.cursor()
        .execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        .fetchone()
    )
    if row is None:
        return {"has_data": False}
    return {
        "has_data": True,
        "user_name": row[1],
        "user_nickname": row[2],
        "mentions_received": row[4],
        "mentions_given": row[5],
        "reactions_received": row[6],
        "reactions_given": row[7],
        "messages_sent": row[8],
        "attachments_sent": row[9],
        "attachments_size": row[10],
        "most_frequent_time": row[11],
        "most_mentioned_given": {
            "name": row[12],
            "id": str(row[14]),
            "avatar_url": row[16],
            "count": row[18],
        }
        if row[14] != 0
        else None,
        "most_mentioned_received": {
            "name": row[13],
            "id": str(row[15]),
            "avatar_url": row[17],
            "count": row[19],
        }
        if row[15] != 0
        else None,
    }
