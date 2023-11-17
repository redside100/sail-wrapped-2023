def start_of_week_timestamp(timestamp):
    return timestamp - (timestamp % (86400 * 7))