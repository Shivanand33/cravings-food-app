class GeoLocation {
  final String lat;
  final String lon;

  GeoLocation({required this.lat, required this.lon});

  factory GeoLocation.fromJson(Map<String, dynamic> json) {
    return GeoLocation(
      lat: json['lat'] ?? 'N/A',
      lon: json['lon'] ?? 'N/A',
    );
  }
}

class PaymentDetails {
  final String upi;
  final String accountNumber;
  final String ifsCode;

  PaymentDetails({
    required this.upi,
    required this.accountNumber,
    required this.ifsCode,
  });

  factory PaymentDetails.fromJson(Map<String, dynamic> json) {
    return PaymentDetails(
      upi: json['upi'] ?? 'N/A',
      accountNumber: json['account_number'] ?? 'N/A',
      ifsCode: json['ifs_Code'] ?? 'N/A',
    );
  }
}

class Documents {
  final String gst;
  final String fssai;
  final String rc;
  final String dl;
  final String uidai;
  final String pan;

  Documents({
    required this.gst,
    required this.fssai,
    required this.rc,
    required this.dl,
    required this.uidai,
    required this.pan,
  });

  factory Documents.fromJson(Map<String, dynamic> json) {
    return Documents(
      gst: json['gst'] ?? 'N/A',
      fssai: json['fssai'] ?? 'N/A',
      rc: json['rc'] ?? 'N/A',
      dl: json['dl'] ?? 'N/A',
      uidai: json['uidai'] ?? 'N/A',
      pan: json['pan'] ?? 'N/A',
    );
  }
}

class UserModel {
  final String id;
  final String fullName;
  final String email;
  final String mobileNumber;
  final String role;
  final String dob;
  final String gender;
  final String address;
  final String city;
  final String pin;
  final String? photoUrl;
  final GeoLocation geoLocation;
  final PaymentDetails paymentDetails;
  final Documents documents;
  final String restaurantName;
  final String cuisine;
  final DateTime? createdAt;
  final String isActive;

  UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    required this.mobileNumber,
    required this.role,
    required this.dob,
    required this.gender,
    required this.address,
    required this.city,
    required this.pin,
    this.photoUrl,
    required this.geoLocation,
    required this.paymentDetails,
    required this.documents,
    required this.restaurantName,
    required this.cuisine,
    this.createdAt,
    this.isActive = 'active',
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    String? photoUrl;
    if (json['photo'] != null && json['photo']['url'] != null) {
      photoUrl = json['photo']['url'];
      if (photoUrl!.isEmpty) photoUrl = null;
    }

    return UserModel(
      id: json['_id'] ?? '',
      fullName: json['fullName'] ?? 'User Name',
      email: json['email'] ?? 'N/A',
      mobileNumber: json['mobileNumber'] ?? 'N/A',
      role: json['role'] ?? 'customer',
      dob: json['dob'] ?? 'N/A',
      gender: json['gender'] ?? 'N/A',
      address: json['address'] ?? 'N/A',
      city: json['city'] ?? 'N/A',
      pin: json['pin'] ?? 'N/A',
      photoUrl: photoUrl,
      geoLocation: GeoLocation.fromJson(json['geoLocation'] ?? {}),
      paymentDetails: PaymentDetails.fromJson(json['paymentDetails'] ?? {}),
      documents: Documents.fromJson(json['documents'] ?? {}),
      restaurantName: json['restaurantName'] ?? 'N/A',
      cuisine: json['cuisine'] ?? 'N/A',
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
      isActive: json['isActive'] ?? 'active',
    );
  }
}
