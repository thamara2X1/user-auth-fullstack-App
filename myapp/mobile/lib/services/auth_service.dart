import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  static const String baseUrl = "http://10.0.2.2:3000/api/v1/auth";
  // Secure storage for tokens
  static const _storage = FlutterSecureStorage();
  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _userNameKey = 'user_name';
  static const String _userEmailKey = 'user_email';

  // ============ TOKEN MANAGEMENT ============

  // Save token securely
  static Future<void> _saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  // Get token securely
  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  // Save user data
  static Future<void> _saveUserData({
    required String userId,
    required String name,
    required String email,
  }) async {
    await _storage.write(key: _userIdKey, value: userId);
    await _storage.write(key: _userNameKey, value: name);
    await _storage.write(key: _userEmailKey, value: email);
  }

  // Get user ID
  static Future<String?> getUserId() async {
    return await _storage.read(key: _userIdKey);
  }

  // Get user name
  static Future<String?> getUserName() async {
    return await _storage.read(key: _userNameKey);
  }

  // Get user email
  static Future<String?> getUserEmail() async {
    return await _storage.read(key: _userEmailKey);
  }

  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // Clear all auth data (logout)
  static Future<void> logout() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userIdKey);
    await _storage.delete(key: _userNameKey);
    await _storage.delete(key: _userEmailKey);
  }

  // ============ API CALLS WITH SECURE HEADERS ============

  // Register User
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'name': name, 'email': email, 'password': password}),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 201) {
        return {
          'success': true,
          'message': data['message'] ?? 'Registration successful',
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Registration failed',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Login User
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        // Store token and user data securely
        await _saveToken(data['token']);
        await _saveUserData(
          userId: data['user_id'].toString(),
          name: data['name'] ?? 'User',
          email: email,
        );

        return {
          'success': true,
          'message': data['message'] ?? 'Login successful',
        };
      } else {
        return {'success': false, 'message': data['message'] ?? 'Login failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Forgot Password
  static Future<Map<String, dynamic>> forgotPassword({
    required String email,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/forgot-password'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Password reset link sent',
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to send reset link',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Reset Password
  static Future<Map<String, dynamic>> resetPassword({
    required String token,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/reset-password'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'token': token, 'password': password}),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Password reset successful',
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to reset password',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Make authenticated API call
  static Future<http.Response> authenticatedRequest({
    required String endpoint,
    required String method,
    Map<String, dynamic>? body,
  }) async {
    final token = await getToken();

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final uri = Uri.parse('$baseUrl/$endpoint');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };

    switch (method.toUpperCase()) {
      case 'GET':
        return await http.get(uri, headers: headers);
      case 'POST':
        return await http.post(uri, headers: headers, body: json.encode(body));
      case 'PUT':
        return await http.put(uri, headers: headers, body: json.encode(body));
      case 'DELETE':
        return await http.delete(uri, headers: headers);
      default:
        throw Exception('Unsupported HTTP method: $method');
    }
  }
}
