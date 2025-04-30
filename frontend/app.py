from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Serve static files from the current folder (frontend)
app.mount("/homepage", StaticFiles(directory="homepage"), name="homepage")
app.mount("/info", StaticFiles(directory="info"), name="info")




@app.get("/")
def get_index():
    return FileResponse("homepage/index.html")

@app.get("/info")
def get_info():
    return FileResponse("info/info.html")

@app.get("/weather")
async def get_weather(city: str):
    return {"message": f"Weather data for {city}"}