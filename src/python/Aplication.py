import asyncio
import time
import os
from controller.ObserverController import ObserverController
from controller.CrewController import CrewController
from pathlib import Path

def getInput():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(script_dir, 'codewise', 'crewAI_workflow', 'gitInput.txt')
    return path

def verifyFile():
    return os.path.exists(getInput())

def env_is_valid():
    crew = CrewController()
    result = crew.start() 
    if result is None or result == "":
        return False
    return True
    

def writeError():
    script_dir = Path(__file__).resolve()
    output_path = os.path.join(script_dir.parents[1],'API_ERROR.txt')
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("Váriavel MODEL está incorreta.\n")

def removeInput():
    if verifyFile():
        os.remove(getInput())

async def main():
    observer = ObserverController()
    observer_task = asyncio.create_task(observer.start())
    
    while not verifyFile():
        time.sleep(1)

    while not env_is_valid():
        writeError()
        time.sleep(3)
    removeInput()
    await asyncio.gather(observer_task)

if __name__ == "__main__":
    asyncio.run(main())
