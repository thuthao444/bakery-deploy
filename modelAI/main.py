from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
# import requests
# import uvicorn
# import joblib
import os
from recommend import recommend

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can adjust this to be more restrictive
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data into a DataFrame
cd = os.getcwd()
data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
df = pd.read_csv(os.path.join(data_path,'data.csv'))

# check if server is connected
@app.get("/ping")
def pong():
    return {"ping": "pong!"}

# get recommendation from item and user
@app.get("/recommend/")
async def get_recommendations(item_name: str, user_name):
    print(item_name)
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path,'data.csv'))
    if item_name not in df['Items'].values: 
        raise HTTPException(status_code=404, detail="Item not found")
    
    recommendations = recommend(item_name, df=df, user=user_name)
    return {"recommendations": recommendations}

