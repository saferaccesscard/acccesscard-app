import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
import random
from datetime import datetime

class SocialRecommender:
    def __init__(self):
        self.users = []
        self.posts = []
        self.interactions = []
        
        # Models
        self.tfidf_matrix = None
        self.cosine_sim = None
        self.svd_matrix = None
        self.user_item_matrix = None
        self.predicted_scores = None # User x Item matrix of predicted scores
        
        # Initialize with mock data
        self._generate_mock_data()
        self.train()

    def _generate_mock_data(self):
        """Generates mock users, posts, and interactions."""
        print("Generating mock data...")
        
        # 1. Users
        self.users = pd.DataFrame({
            'user_id': range(1, 11), # 10 users
            'name': [f'User {i}' for i in range(1, 11)]
        })
        
        # 2. Posts (with Captions and Tags for Content-Based)
        # Categories: Sports, Tech, Food, Art
        topics = {
            'Sports': ['Game winner!', 'Touchdown moment', 'Goal scored', 'Match highlights', 'Training day gym'],
            'Tech': ['New iPhone review', 'Coding in Python', 'AI revolution', 'Startup life', 'Latest gadget unboxing'],
            'Food': ['Delicious pasta', 'Sushi night', 'Healthy salad recipe', 'Burger cravings', 'Ice cream dessert'],
            'Art': ['My new painting', 'Abstract gallery', 'Sketching update', 'Digital art timelapse', 'Museum visit']
        }
        
        post_data = []
        pid = 100
        for topic, captions in topics.items():
            for cap in captions:
                post_data.append({
                    'post_id': pid,
                    'caption': f"{cap} #{topic.lower()}",
                    'topic': topic,
                    'created_at': datetime.now()
                })
                pid += 1
        
        self.posts = pd.DataFrame(post_data)
        
        # 3. Interactions (Implicit/Explicit)
        # Simulate preferences: Users 1-3 like Sports, 4-6 Tech, etc.
        interaction_data = []
        
        # Define preferences
        user_prefs = {
            1: 'Sports', 2: 'Sports', 3: 'Sports',
            4: 'Tech', 5: 'Tech', 6: 'Tech',
            7: 'Food', 8: 'Food',
            9: 'Art', 10: 'Art'
        }
        
        for uid in self.users['user_id']:
            fav_topic = user_prefs.get(uid)
            
            # Interact mostly with favorite topic, some random
            for _, post in self.posts.iterrows():
                p_topic = post['topic']
                pid = post['post_id']
                
                # Higher chance to interact if topic matches
                prob = 0.8 if p_topic == fav_topic else 0.1
                
                if random.random() < prob:
                    # Random interaction type
                    itype = random.choice(['view', 'like', 'like', 'view']) # Weighted
                    score = 1.0 if itype == 'view' else 5.0 # Like is stronger
                    
                    interaction_data.append({
                        'user_id': uid,
                        'post_id': pid,
                        'interaction_type': itype,
                        'score': score
                    })
                    
        self.interactions = pd.DataFrame(interaction_data)
        print(f"Generated {len(self.users)} users, {len(self.posts)} posts, {len(self.interactions)} interactions.")

    def train(self):
        """Trains Content-Based and Collaborative models."""
        print("Training models...")
        
        # --- A. Content-Based Filtering (TF-IDF on Captions) ---
        tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = tfidf.fit_transform(self.posts['caption'])
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        
        # --- B. Collaborative Filtering (Matrix Factorization) ---
        if not self.interactions.empty:
            # Create User-Item Matrix
            self.user_item_matrix = self.interactions.pivot_table(
                index='user_id', 
                columns='post_id', 
                values='score', 
                fill_value=0
            )
            
            # SVD for dimensionality reduction (simple approximation)
            # In production, use Surprise or LightFM
            # Ensure we don't have more components than features
            n_components = min(5, len(self.user_item_matrix) - 1)
            svd = TruncatedSVD(n_components=n_components, random_state=42)
            self.svd_matrix = svd.fit_transform(self.user_item_matrix)
            
            # Correlation matrix from SVD could be used, but for simplicity
            # we'll use Item-based Collab Filtering on the raw matrix for small scale
            # Or User-based. Let's stick to a simple popularity boost for now if SVD is overkill
            # Actually, let's just use the USER-ITEM matrix directly for "Users like you liked X"
            
            # Reconstruct the matrix to get predicted scores for all items
            # M_hat = U * Sigma * Vt  (Approx)
            # sklearn's transform returns U * Sigma. We need to multiply by components_ (Vt)
            self.predicted_scores = np.dot(self.svd_matrix, svd.components_)
            
            # Convert back to DataFrame for easier lookup (rows=users, cols=posts)
            # Use original index/columns from user_item_matrix
            self.predicted_scores_df = pd.DataFrame(
                self.predicted_scores,
                index=self.user_item_matrix.index,
                columns=self.user_item_matrix.columns
            )

    def get_content_recommendations(self, liked_post_ids, top_n=5):
        """Returns items similar to what user has liked."""
        if not liked_post_ids:
            return []
            
        # Find indices of liked posts
        indices = self.posts.index[self.posts['post_id'].isin(liked_post_ids)].tolist()
        
        if not indices:
            return []
            
        # Average similarity scores for these posts against all others
        sim_scores = self.cosine_sim[indices].mean(axis=0)
        
        # Get top indices
        top_indices = sim_scores.argsort()[::-1]
        
        # Filter out input posts
        recs = []
        for idx in top_indices:
            pid = self.posts.iloc[idx]['post_id']
            if pid not in liked_post_ids:
                recs.append(pid)
                if len(recs) >= top_n:
                    break
        return recs

    def get_collaborative_recommendations(self, user_id, visited_posts, top_n=5):
        """Returns items based on collaborative filtering (others like you liked this)."""
        if self.predicted_scores_df is None or user_id not in self.predicted_scores_df.index:
            return []
            
        # Get user's predicted scores row
        user_scores = self.predicted_scores_df.loc[user_id]
        
        # Sort by score descending
        top_items = user_scores.sort_values(ascending=False)
        
        recs = []
        for pid, score in top_items.items():
            if pid not in visited_posts:
                recs.append(pid)
                if len(recs) >= top_n:
                    break
                    
        return recs

    def recommend(self, user_id, n_recommendations=10):
        """Hybrid Recommendation: Content + Collaborative"""
        
        # 1. Get user history
        user_history = self.interactions[self.interactions['user_id'] == user_id]
        liked_posts = user_history[user_history['score'] > 1]['post_id'].tolist()
        viewed_posts = user_history['post_id'].tolist()
        
        # 2. Content-Based: Recommend similar to Liked
        content_recs = self.get_content_recommendations(liked_posts, top_n=n_recommendations)
        
        # 3. Collaborative: Predict scores for unviewed items
        # We'll use our new SVD-based method
        collab_recs = self.get_collaborative_recommendations(user_id, viewed_posts, top_n=n_recommendations)
        
        # 4. Hybrid Merge Function
        # Strategy: Interleave Content and Collab, then fill with Popular
        
        final_recs = []
        
        # Interleave Strategy (e.g., 1 Content, 1 Collab, 1 Content...)
        max_len = max(len(content_recs), len(collab_recs))
        for i in range(max_len):
            if i < len(content_recs):
                if content_recs[i] not in final_recs and content_recs[i] not in viewed_posts:
                    final_recs.append(content_recs[i])
            
            if i < len(collab_recs):
                if collab_recs[i] not in final_recs and collab_recs[i] not in viewed_posts:
                    final_recs.append(collab_recs[i])
            
            if len(final_recs) >= n_recommendations:
                break
                
        # 5. Fallback to Popular / Random if we still strictly need more
        popular_posts = self.interactions.groupby('post_id')['score'].sum().sort_values(ascending=False).index.tolist()
        for pid in popular_posts:
            if pid not in final_recs and pid not in viewed_posts:
                final_recs.append(pid)
            if len(final_recs) >= n_recommendations:
                break
                
        # If still need more, random fill
        all_pids = self.posts['post_id'].tolist()
        random.shuffle(all_pids)
        for pid in all_pids:
            if len(final_recs) >= n_recommendations:
                break
            if pid not in final_recs and pid not in viewed_posts:
                final_recs.append(pid)
                
        # Map back to full objects
        result = []
        for pid in final_recs:
            post = self.posts[self.posts['post_id'] == pid].iloc[0]
            result.append({
                'id': int(post['post_id']),
                'caption': post['caption'],
                'image': f"https://picsum.photos/seed/{pid}/300/300" # Random image placeholder
            })
            
        return result

    def log_interaction(self, user_id, post_id, interaction_type):
        """Updates internal state with new interaction."""
        score = 5.0 if interaction_type == 'like' else 1.0
        new_row = {'user_id': user_id, 'post_id': post_id, 'interaction_type': interaction_type, 'score': score}
        # In-memory append (production would be DB insert)
        # Fix: concat instead of append
        new_df = pd.DataFrame([new_row])
        self.interactions = pd.concat([self.interactions, new_df], ignore_index=True)
        # Re-train periodically (skipped for demo speed)
