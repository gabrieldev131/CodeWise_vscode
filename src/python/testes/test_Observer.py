import os
import tempfile
import shutil
from pathlib import Path
import pytest
from git import Repo
from codewise.Observer.Observer import (
    GitCommitObserver,
    find_git_repo
)

@pytest.fixture
def temp_git_repo():
    temp_dir = tempfile.mkdtemp()
    repo = Repo.init(temp_dir)

    file_path = Path(temp_dir) / "dummy.txt"
    file_path.write_text("conteúdo de teste")
    repo.index.add([str(file_path)])
    repo.index.commit("commit de teste")

    yield Path(temp_dir) / ".git"

    # Fechar o repositório e limpar manualmente
    repo.close()
    shutil.rmtree(temp_dir, ignore_errors=True)

def test_find_git_repo(temp_git_repo):
    # Deve encontrar o diretório .git a partir do caminho do projeto
    found = find_git_repo(temp_git_repo.parent)
    assert found is not None

def test_get_last_commit_hash(temp_git_repo):
    observer = GitCommitObserver(temp_git_repo)
    last_hash = observer.get_last_commit_hash()
    assert last_hash is not None

def test_show_commit_details_creates_output_file(temp_git_repo):
    observer = GitCommitObserver(temp_git_repo)
    commit_hash = observer.get_last_commit_hash()

    with tempfile.NamedTemporaryFile(delete=False, mode='w+', encoding='utf-8') as tmpfile:
        tmp_path = tmpfile.name
    observer.show_commit_details(commit_hash, output_path=tmp_path)

    with open(tmp_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "New commit detected:" in content
    os.remove(tmp_path)  # Cleanup
