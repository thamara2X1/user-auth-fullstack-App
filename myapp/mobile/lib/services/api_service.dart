import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Change this to your computer's IP address
  // For Android Emulator: use "10.0.2.2"
  // For iOS Simulator: use "localhost"
  // For Real Device: use your computer's IP (e.g., "192.168.1.5")
  static const String baseUrl = "http://10.0.2.2:3000/api/v1";

  // Register user
  static Future<Map<String, dynamic>> registerUser({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final url = Uri.parse("$baseUrl/auth/register");

      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"name": name, "email": email, "password": password}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        return {"success": true, "data": data};
      } else {
        return {
          "success": false,
          "message": data['message'] ?? "Registration failed",
        };
      }
    } catch (e) {
      return {"success": false, "message": "Connection error: ${e.toString()}"};
    }
  }

  // Login user
  static Future<Map<String, dynamic>> loginUser({
    required String email,
    required String password,
  }) async {
    try {
      final url = Uri.parse("$baseUrl/auth/login");

      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {"success": true, "data": data};
      } else {
        return {"success": false, "message": data['message'] ?? "Login failed"};
      }
    } catch (e) {
      return {"success": false, "message": "Connection error: ${e.toString()}"};
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
          'message':
              data['message'] ?? 'Password reset link sent to your email',
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

  // Verify Reset Token (Optional - to check if token is valid)
  static Future<Map<String, dynamic>> verifyResetToken({
    required String token,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/verify-reset-token'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'token': token}),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['valid'] == true) {
        return {
          'success': true,
          'valid': true,
          'message': data['message'] ?? 'Token is valid',
        };
      } else {
        return {
          'success': false,
          'valid': false,
          'message': data['message'] ?? 'Invalid token',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'valid': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }
}
