"""
Automatically converts Excel (.xlsx) to JSON
whenever the Excel file changes.
"""

import pandas as pd
import json
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

EXCEL_FILE = r"data\airports.xlsx"
JSON_FILE = r"data\airports.json"

last_modified = 0


def convert_excel_to_json():
    try:
        df = pd.read_excel(EXCEL_FILE)

        data = df.fillna("").to_dict(orient="records")

        with open(JSON_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        print("JSON updated successfully")

    except Exception as e:
        print("Error:", e)


class ExcelHandler(FileSystemEventHandler):

    def process(self):
        global last_modified

        try:
            current_modified = os.path.getmtime(EXCEL_FILE)

            # Prevent duplicate triggers
            if current_modified != last_modified:
                last_modified = current_modified

                print("Excel file changed...")
                time.sleep(1)

                convert_excel_to_json()

        except Exception as e:
            print("Watcher error:", e)

    def on_modified(self, event):
        self.process()

    def on_created(self, event):
        self.process()


if __name__ == "__main__":

    convert_excel_to_json()

    event_handler = ExcelHandler()

    observer = Observer()

    observer.schedule(
        event_handler,
        path=os.path.dirname(EXCEL_FILE),
        recursive=False
    )

    observer.start()

    print("Watching Excel file for changes...")

    try:
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        observer.stop()

    observer.join()
