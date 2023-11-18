import sqlite3
import orjson

conn = sqlite3.connect("compiled-data/messages.db")
all_messages = (
    conn.cursor()
    .execute("SELECT content, timestamp FROM messages ORDER BY timestamp ASC")
    .fetchall()
)
count = len(all_messages)

word_cache = {}

print(f"Loaded all messages ({count})")
print("Loading to memory")
for i, row in enumerate(all_messages):
    if i % 500 == 0:
        print(f"{i + 1}/{count}")

    content = row[0]
    timestamp = row[1]
    words = content.replace("\n", " ").split(" ")
    for word in words:
        if word == " " or word == "":
            continue
        word = word.lower()
        if word not in word_cache:
            word_cache[word] = {"count": 1, "timestamps": [timestamp]}
        else:
            word_cache[word]["count"] += 1
            word_cache[word]["timestamps"].append(timestamp)

print("writing")
for word in word_cache:
    conn.cursor().execute(
        "INSERT OR REPLACE INTO words (word, count, timestamps) VALUES (?, ?, ?)",
        (word, word_cache[word]["count"], orjson.dumps(word_cache[word]["timestamps"])),
    )

conn.commit()
