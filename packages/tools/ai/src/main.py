import sys
import json
import logging
from typing import Any
from tempfile import TemporaryDirectory
from os.path import basename, join
from re import sub, findall
from ai import start_summary

logging.basicConfig(level=logging.INFO)


def process_file(playbackUrl: str, playbackId: str) -> str:
    with TemporaryDirectory() as tempdir:
        temp_file_path = join(tempdir, basename(playbackId))

        print(f'playbackUrl is: {playbackUrl}')
        print(f'Summarizing video in {temp_file_path}...')
        start_summary(playbackUrl, temp_file_path)
        print('Created summary...')

        with open(f'{temp_file_path}.txt') as file:
            summary_content = file.read()

        return summary_content


def sanitize_json(data_str: str) -> Any:
    data_str = data_str.replace("'", '"')
    data_str = sub(r'([{,]\s*)([^{":,\s]+)(\s*:)',
                   r'\1"\2"\3', data_str)
    data_str = sub(r'(:\s*)([^{":,\]\s]+)(\s*[,}])',
                   r'\1"\2"\3', data_str)
    data_str = sub(r'"\[', '[', data_str)
    data_str = sub(r'\]"', ']', data_str)

    files_match = findall(r'"files": \[([^]]+)', data_str)
    for match in files_match:
        corrected = ', '.join([f'"{x.strip()}"' for x in match.split(',')])
        data_str = data_str.replace(match, corrected)

    data_str = data_str.replace('""', '"')

    try:
        return json.loads(data_str)
    except json.JSONDecodeError as e:
        logging.error(f"Failed to decode JSON: {e}")
        return None


def main(raw_json_str: str, batchID: int) -> None:
    try:
        sanitized_json = sanitize_json(raw_json_str)
        if sanitized_json is None:
            logging.error("Sanitization failed.")
            return

        target_batch = None
        for batch in sanitized_json:
            if str(batch.get('batchID')) == str(batchID):
                target_batch = batch
                break

        if target_batch is None:
            logging.error(f"Batch ID {batchID} not found.")
            return

        for file in target_batch['files']:
            with open(file, 'r') as json_file:
                data = json.load(json_file)

                print(data)
            if 'videoUrl' in data and 'name' in data and 'playbackId' in data:
                description = process_file(
                    data['videoUrl'], data['playbackId'])
                data['gpt_description'] = description

                with open(file, 'w') as json_file:
                    json.dump(data, json_file, indent=4)

                logging.info(f"Successfully processed {file}")

            else:
                logging.warning(f"'videoUrl' or 'name' not found in {file}")

    except Exception as e:
        logging.error(f"An error occurred: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <raw_json_str> <batchID>")
        sys.exit(1)

    main(sys.argv[1], int(sys.argv[2]))
