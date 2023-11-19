import sqlite3
import orjson
import re

conn = sqlite3.connect("compiled-data/messages.db")
all_messages = (
    conn.cursor()
    .execute(
        "SELECT content, reactions, stickers, channel_id, channel_name FROM messages ORDER BY timestamp ASC"
    )
    .fetchall()
)
count = len(all_messages)

user_cache = {}

print(f"Loaded all messages ({count})")
print("Loading to memory")

total_messages = conn.cursor().execute("SELECT count(message_id) FROM messages").fetchone()[0]
total_reactions = conn.cursor().execute("SELECT sum(total_reactions) FROM messages").fetchone()[0]

total_attachments = conn.cursor().execute("SELECT sum(attachments_sent) FROM users").fetchone()[0]
total_attachments_size = conn.cursor().execute("SELECT sum(attachments_size) FROM users").fetchone()[0]
total_mentions = conn.cursor().execute("SELECT sum(mentions_given) FROM users").fetchone()[0]

most_frequent_hour = round(conn.cursor().execute("SELECT avg(most_frequent_time) FROM users").fetchone()[0])

time_diff_rows = conn.cursor().execute("SELECT min(timestamp), max(timestamp) FROM messages").fetchone()
running_time = time_diff_rows[1] - time_diff_rows[0]
average_messages_per_hour = round((total_messages / running_time) * 3600, 1)

total_stickers = 0
word_counts = []
character_counts = []
link_count = 0

reaction_map = {}
channel_map = {}

messages_in_full_caps = 0

for row in all_messages:
    content = row[0]
    reactions = orjson.loads(row[1])
    stickers = orjson.loads(row[2])
    channel_id = str(row[3])
    channel_name = row[4]

    total_stickers += len(stickers)
    character_counts.append(len(content))

    words = content.split(' ')
    if len(words) > 1:
        word_counts.append(len(words))
    else:
        word_counts.append(1)

    link_count += len(re.findall(r'(https?://[^\s]+)', content))
    if len(content) > 0 and content == content.upper():
        messages_in_full_caps += 1
    
    for reaction in reactions:
        url = reaction['emoji']['imageUrl']
        count = reaction['count']
        if url not in reaction_map:
            reaction_map[url] = count
        else:
            reaction_map[url] += count
    
    if channel_id not in channel_map:
        channel_map[channel_id] = {
            'name': channel_name,
            'count': 1
        }
    else:
        channel_map[channel_id]['count'] += 1


average_words = round(sum(word_counts) / len(word_counts))
average_characters = round(sum(character_counts) / len(character_counts))
top_three_reactions = dict(sorted(reaction_map.items(), key=lambda x: x[1], reverse=True)[:3])
top_three_channels = dict(sorted(channel_map.items(), key=lambda x: x[1]['count'], reverse=True)[:3])

conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("total_messages", str(total_messages)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("total_reactions", str(total_reactions)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("total_mentions", str(total_mentions)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("total_attachments", str(total_attachments)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("total_attachments_size", str(total_attachments_size)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("most_frequent_hour", str(most_frequent_hour)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("average_words", str(average_words)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("average_characters", str(average_characters)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("average_messages_per_hour", str(average_messages_per_hour)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("top_three_reactions", orjson.dumps(top_three_reactions)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("top_three_channels", orjson.dumps(top_three_channels)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("links_sent", str(link_count)))
conn.cursor().execute("INSERT OR REPLACE INTO constants VALUES (?, ?)", ("messages_in_full_caps", str(messages_in_full_caps)))

conn.commit()