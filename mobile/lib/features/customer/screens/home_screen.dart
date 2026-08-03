import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';
import '../../../core/providers/theme_provider.dart';
import '../widgets/restaurant_card.dart';
import '../widgets/dish_card.dart';
import '../providers/home_providers.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> with SingleTickerProviderStateMixin {
  late AnimationController _riderController;
  late Animation<double> _riderAnimation;

  Timer? _textTimer;
  int _textIndex = 0;

  final List<String> _foodTexts = [
    "Hot & Crispy Pizzas 🍕",
    "Spicy Dum Biryani 🍲",
    "Juicy Loaded Burgers 🍔",
    "Creamy Alfredo Pasta 🍝",
    "Authentic Tandoori Dishes 🥘",
    "Chilled Shakes & Desserts 🍰",
  ];

  final List<Map<String, String>> _cuisineTags = [
    {"label": "Biryani 🍲", "query": "Biryani"},
    {"label": "Pizza 🍕", "query": "Pizza"},
    {"label": "Burger 🍔", "query": "Burger"},
    {"label": "Chinese 🍜", "query": "Chinese"},
    {"label": "Desserts 🍰", "query": "Dessert"},
    {"label": "Thali 🍱", "query": "Thali"},
  ];

  @override
  void initState() {
    super.initState();

    // 1. Rider Drive Animation (Horizontal looping)
    _riderController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 12),
    )..repeat();

    _riderAnimation = Tween<double>(begin: -0.3, end: 1.3).animate(
      CurvedAnimation(parent: _riderController, curve: Curves.linear),
    );

    // 2. Food Text Rotator Timer (Every 3 seconds)
    _textTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (mounted) {
        setState(() {
          _textIndex = (_textIndex + 1) % _foodTexts.length;
        });
      }
    });
  }

  @override
  void dispose() {
    _riderController.dispose();
    _textTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeMode = ref.watch(themeModeProvider);
    final isDark = themeMode == ThemeMode.dark;
    final featuredRestaurantsAsyncValue = ref.watch(featuredRestaurantsProvider);

    final popularDishes = [
      {
        "name": "Special Hyderabadi Biryani",
        "restaurant": "Spice Kingdom",
        "price": 299.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
      },
      {
        "name": "Overloaded Cheesy Margherita",
        "restaurant": "Pizza Paradise",
        "price": 349.0,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1595854341625-f33ee1043138?w=600&auto=format&fit=crop&q=80",
      },
      {
        "name": "Schezwan Hakka Noodles",
        "restaurant": "Dragon Wok",
        "price": 249.0,
        "rating": 4.7,
        "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
      },
      {
        "name": "Double Cheese Crunchy Burger",
        "restaurant": "Burger Haven",
        "price": 199.0,
        "rating": 4.6,
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
      },
      {
        "name": "Royal Tandoori Chicken Platter",
        "restaurant": "Spice Kingdom",
        "price": 479.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80",
      },
      {
        "name": "Stuffed Garlic Breadsticks",
        "restaurant": "Pizza Paradise",
        "price": 139.0,
        "rating": 4.5,
        "image": "https://images.unsplash.com/photo-1619531040576-f3045b8274d5?w=600&auto=format&fit=crop&q=80",
      },
    ];

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF090D16) : Colors.grey.shade100,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              // 1. BRAND HEADER / NAVBAR AREA
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Brand Identity Logo
                    Row(
                      children: [
                        Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFEA580C), Color(0xFFF59E0B)],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFEA580C).withValues(alpha:0.3),
                                blurRadius: 8,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          alignment: Alignment.center,
                          child: const Text('🛵', style: TextStyle(fontSize: 18)),
                        ),
                        const SizedBox(width: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: 'Creavings',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w900,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const TextSpan(
                                    text: '.',
                                    style: TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFFEA580C),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Text(
                              'FOOD DELIVERY',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFFEA580C),
                                letterSpacing: 1.0,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Actions: Light/Dark Theme Switcher & Profile
                    Row(
                      children: [
                        // Manual Theme Switcher Button
                        IconButton(
                          onPressed: () {
                            ref.read(themeModeProvider.notifier).toggleTheme();
                            Fluttertoast.showToast(
                              msg: isDark ? "Switched to Light Mode ☀️" : "Switched to Dark Mode 🌙",
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.BOTTOM,
                              backgroundColor: isDark ? Colors.white : Colors.black87,
                              textColor: isDark ? Colors.black : Colors.white,
                            );
                          },
                          icon: Icon(
                            isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                            color: isDark ? const Color(0xFFFBBF24) : Colors.indigo.shade600,
                          ),
                          tooltip: 'Toggle Theme',
                        ),

                        const SizedBox(width: 4),

                        // Delivery Location Pill
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: isDark ? Colors.white.withValues(alpha:0.08) : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isDark ? Colors.white10 : Colors.grey.shade200,
                            ),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.location_on, size: 14, color: Color(0xFFEA580C)),
                              SizedBox(width: 4),
                              Text(
                                'Location',
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 8),

              // 2. FULL BACKGROUND ANIMATED HERO BANNER SECTION
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14.0),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(28),
                  child: Stack(
                    children: [
                      // Full Background HD Food Image
                      Image.network(
                        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
                        width: double.infinity,
                        height: 480,
                        fit: BoxFit.cover,
                      ),

                      // Gradient Overlay
                      Container(
                        width: double.infinity,
                        height: 480,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withValues(alpha:0.85),
                              Colors.black.withValues(alpha:0.65),
                              const Color(0xFF090D16).withValues(alpha:0.95),
                            ],
                          ),
                        ),
                      ),

                      // Banner Content
                      Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Badge
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEA580C).withValues(alpha:0.2),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: const Color(0xFFEA580C).withValues(alpha:0.4),
                                ),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text('🛵 ', style: TextStyle(fontSize: 12)),
                                  Text(
                                    'LIGHTNING FAST FOOD DELIVERY',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFFFB923C),
                                      letterSpacing: 0.8,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(height: 16),

                            // Dynamic Text Rotator
                            const Text(
                              'Craving For',
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                height: 1.1,
                              ),
                            ),
                            const SizedBox(height: 4),

                            AnimatedSwitcher(
                              duration: const Duration(milliseconds: 500),
                              transitionBuilder: (Widget child, Animation<double> animation) {
                                return FadeTransition(
                                  opacity: animation,
                                  child: SlideTransition(
                                    position: Tween<Offset>(
                                      begin: const Offset(0, 0.3),
                                      end: Offset.zero,
                                    ).animate(animation),
                                    child: child,
                                  ),
                                );
                              },
                              child: Text(
                                _foodTexts[_textIndex],
                                key: ValueKey<int>(_textIndex),
                                style: const TextStyle(
                                  fontSize: 26,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFFFBBF24), // Vibrant Amber
                                  shadows: [
                                    Shadow(
                                      color: Color(0x99F59E0B),
                                      blurRadius: 16,
                                    ),
                                  ],
                                ),
                              ),
                            ),

                            const SizedBox(height: 12),

                            Text(
                              'Top-rated restaurants and street treats delivered hot to your doorstep in 30 minutes.',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey.shade300,
                                height: 1.4,
                              ),
                            ),

                            const SizedBox(height: 18),

                            // Search Bar inside Hero
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha:0.15),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: Colors.white.withValues(alpha:0.25)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.search, color: Color(0xFFFB923C), size: 20),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: TextField(
                                      style: const TextStyle(color: Colors.white, fontSize: 13),
                                      decoration: InputDecoration(
                                        hintText: 'Search dishes, restaurants or cuisines...',
                                        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 13),
                                        border: InputBorder.none,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFEA580C),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(Icons.arrow_forward, color: Colors.white, size: 16),
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(height: 16),

                            // Quick Category Filter Chips
                            SizedBox(
                              height: 36,
                              child: ListView.builder(
                                scrollDirection: Axis.horizontal,
                                itemCount: _cuisineTags.length,
                                itemBuilder: (context, index) {
                                  final tag = _cuisineTags[index];
                                  return Container(
                                    margin: const EdgeInsets.only(right: 8),
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(alpha:0.12),
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(color: Colors.white.withValues(alpha:0.2)),
                                    ),
                                    child: Text(
                                      tag["label"]!,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),

                            const SizedBox(height: 16),

                            // Floating Glass Badges Row
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha:0.6),
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(color: Colors.white24),
                                  ),
                                  child: const Row(
                                    children: [
                                      Text('⚡ ', style: TextStyle(fontSize: 12)),
                                      Text(
                                        '30 Min Delivery',
                                        style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha:0.6),
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(color: Colors.white24),
                                  ),
                                  child: const Row(
                                    children: [
                                      Text('🎁 ', style: TextStyle(fontSize: 12)),
                                      Text(
                                        '50% OFF First Order',
                                        style: TextStyle(color: Color(0xFF4ADE80), fontSize: 11, fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      // Animated Bike Delivery Rider Moving Across Bottom
                      Positioned(
                        bottom: 4,
                        left: 0,
                        right: 0,
                        child: AnimatedBuilder(
                          animation: _riderAnimation,
                          builder: (context, child) {
                            final screenWidth = MediaQuery.of(context).size.width;
                            final xPos = _riderAnimation.value * screenWidth;

                            return Transform.translate(
                              offset: Offset(xPos, 0),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(
                                        colors: [Color(0xFFEA580C), Color(0xFFF59E0B)],
                                      ),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Text(
                                      'Order on the way! ⚡',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 9,
                                        fontWeight: FontWeight.w900,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  const Text('🛵💨', style: TextStyle(fontSize: 22)),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // 3. FEATURED RESTAURANTS SECTION
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Verified Kitchens',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFFEA580C),
                            letterSpacing: 1.0,
                          ),
                        ),
                        Text(
                          'Featured Restaurants 👑',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: isDark ? Colors.white : Colors.black87,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      'Explore All →',
                      style: TextStyle(
                        fontSize: 13,
                        color: const Color(0xFFEA580C),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 14),

              SizedBox(
                height: 250,
                child: featuredRestaurantsAsyncValue.when(
                  data: (restaurants) {
                    if (restaurants.isEmpty) {
                      return const Center(child: Text("No restaurants available."));
                    }
                    return ListView.builder(
                      padding: const EdgeInsets.only(left: 16),
                      scrollDirection: Axis.horizontal,
                      itemCount: restaurants.length,
                      itemBuilder: (context, index) {
                        final restaurant = restaurants[index];
                        return RestaurantCard(
                          name: restaurant.restaurantName,
                          cuisine: restaurant.cuisine,
                          rating: restaurant.rating,
                          deliveryTime: restaurant.deliveryTime,
                          imageUrl: restaurant.imageUrl ?? "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=60",
                        );
                      },
                    );
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (err, stack) => Center(
                    child: Text('Error: $err', style: const TextStyle(color: Colors.red)),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // 4. TRENDING DISHES MENU
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Most Loved Dishes',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFFEA580C),
                        letterSpacing: 1.0,
                      ),
                    ),
                    Text(
                      'Top Trending Menu 🥘',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 14),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    childAspectRatio: 0.72,
                  ),
                  itemCount: popularDishes.length,
                  itemBuilder: (context, index) {
                    final dish = popularDishes[index];
                    return DishCard(
                      name: dish['name'] as String,
                      restaurant: dish['restaurant'] as String,
                      price: dish['price'] as double,
                      rating: dish['rating'] as double,
                      imageUrl: dish['image'] as String,
                    );
                  },
                ),
              ),

              const SizedBox(height: 32),

              // 5. WHY CHOOSE CREAVINGS
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                color: isDark ? const Color(0xFF0F172A) : Colors.white,
                child: Column(
                  children: [
                    Text(
                      'Why Foodies Love Creavings?',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildFeatureItem('⚡', 'Super Fast', 'Under 30 min', isDark),
                        _buildFeatureItem('🛡️', 'Clean Food', '100% Audited', isDark),
                        _buildFeatureItem('💬', '24/7 Help', 'Live Support', isDark),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 6. CALL TO ACTION BANNER
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFEA580C), Color(0xFFD97706)],
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFEA580C).withValues(alpha:0.3),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      const Text(
                        'Ready To Satisfy Your Cravings?',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Join 50,000+ happy foodies. Order hot food online now!',
                        style: TextStyle(fontSize: 12, color: Colors.white70),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          Fluttertoast.showToast(msg: "Opening Order Menu 🍽️");
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF090D16),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text(
                          'Order Food Now 🍽️',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureItem(String emoji, String title, String subtitle, bool isDark) {
    return Column(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: const Color(0xFFEA580C).withValues(alpha:0.15),
            borderRadius: BorderRadius.circular(16),
          ),
          alignment: Alignment.center,
          child: Text(emoji, style: const TextStyle(fontSize: 24)),
        ),
        const SizedBox(height: 8),
        Text(
          title,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : Colors.black87,
          ),
        ),
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 10,
            color: Colors.grey.shade500,
          ),
        ),
      ],
    );
  }
}
