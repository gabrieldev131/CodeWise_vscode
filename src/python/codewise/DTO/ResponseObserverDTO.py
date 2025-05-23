class ChangedFile:
    def __init__(self, file_path, change_type, diff_content):
        self.file_path = file_path
        self.change_type = change_type
        self.diff_content = diff_content

    def to_dict(self):
        return {
            "filePath": self.file_path,
            "changeType": self.change_type,
            "diffContent": self.diff_content
        }


class ResponseObserverDTO:
    def __init__(self, commit_hash, author_name, author_email, committed_date, message, changed_files):
        self.commit_hash = commit_hash
        self.author_name = author_name
        self.author_email = author_email
        self.committed_date = committed_date
        self.message = message
        self.changed_files = changed_files  # lista de ChangedFile

    def to_dict(self):
        return {
            "commitHash": self.commit_hash,
            "authorName": self.author_name,
            "authorEmail": self.author_email,
            "committedDate": self.committed_date,
            "message": self.message,
            "changedFiles": [file.to_dict() for file in self.changed_files]
        }

