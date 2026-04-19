import requests 

OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_response(prompt: str, model: str):
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": model,
            "prompt": prompt,
            "stream": False
        }
    )

    if response.status_code != 200:
        raise Exception(f"Ollama error: {response.text}")

    data = response.json()
    return data.get("response", "")


def get_models():
    response = requests.get("http://localhost:11434/api/tags")
    return response.json()