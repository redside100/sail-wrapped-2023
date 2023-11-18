import sqlite3
import orjson
from datetime import datetime

conn = sqlite3.connect("compiled-data/messages.db")
all_messages = (
    conn.cursor()
    .execute(
        "SELECT attachments, timestamp FROM messages"
    )
    .fetchall()
)
count = len(all_messages)

user_cache = {}

print(f"Loaded all messages ({count})")
print("Loading to memory")


for i, row in enumerate(all_messages):
    if i % 500 == 0:
        print(f"{i + 1}/{count}")

    attachments = orjson.loads(row[0])
    timestamp = row[1]
    for attachment in attachments:
        attachmentId = attachment['id']
        fileName = attachment['fileName']
        url = attachment['url']

        if fileName.lower().endswith('.png') or fileName.lower().endswith('.jpg') or fileName.lower().endswith('.jpeg') or fileName.lower().endswith('.gif'):
            conn.cursor().execute("INSERT OR REPLACE INTO media (id, url, timestamp) VALUES (?, ?, ?)", (attachmentId, url, timestamp))

conn.commit()
