import requests

def call_api(item_name):
    url = "http://localhost:4040/recommend/"
    params = {
        "item_name": item_name,
    }
    response = requests.get(url, params=params)
    if response.status_code == 404:
        print("Item not found")
        return []
    elif response.status_code != 200:
        print("An error occurred")
        return []
    data = response.json()
    return data["recommendations"]

test = call_api('Chocolate crinkles')
print(test)