from backend.recommender import SocialRecommender
import pandas as pd

def test_collaborative_filtering():
    print("Initializing Recommender...")
    rec = SocialRecommender()
    
    # Pick User 1 (Sports Fan)
    user_id = 1
    print(f"\n--- Testing for User {user_id} ---")
    
    # 1. Check Preferences
    user_history = rec.interactions[rec.interactions['user_id'] == user_id]
    print(f"User History Count: {len(user_history)}")
    
    # 2. Check SVD Predictions
    print("\n[Debug] SVD Predicted Scores (Top 5):")
    if rec.predicted_scores_df is not None:
        user_scores = rec.predicted_scores_df.loc[user_id].sort_values(ascending=False).head(5)
        for pid, score in user_scores.items():
            print(f"Post {pid}: Score {score:.4f}")
    else:
        print("Error: predicted_scores_df is None")
        
    # 3. Get Recommendations
    print("\n[Final] Recommendations:")
    recommendations = rec.recommend(user_id, n_recommendations=5)
    
    for i, item in enumerate(recommendations, 1):
        print(f"{i}. Post {item['id']} - {item['caption']}")

if __name__ == "__main__":
    test_collaborative_filtering()
