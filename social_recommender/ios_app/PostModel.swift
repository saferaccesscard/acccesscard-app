import Foundation

struct Post: Identifiable, Codable {
    let id: Int
    let caption: String
    let image: String // URL string
}

struct InteractionRequest: Codable {
    let user_id: Int
    let post_id: Int
    let interaction_type: String
}
