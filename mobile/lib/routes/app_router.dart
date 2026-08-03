import 'package:go_router/go_router.dart';
import '../features/customer/screens/main_layout_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const MainLayoutScreen(),
    ),
    // Add more routes here later (e.g., /login, /restaurant-dashboard)
  ],
);
