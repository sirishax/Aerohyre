import csv
from datetime import datetime, timedelta
from collections import defaultdict, deque
import json
from operator import itemgetter

def parse_timestamp(ts_str):
    """
    Convert ISO format timestamp string to datetime object.
    
    Args:
        ts_str (str): Timestamp string in ISO format
        
    Returns:
        datetime: Parsed datetime object
    """
    return datetime.fromisoformat(ts_str)

def read_csv_chunks(filename, chunk_size=1000):
    """
    Generator function to read CSV file in chunks.
    
    Args:
        filename (str): Path to the CSV file
        chunk_size (int, optional): Number of rows to read per chunk. Defaults to 1000.
    
    Yields:
        list: List of dictionaries containing the chunk of CSV rows
    """
    chunk = []
    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            chunk.append(row)
            if (i + 1) % chunk_size == 0:
                yield chunk
                chunk = []
        if chunk:  # Yield remaining rows
            yield chunk

def analyze_activity(filename, chunk_size=1000):
    """
    Analyze user activity from a CSV file using chunked reading for memory efficiency.
    
    Args:
        filename (str): Path to the CSV file containing activity data
        chunk_size (int, optional): Number of rows to process per chunk. Defaults to 1000.
        
    Returns:
        dict: Dictionary containing:
            - top_users: List of tuples (user_id, action_count) for top 5 users
            - repeated_actions: List of tuples (user_id, action) for suspicious activity
    """
    # Track total actions per user
    user_actions = defaultdict(int)
    
    # Track repeated actions within time window
    window_actions = defaultdict(lambda: defaultdict(deque))
    repeated_actions = set()
    
    WINDOW_MINUTES = 5
    REPEAT_THRESHOLD = 10

    for chunk in read_csv_chunks(filename, chunk_size):
        for row in chunk:
            timestamp = parse_timestamp(row['timestamp'])
            user_id = row['user_id']
            action = row['action']
            
            # Count total actions
            user_actions[user_id] += 1
            
            # Sliding window analysis
            action_times = window_actions[user_id][action]
            
            # Remove timestamps outside the window
            while action_times and (timestamp - action_times[0]) > timedelta(minutes=WINDOW_MINUTES):
                action_times.popleft()
            
            action_times.append(timestamp)
            
            # Check for repeated actions
            if len(action_times) > REPEAT_THRESHOLD:
                repeated_actions.add((user_id, action))

    # Get top 5 users
    top_users = sorted(user_actions.items(), key=itemgetter(1), reverse=True)[:5]

    return {
        'top_users': top_users,
        'repeated_actions': list(repeated_actions)
    }

def print_results(results):
    """
    Print formatted analysis results to console.
    
    Args:
        results (dict): Dictionary containing analysis results with keys:
            - top_users: List of tuples (user_id, action_count)
            - repeated_actions: List of tuples (user_id, action)
    """
    print("\n=== Top 5 Users by Action Count ===")
    for user_id, count in results['top_users']:
        print(f"User {user_id}: {count} actions")

    print("\n=== Users with Repeated Actions (>10 times in 5 minutes) ===")
    for user_id, action in results['repeated_actions']:
        print(f"User {user_id}: Action '{action}'")

def export_json(results, filename='results.json'):
    """
    Export analysis results to a JSON file.
    
    Args:
        results (dict): Dictionary containing analysis results
        filename (str, optional): Output JSON filename. Defaults to 'results.json'
    """
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    """
    Main execution block - reads activity data in chunks, performs analysis and outputs results.
    """
    results = analyze_activity('activity.csv', chunk_size=5000)  # Process 5000 rows at a time
    print_results(results)
    export_json(results)  # Optional JSON export