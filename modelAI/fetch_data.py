import pandas as pd
import requests


url = 'http://localhost:4000'
# fetch data function to get data from mongoDB for model training
def fetch_data_from_api(url):
    try:
        response = requests.get(f"{url}/api/food/list")
        response.raise_for_status()  # Raise an exception for 4XX and 5XX status codes
        data = response.json()
        if data['success']:
            return pd.DataFrame(data['data'])  # Convert the received JSON data to a DataFrame
        else:
            print("Error: Failed to fetch data from the API.")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

