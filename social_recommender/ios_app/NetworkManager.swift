import Foundation
import Combine

class NetworkManager: ObservableObject {
    @Published var posts: [Post] = []
    
    // Use localhost. If running in Simulator, localhost works.
    // If running on Device, needs IP Address.
    private let baseURL = "http://127.0.0.1:8000"
    
    func fetchFeed(userId: Int) {
        guard let url = URL(string: "\(baseURL)/feed?user_id=\(userId)") else { return }
        
        URLSession.shared.dataTask(with: url) { data, _, error in
            if let data = data {
                do {
                    let decodedPosts = try JSONDecoder().decode([Post].self, from: data)
                    DispatchQueue.main.async {
                        self.posts = decodedPosts
                    }
                } catch {
                    print("Error decoding: \(error)")
                }
            }
        }.resume()
    }
    
    func logInteraction(userId: Int, postId: Int, type: String) {
        guard let url = URL(string: "\(baseURL)/interact") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = InteractionRequest(user_id: userId, post_id: postId, interaction_type: type)
        request.httpBody = try? JSONEncoder().encode(body)
        
        URLSession.shared.dataTask(with: request).resume()
    }
}
