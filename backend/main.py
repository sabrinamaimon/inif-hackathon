import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from routers.transit import router as transit_router
from routers.alerts import router as alerts_router
from routers.search import router as search_router
from routers.simulation import router as simulation_router
from routers.chat import router as chat_router

app = FastAPI(
    title="DhakaPath: Live Urban Transit & Route Intelligence",
    description="Intelligent multi-modal transit routing, dynamic student fare calculations, and live street-alert platform tailored for Dhaka.",
    version="1.0.0"
)

# CORS Configuration
origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [o.strip() for o in origins_env.split(",") if o.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(transit_router)
app.include_router(alerts_router)
app.include_router(search_router)
app.include_router(simulation_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {
        "platform": "DhakaPath API",
        "tagline": "Live Urban Transit & Route Intelligence for Dhaka City",
        "status": "online",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "city": "Dhaka", "hubs_monitored": 14}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
