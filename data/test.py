import os
import json
import requests
import csv
import re

# Constants
SESSIONS_DIR = "./sessions"
API_URL = "https://livepeer.studio/api/asset?limit=7000"
API_KEY = "38f92096-8475-42d7-96a0-35e561400edd"
LIVEPEER_RESPONSE_FILE = "livepeer_videos.json"  # File to store the API response

# Prepare for logging sessions without playbackId
sessions_without_playbackId = []

# Function to get video information from Livepeer API and save it


def get_livepeer_videos():
    headers = {"Authorization": f"Bearer {API_KEY}"}
    response = requests.get(API_URL, headers=headers)
    if response.status_code == 200:
        # Save the response to a file
        with open(LIVEPEER_RESPONSE_FILE, 'w') as file:
            json.dump(response.json(), file, indent=4)
        return response.json()
    else:
        print(f"Error fetching Livepeer videos: {response.status_code}")
        return []

# Function to update session file with assetId


def update_session_file(file_path, updated_session):
    with open(file_path, 'w') as file:
        json.dump(updated_session, file, indent=2)

# Function to extract playbackId from PlaybackUrl


def extract_playbackId(url):
    match = re.search(r'/hls/(.*?)/index.m3u8', url)
    return match.group(1) if match else None


# Load video information from Livepeer
videos = get_livepeer_videos()

# Iterate over the sessions directory
for event_name in os.listdir(SESSIONS_DIR):
    event_path = os.path.join(SESSIONS_DIR, event_name)
    if os.path.isdir(event_path):
        for session_file in os.listdir(event_path):
            if session_file.endswith('.json'):
                session_path = os.path.join(event_path, session_file)
                with open(session_path, 'r') as file:
                    session = json.load(file)

                    # Remove videoUrl as it is considered tech debt
                    videoUrl = session.pop('videoUrl', None)

                    # Extract playbackId from videoUrl if it is not already present
                    playbackId = session.get('playbackId')
                    if not playbackId and videoUrl:
                        playbackId = extract_playbackId(videoUrl)
                        if playbackId:
                            session['playbackId'] = playbackId

                    # Update the session file with changes
                    update_session_file(session_path, session)

                    if not playbackId:
                        sessions_without_playbackId.append(session_file)

# Log sessions without playbackId to a CSV file
with open('sessions_without_playbackId.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Session File'])
    for session in sessions_without_playbackId:
        writer.writerow([session])

print("Script completed. Check sessions_without_playbackId.csv for sessions without playback IDs.")
