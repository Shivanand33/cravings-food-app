import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../repositories/public_repository.dart';
import '../models/restaurant_model.dart';

final publicRepositoryProvider = Provider<PublicRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return PublicRepository(dio);
});

final featuredRestaurantsProvider = FutureProvider<List<RestaurantModel>>((ref) async {
  final repository = ref.watch(publicRepositoryProvider);
  return repository.getFeaturedRestaurants();
});
