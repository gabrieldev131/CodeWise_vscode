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

