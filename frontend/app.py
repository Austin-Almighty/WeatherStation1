from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Serve static files from the current folder (frontend)
app.mount("/static", StaticFiles(directory="homepage"), name="static")



@app.get("/")
def get_index():
    return FileResponse("homepage/index.html")

@app.get("/info")
def get_info():
    return FileResponse("info/info.html")

@app.get("/weather")
async def get_weather(city: str):
    return {"message": f"Weather data for {city}"}