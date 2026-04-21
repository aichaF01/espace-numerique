import requests 

OLLAMA_URL = "http://ollama:11434/api"

def generate_response(prompt: str, model: str):
    response = requests.post(
        f"{OLLAMA_URL}/generate",
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
    response = requests.get(f"{OLLAMA_URL}/tags")
    if response.status_code != 200:
        raise Exception(f"Ollama error: {response.text}")
    return response.json()