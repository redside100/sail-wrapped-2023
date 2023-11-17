import sqlite3
import cachetools.func
import orjson

from util import start_of_week_timestamp

conn = None


def init():
    global conn
    conn = sqlite3.connect("messages.db", check_same_thread=False)


@cachetools.func.ttl_cache(maxsize=1024, ttl=86400)
def get_leaderboard_for_word(word: str):
    word = word.replace("%", "\\%").replace("_", "\\_")
    word = "%" + word.lower() + "%"
    rows = (
        conn.cursor()
        .execute(
            "SELECT author_id, author_name, author_avatar_url, count(author_name) FROM messages WHERE lower(content) LIKE ? ESCAPE '\\' GROUP BY author_name LIMIT 20",
            (word,),
        )
        .fetchall()
    )
    data = [
        {
            "author_id": row[0],
            "author_name": row[1],
            "author_avatar_url": row[2],
            "count": row[3],
        }
        for row in rows
    ]
    data.sort(key=lambda x: x["count"], reverse=True)
    return data


@cachetools.func.ttl_cache(maxsize=1024, ttl=86400)
def get_trend_data_for_word(word: str):
    row = (
        conn.cursor()
        .execute(
            "SELECT timestamps FROM words WHERE word = ?",
            (word,),
        )
        .fetchone()
    )
    timestamps = orjson.loads(row[0])
    data = {}
    for timestamp in timestamps:
        day_timestamp = start_of_week_timestamp(timestamp)
        if day_timestamp not in data:
            data[day_timestamp] = 1
        else:
            data[day_timestamp] += 1
    
    return [{
        'timestamp': k,
        'count': data[k],
    } for k in data]
