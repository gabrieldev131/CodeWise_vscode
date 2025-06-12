import os
from crewai import Agent, Task, Crew, Process, LLM
from crewai_tools import FileReadTool
from dotenv import load_dotenv


class testCrew():
    def __init__(self):
        pass

    def start(self):
        load_dotenv()
        model = os.getenv("MODEL")
        if not model:
            raise ValueError("Variável de ambiente 'MODEL' está ausente ou inválida.")

        llm = LLM(model=model)

        script_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(script_dir, 'gitInput.txt')

        file_tool = FileReadTool(file_path=path)

        # === Agents ===
        architect = Agent(
            role="Arquiteto de Software",
            goal="Avaliar a estrutura e arquitetura do projeto de forma crítica",
            backstory="Especialista em arquitetura de software escalável, define boas práticas para equipes ágeis.",
            tools=[file_tool],
            memory=True,
        )

        integration_analyst = Agent(
            role="Analista de Integrações",
            goal="Examinar os fluxos entre módulos e sugerir melhorias",
            backstory="Com anos de experiência em sistemas distribuídos, é focado em encontrar falhas de comunicação entre módulos.",
            tools=[file_tool],
            memory=True,
        )

        solid_guardian = Agent(
            role="Guardião dos Princípios SOLID",
            goal="Verificar e corrigir violações de boas práticas SOLID",
            backstory="Um verdadeiro defensor da engenharia orientada a princípios, especialista em refatoração.",
            tools=[file_tool],
            memory=True,
        )

        design_consultant = Agent(
            role="Consultor de Design Patterns",
            goal="Sugerir padrões de projeto aplicáveis ao código",
            backstory="Transforma bases de código confusas em exemplos de elegância com padrões clássicos de software.",
            tools=[file_tool],
            memory=True,
        )

        # === Tasks ===
        task_structure = Task(
            description="Analise a estrutura de pastas do projeto descrito em gitInput.txt. Identifique se há um padrão arquitetural (ex: MVC, DDD, Clean).",
            expected_output="Um relatório descrevendo o padrão atual da estrutura ou a falta dele, com sugestões.",
            agent=architect
        )

        task_integrations = Task(
            description="Avalie os fluxos de integração do projeto descrito no gitInput.txt. Descreva como os módulos interagem, e aponte problemas de acoplamento ou falhas.",
            expected_output="Mapa geral dos fluxos, com destaques nos pontos críticos e sugestões de melhoria.",
            agent=integration_analyst
        )

        task_solid = Task(
            description="Revise as classes e métodos encontrados no código do gitInput.txt, identificando violações aos princípios SOLID.",
            expected_output="Lista de violações SOLID e recomendações específicas para corrigi-las.",
            agent=solid_guardian
        )

        task_patterns = Task(
            description="Sugira até 3 padrões de projeto que poderiam melhorar o código descrito em gitInput.txt. Explique onde e como aplicá-los.",
            expected_output="Sugestões de padrões de projeto com justificativas técnicas e exemplos baseados no código fornecido.",
            agent=design_consultant,
            output_file="commit_analysis_report.md"
        )

        # === Crew ===
        crew = Crew(
            agents=[architect, integration_analyst, solid_guardian, design_consultant],
            tasks=[task_structure, task_integrations, task_solid, task_patterns],
            process=Process.sequential,
            llm=llm
        )
        return crew.kickoff()
if __name__ == "__main__":
    test = testCrew()
    result = test.start()
    print(result)