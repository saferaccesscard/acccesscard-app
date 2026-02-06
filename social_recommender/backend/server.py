from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from recommender import SocialRecommender
import uvicorn

app = FastAPI()
recommender = SocialRecommender()

class InteractionRequest(BaseModel):
    user_id: int
    post_id: int
    interaction_type: str # 'like' or 'view'

@app.get("/")
def read_root():
    return {"status": "Social Recommender API is running"}

@app.get("/feed")
def get_feed(user_id: int):
    """Returns a personalized feed for the user."""
    # Check if user exists (simple check against mock data)
    if user_id not in recommender.users['user_id'].values:
        # For demo, just allow any ID and treat as cold start if not found
        pass
        
    recommendations = recommender.recommend(user_id)
    return recommendations

@app.post("/interact")
def log_interaction(interaction: InteractionRequest):
    """Logs a user interaction."""
    recommender.log_interaction(
        interaction.user_id, 
        interaction.post_id, 
        interaction.interaction_type
    )
    return {"status": "success", "message": "Interaction logged"}

if __name__ == "__main__":
    # Run on 0.0.0.0 to be accessible from Simulator/Localhost
    uvicorn.run(app, host="0.0.0.0", port=8000)
