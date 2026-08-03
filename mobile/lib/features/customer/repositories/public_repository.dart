import 'package:dio/dio.dart';
import '../models/restaurant_model.dart';

class PublicRepository {
  final Dio _dio;

  PublicRepository(this._dio);

  Future<List<RestaurantModel>> getFeaturedRestaurants() async {
    try {
      final response = await _dio.get('/public/allRestaurants');
      
      if (response.statusCode == 200) {
        final List data = response.data['data'] ?? [];
        return data.map((json) => RestaurantModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load restaurants');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
