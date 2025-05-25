import json
from pathlib import Path
import os


def get_repo_path_from_json():
    json_path = Path(__file__).parent / "repo_path.json"
    if not json_path.exists():
        return None

    with open(json_path, 'r', encoding='utf-8') as jsonFile:
        data = json.load(jsonFile)
        return data.get("repoPath")

# Exemplo de uso
def writeRepoPath():
    repo_path = get_repo_path_from_json()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, 'test.txt')
    with open(output_path, "a", encoding="utf-8") as f:
                f.write(f"\n{repo_path}")
                f.write("\n" + "="*60 + "\n")
