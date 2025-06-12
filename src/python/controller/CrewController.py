import sys
import os

# Garante que src/python esteja no sys.path
current_file = os.path.abspath(__file__)
src_python_dir = os.path.abspath(os.path.join(current_file, "..", ".."))
if src_python_dir not in sys.path:
    sys.path.insert(0, src_python_dir)

# Agora os imports funcionam
from codewise.crewAI_workflow.testCrew import testCrew

from codewise.operations.mdOperation.WriteReport import WriteReport
from codewise.operations.jsonOperations.GetJson import GetJson

class CrewController():

    def __init__(self):
        getJson = GetJson()
        self.path = getJson.get_repo_path_from_json()

    def start(self):
        test = testCrew()
        result = test.start()

        report = WriteReport()
        report.write(self.path)

        return result

