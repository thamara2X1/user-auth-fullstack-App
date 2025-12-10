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
        body: jsonEncode({
          "name": name,
          "email": email,
          "password": password,
        }),
      );

      final data = jsonDecode(response.body);
      
      if (response.statusCode == 201) {
        return {
          "success": true,
          "data": data,
        };
      } else {
        return {
          "success": false,
          "message": data['message'] ?? "Registration failed",
        };
      }
    } catch (e) {
      return {
        "success": false,
        "message": "Connection error: ${e.toString()}",
      };
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
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
      );

      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200) {
        return {
          "success": true,
          "data": data,
        };
      } else {
        return {
          "success": false,
          "message": data['message'] ?? "Login failed",
        };
      }
    } catch (e) {
      return {
        "success": false,
        "message": "Connection error: ${e.toString()}",
      };
    }
  }
}