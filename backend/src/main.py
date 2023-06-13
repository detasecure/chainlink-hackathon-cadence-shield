import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import urllib.parse
import os

from src.flow_cadence_contract_analyzer import FlowCadenceContractAnalyzer


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class Code(BaseModel):
    code: str

@app.post("/analyze_flow_cadence_code/")
async def analyze_code(code: Code):
    # Decode the URL-encoded contract code
    decoded_code = urllib.parse.unquote(code.code)


    # Here you would call your analyze_contract function
    results = FlowCadenceContractAnalyzer().analyze_contract(decoded_code)

    return {"results": results}



if __name__ == "__main__":
    host = os.getenv("HOST")
    port = 8081
    uvicorn.run(app, host=host, port=port)
