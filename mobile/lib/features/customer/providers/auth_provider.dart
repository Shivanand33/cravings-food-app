import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';

class AuthNotifier extends Notifier<UserModel?> {
  @override
  UserModel? build() {
    // Initializing with a dummy logged-in user so the Profile Screen works
    // and looks like the web app.
    return UserModel(
      id: 'dummy123',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      mobileNumber: '+91 9876543210',
      role: 'customer',
      dob: '01/01/1990',
      gender: 'male',
      address: '123 Craving Street, Food City',
      city: 'Mumbai',
      pin: '400001',
      photoUrl: 'https://i.pravatar.cc/300',
      geoLocation: GeoLocation(lat: '19.0760', lon: '72.8777'),
      paymentDetails: PaymentDetails(
        upi: 'johndoe@okicici',
        accountNumber: 'N/A',
        ifsCode: 'N/A',
      ),
      documents: Documents(
        gst: 'N/A',
        fssai: 'N/A',
        rc: 'N/A',
        dl: 'N/A',
        uidai: '1234 5678 9012',
        pan: 'ABCDE1234F',
      ),
      restaurantName: 'N/A',
      cuisine: 'N/A',
      createdAt: DateTime.now().subtract(const Duration(days: 365)),
      isActive: 'active',
    );
  }

  void login(UserModel user) {
    state = user;
  }

  void logout() {
    state = null;
  }

  void updateProfile(UserModel updatedUser) {
    state = updatedUser;
  }
}

final authProvider = NotifierProvider<AuthNotifier, UserModel?>(() {
  return AuthNotifier();
});
