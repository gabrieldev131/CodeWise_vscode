# test_get_json.py
import json
import pytest
from pathlib import Path
from unittest.mock import patch
from codewise.operations.jsonOperations.GetJson import GetJson

def test_get_repo_path_from_json(tmp_path):
    # Cria um repo_path.json falso
    test_data = {"repoPath": "/fake/path/to/repo"}
    json_path = tmp_path / "repo_path.json"
    json_path.write_text(json.dumps(test_data), encoding='utf-8')

    # Simula o caminho que resolve().parents[3] daria na classe real
    fake_file_path = tmp_path / "some" / "nested" / "folder" / "file.py"
    fake_file_path.parent.mkdir(parents=True, exist_ok=True)
    fake_file_path.touch()

    # Mock Path(__file__).resolve() para apontar para fake_file_path
    with patch("codewise.operations.jsonOperations.GetJson.__file__", str(fake_file_path)):
        get_json = GetJson()
        result = get_json.get_repo_path_from_json()
        assert result == "/fake/path/to/repo"
