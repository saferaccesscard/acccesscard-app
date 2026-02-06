import SwiftUI

struct FeedView: View {
    @StateObject var networkManager = NetworkManager()
    @State private var userId = 1 // Default user for demo
    
    var body: some View {
        NavigationView {
            VStack {
                // User Switcher for Demo
                Picker("User", selection: $userId) {
                    ForEach(1...10, id: \.self) { id in
                        Text("User \(id)").tag(id)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding()
                .onChange(of: userId) { newValue in
                    networkManager.fetchFeed(userId: newValue)
                }
                
                ScrollView {
                    LazyVStack(spacing: 20) {
                        ForEach(networkManager.posts) { post in
                            PostCard(post: post, userId: userId, networkManager: networkManager)
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Recommended For You")
            .onAppear {
                networkManager.fetchFeed(userId: userId)
            }
        }
    }
}

struct PostCard: View {
    let post: Post
    let userId: Int
    @ObservedObject var networkManager: NetworkManager
    @State private var isLiked = false
    
    var body: some View {
        VStack(alignment: .leading) {
            // Image Placeholder
            AsyncImage(url: URL(string: post.image)) { phase in
                if let image = phase.image {
                    image.resizable()
                         .aspectRatio(contentMode: .fill)
                } else {
                    Rectangle().fill(Color.gray.opacity(0.3))
                }
            }
            .frame(height: 250)
            .clipped()
            
            VStack(alignment: .leading, spacing: 8) {
                Text(post.caption)
                    .font(.headline)
                    .lineLimit(2)
                
                HStack {
                    Button(action: {
                        isLiked.toggle()
                        networkManager.logInteraction(userId: userId, postId: post.id, type: "like")
                    }) {
                        Image(systemName: isLiked ? "heart.fill" : "heart")
                            .foregroundColor(isLiked ? .red : .primary)
                    }
                    Spacer()
                }
                .padding(.top, 5)
            }
            .padding()
            .background(Color.white)
        }
        .cornerRadius(15)
        .shadow(radius: 5)
    }
}
