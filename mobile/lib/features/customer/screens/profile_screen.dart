import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import '../models/user_model.dart';
import 'package:intl/intl.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider);

    if (user == null) {
      return const Center(child: Text("Please Login"));
    }

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header Section with Photo and Basic Info
              _buildHeaderSection(context, user),
              const SizedBox(height: 16),

              // Personal Information Section
              _buildInfoCard(
                context,
                title: 'Personal Information',
                icon: Icons.person_outline,
                fields: [
                  _InfoField('Date of Birth', user.dob),
                  _InfoField('Gender', user.gender),
                  _InfoField('Address', user.address),
                  _InfoField('City', user.city),
                  _InfoField('PIN Code', user.pin),
                ],
              ),
              const SizedBox(height: 16),

              // Location Section
              if (user.geoLocation.lat != 'N/A' || user.geoLocation.lon != 'N/A')
                _buildInfoCard(
                  context,
                  title: 'Geo Location',
                  icon: Icons.map_outlined,
                  iconColor: Colors.orange,
                  fields: [
                    _InfoField('Latitude', user.geoLocation.lat),
                    _InfoField('Longitude', user.geoLocation.lon),
                  ],
                ),
              const SizedBox(height: 16),

              // Payment Details - UPI Section
              if (user.paymentDetails.upi != 'N/A')
                _buildInfoCard(
                  context,
                  title: 'Payment Details',
                  icon: Icons.account_balance_wallet_outlined,
                  iconColor: Colors.orange,
                  fields: [
                    _InfoField('UPI ID', user.paymentDetails.upi),
                  ],
                ),
              const SizedBox(height: 16),

              // Bank Account Details Section
              if (user.paymentDetails.accountNumber != 'N/A' || user.paymentDetails.ifsCode != 'N/A')
                _buildInfoCard(
                  context,
                  title: 'Bank Account Details',
                  icon: Icons.account_balance_outlined,
                  iconColor: Colors.orange,
                  fields: [
                    _InfoField('Account Number', user.paymentDetails.accountNumber),
                    _InfoField('IFSC Code', user.paymentDetails.ifsCode),
                  ],
                ),
              const SizedBox(height: 16),

              // Documents Section - Customer (UIDAI & PAN)
              if (user.role == 'customer' && (user.documents.uidai != 'N/A' || user.documents.pan != 'N/A'))
                _buildInfoCard(
                  context,
                  title: 'Documents',
                  icon: Icons.description_outlined,
                  iconColor: Colors.orange,
                  fields: [
                    _InfoField('UIDAI', user.documents.uidai),
                    _InfoField('PAN', user.documents.pan),
                  ],
                ),
              const SizedBox(height: 16),

              // Documents Section - Other Roles
              if (user.role != 'customer')
                _buildInfoCard(
                  context,
                  title: 'Documents',
                  icon: Icons.description_outlined,
                  iconColor: Colors.orange,
                  fields: [
                    if (user.documents.gst != 'N/A') _InfoField('GST', user.documents.gst),
                    if (user.documents.fssai != 'N/A') _InfoField('FSSAI', user.documents.fssai),
                    if (user.documents.rc != 'N/A') _InfoField('RC', user.documents.rc),
                    if (user.documents.dl != 'N/A') _InfoField('Driving License', user.documents.dl),
                    if (user.documents.uidai != 'N/A') _InfoField('UIDAI', user.documents.uidai),
                    if (user.documents.pan != 'N/A') _InfoField('PAN', user.documents.pan),
                  ],
                ),
              const SizedBox(height: 16),

              // Restaurant Info (for managers)
              if (user.restaurantName != 'N/A' || user.cuisine != 'N/A')
                _buildInfoCard(
                  context,
                  title: 'Restaurant Information',
                  icon: Icons.store_outlined,
                  iconColor: Colors.orange,
                  fields: [
                    _InfoField('Restaurant Name', user.restaurantName),
                    _InfoField('Cuisine Type', user.cuisine),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderSection(BuildContext context, UserModel user) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha:0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Photo Section
              Stack(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.grey.shade300, width: 3),
                      image: DecorationImage(
                        image: NetworkImage(user.photoUrl ?? 'https://placehold.co/400?text=${user.fullName[0]}'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: () {
                        // Implement photo change logic here
                      },
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: Colors.orange,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.camera_alt, color: Colors.white, size: 16),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 20),
              // Basic Info Section
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.fullName,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.orange,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.orange,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            user.role.toUpperCase(),
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: user.isActive == 'active' ? Colors.green.shade100 : Colors.red.shade100,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            user.isActive,
                            style: TextStyle(
                              color: user.isActive == 'active' ? Colors.green.shade800 : Colors.red.shade800,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Contact Information
          _buildContactRow('Email:', user.email),
          const SizedBox(height: 8),
          _buildContactRow('Phone:', user.mobileNumber),
          const SizedBox(height: 8),
          _buildContactRow('Member Since:', user.createdAt != null ? DateFormat('dd/MM/yyyy').format(user.createdAt!) : 'N/A'),
          const SizedBox(height: 20),
          // Action Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    // Edit Profile Action
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('Edit Profile'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    // Reset Password Action
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey.shade600,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('Reset Password'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildContactRow(String label, String value) {
    return Row(
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.grey.shade600, fontWeight: FontWeight.w500, fontSize: 14),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w600, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildInfoCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    Color iconColor = Colors.orange,
    required List<_InfoField> fields,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha:0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Icon(icon, color: iconColor),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: fields.length,
            separatorBuilder: (context, index) => const Divider(height: 1, thickness: 1),
            itemBuilder: (context, index) {
              final field = fields[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${field.label}:',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      field.value == 'N/A' ? 'Not provided' : field.value,
                      style: TextStyle(
                        color: field.value == 'N/A' ? Colors.grey.shade400 : Colors.black87,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _InfoField {
  final String label;
  final String value;
  _InfoField(this.label, this.value);
}
