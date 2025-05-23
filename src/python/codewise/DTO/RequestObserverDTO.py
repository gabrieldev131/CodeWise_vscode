class RequestObserverDTO:
    def __init__(self, git_path):
        self.git_path = git_path

    @staticmethod
    def from_dict(data):
        return RequestObserverDTO(git_path=data.get("gitPath"))

