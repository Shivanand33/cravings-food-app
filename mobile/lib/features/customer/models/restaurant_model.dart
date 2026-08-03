class RestaurantModel {
  final String id;
  final String restaurantName;
  final String cuisine;
  final String? imageUrl;
  final double rating;
  final String deliveryTime;

  RestaurantModel({
    required this.id,
    required this.restaurantName,
    required this.cuisine,
    this.imageUrl,
    this.rating = 4.0, // Mocking rating if not available in backend
    this.deliveryTime = "30-45 min", // Mocking delivery time
  });

  factory RestaurantModel.fromJson(Map<String, dynamic> json) {
    String? photoUrl;
    if (json['photo'] != null && json['photo']['url'] != null) {
      photoUrl = json['photo']['url'];
      if (photoUrl!.isEmpty) photoUrl = null;
    }

    return RestaurantModel(
      id: json['_id'] ?? '',
      restaurantName: json['restaurantName'] ?? 'Unknown',
      cuisine: json['cuisine'] ?? 'Unknown',
      imageUrl: photoUrl,
      // Since backend User model doesn't have rating and deliveryTime yet, we set defaults
      rating: 4.5,
      deliveryTime: '30-40 min',
    );
  }
}
