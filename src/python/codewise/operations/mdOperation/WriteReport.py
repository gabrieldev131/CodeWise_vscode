import shutil
from pathlib import Path
import os

class WriteReport():
    def __init__(self):
        pass

    def write(self, userPath):
        script_dir = Path(__file__).resolve()
        project_root = script_dir.parents[5]  
        report_path = os.path.join(project_root, 'commit_analysis_report.md')

        shutil.move(report_path, os.path.join(userPath, 'commit_analysis_report.md'))
        
