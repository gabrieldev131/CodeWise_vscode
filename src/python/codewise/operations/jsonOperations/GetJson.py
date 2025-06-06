import json
from pathlib import Path

class GetJson():
    def __init__(self):
         pass
    
    def get_repo_path_from_json(self):
        json_path = Path(__file__).resolve().parents[3] / "repo_path.json"
        if not json_path.exists():
            return None

        with open(json_path, 'r', encoding='utf-8') as jsonFile:
            data = json.load(jsonFile)
            return data.get("repoPath")

