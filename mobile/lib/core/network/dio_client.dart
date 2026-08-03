import 'dart:io' show Platform;
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final dioProvider = Provider<Dio>((ref) {
  String baseUrl = 'http://localhost:5000'; // Default for web and iOS simulator

  if (!kIsWeb) {
    if (Platform.isAndroid) {
      baseUrl = 'http://10.0.2.2:5000'; // Default for Android Emulator
    }
  }

  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  );

  // Add interceptors if needed (e.g. for Auth tokens later)
  dio.interceptors.add(LogInterceptor(responseBody: true, requestBody: true));

  return dio;
});
