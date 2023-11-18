import sqlite3
import orjson
from datetime import datetime

conn = sqlite3.connect("compiled-data/messages.db")
all_messages = (
    conn.cursor()
    .execute(
        "SELECT author_id, author_name, author_avatar_url, content, timestamp, attachments, reactions, mentions, total_reactions FROM messages ORDER BY timestamp ASC"
    )
    .fetchall()
)
count = len(all_messages)

user_cache = {}

print(f"Loaded all messages ({count})")
print("Loading to memory")


def init_user_if_not_exists(user_id, user_name, avatar_url):
    global user_cache
    if user_id not in user_cache:
        user_cache[user_id] = {
            "messages": 0,
            "name": user_name,
            "avatar_url": avatar_url,
            "msg_frequency": {},
            "reactions_given": 0,
            "reactions_received": 0,
            "attachments_sent": 0,
            "attachments_size": 0,
            "mentions_given": {},
            "mentions_received": {},
        }


for i, row in enumerate(all_messages):
    if i % 500 == 0:
        print(f"{i + 1}/{count}")

    user_id = int(row[0])
    user_name = row[1]
    user_avatar_url = row[2]
    content = row[3]
    timestamp = row[4]
    attachments = orjson.loads(row[5])
    reactions = orjson.loads(row[6])
    mentions = orjson.loads(row[7])
    total_reactions = row[8]

    init_user_if_not_exists(user_id, user_name, user_avatar_url)

    user_cache[user_id]["messages"] += 1

    utc_dt = datetime.utcfromtimestamp(timestamp)
    if utc_dt.hour not in user_cache[user_id]["msg_frequency"]:
        user_cache[user_id]["msg_frequency"][utc_dt.hour] = 1
    else:
        user_cache[user_id]["msg_frequency"][utc_dt.hour] += 1

    user_cache[user_id]["reactions_received"] += total_reactions

    for reaction in reactions:
        for user in reaction["users"]:
            if user["isBot"]:
                continue
            reactor_id = int(user["id"])
            reactor_name = user["name"]
            reactor_avatar_url = user["avatarUrl"]
            init_user_if_not_exists(reactor_id, reactor_name, reactor_avatar_url)
            user_cache[reactor_id]["reactions_given"] += 1

    for mention in mentions:
        if mention["isBot"]:
            continue

        mentioned_id = int(mention["id"])
        mentioned_name = mention["name"]
        mentioned_avatar_url = mention["avatarUrl"]
        init_user_if_not_exists(mentioned_id, mentioned_name, mentioned_avatar_url)

        if mentioned_id not in user_cache[user_id]["mentions_given"]:
            user_cache[user_id]["mentions_given"][mentioned_id] = {
                "name": mentioned_name,
                "avatar_url": mentioned_avatar_url,
                "count": 1,
            }
        else:
            user_cache[user_id]["mentions_given"][mentioned_id]["count"] += 1

        if user_id not in user_cache[mentioned_id]["mentions_received"]:
            user_cache[mentioned_id]["mentions_received"][user_id] = {
                "name": user_name,
                "avatar_url": user_avatar_url,
                "count": 1,
            }
        else:
            user_cache[mentioned_id]["mentions_received"][user_id]["count"] += 1

    for attachment in attachments:
        user_cache[user_id]["attachments_sent"] += 1
        user_cache[user_id]["attachments_size"] += attachment["fileSizeBytes"]

print(f"Processing users ({len(user_cache)})")

for user_id in user_cache:
    user = user_cache[user_id]
    user_name = user_cache[user_id]["name"]
    user_avatar_url = user_cache[user_id]["avatar_url"]
    mentions_received = user["mentions_received"]
    mentions_given = user["mentions_given"]
    reactions_received = user["reactions_received"]
    reactions_given = user["reactions_given"]
    messages_sent = user["messages"]
    attachments_sent = user["attachments_sent"]
    attachments_size = user["attachments_size"]

    msg_frequency = user["msg_frequency"]

    most_frequent_time = (
        max(msg_frequency, key=lambda x: msg_frequency[x])
        if len(msg_frequency) > 0
        else 0
    )

    mentions_given = user["mentions_given"]
    mentions_given_count = sum([mentions_given[key]["count"] for key in mentions_given])
    most_mentioned_given_id = (
        max(mentions_given, key=lambda x: mentions_given[x]["count"])
        if len(mentions_given) > 0
        else 0
    )
    most_mentioned_given_count = (
        mentions_given[most_mentioned_given_id]["count"]
        if len(mentions_given) > 0
        else 0
    )
    most_mentioned_given_name = (
        mentions_given[most_mentioned_given_id]["name"]
        if len(mentions_given) > 0
        else ""
    )
    most_mentioned_given_avatar_url = (
        mentions_given[most_mentioned_given_id]["avatar_url"]
        if len(mentions_given) > 0
        else ""
    )

    mentions_received = user["mentions_received"]
    mentions_received_count = sum(
        [mentions_received[key]["count"] for key in mentions_received]
    )
    most_mentioned_received_id = (
        max(mentions_received, key=lambda x: mentions_received[x]["count"])
        if len(mentions_received) > 0
        else 0
    )
    most_mentioned_received_count = (
        mentions_received[most_mentioned_received_id]["count"]
        if len(mentions_received) > 0
        else 0
    )
    most_mentioned_received_name = (
        mentions_received[most_mentioned_received_id]["name"]
        if len(mentions_received) > 1
        else ""
    )
    most_mentioned_received_avatar_url = (
        mentions_received[most_mentioned_received_id]["avatar_url"]
        if len(mentions_received) > 0
        else ""
    )

    conn.cursor().execute(
        "INSERT OR REPLACE INTO users (user_id, user_name, user_avatar_url, mentions_received, mentions_given, reactions_received, reactions_given, messages_sent, attachments_sent, attachments_size, most_frequent_time, most_mentioned_given_name, most_mentioned_received_name, most_mentioned_given_id, most_mentioned_received_id, most_mentioned_given_avatar_url, most_mentioned_received_avatar_url, most_mentioned_given_count, most_mentioned_received_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            user_id,
            user_name,
            user_avatar_url,
            mentions_received_count,
            mentions_given_count,
            reactions_received,
            reactions_given,
            messages_sent,
            attachments_sent,
            attachments_size,
            most_frequent_time,
            most_mentioned_given_name,
            most_mentioned_received_name,
            most_mentioned_given_id,
            most_mentioned_received_id,
            most_mentioned_given_avatar_url,
            most_mentioned_received_avatar_url,
            most_mentioned_given_count,
            most_mentioned_received_count,
        ),
    )

conn.commit()
