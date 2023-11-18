import orjson
import base64

bad_words = {}

with open("bad_words_b64.txt", "r") as f:
    bad_words = {entry.lower() for entry in orjson.loads(base64.b64decode(f.read()))}


def start_of_week_timestamp(timestamp):
    return timestamp - (timestamp % (86400 * 7))


def check_for_bad_words(input):
    global bad_words
    words = input.split(" ")
    for word in words:
        if word.lower() in bad_words:
            return True

    return False
