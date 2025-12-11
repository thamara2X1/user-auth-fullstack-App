# User Authentication Full Stack App

A complete user authentication system with **Flutter mobile app** and **Node.js backend API**.

<img width="250" alt="Screenshot 2025-12-11 at 23 35 39" src="https://github.com/user-attachments/assets/da2c355f-a894-41cd-9001-d3569f8a0d07" />
<img width="250" alt="Screenshot 2025-12-11 at 23 36 15" src="https://github.com/user-attachments/assets/518ef19c-90ba-41a4-aeef-a267ca250cec" />
<img width="250" alt="Screenshot 2025-12-11 at 23 37 03" src="https://github.com/user-attachments/assets/727e22ad-3e26-4232-ba2a-3601ed24a3b8" />



![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## 📱 Features

- ✅ **User Registration** - Create new accounts with name, email, and password
- ✅ **User Login** - Secure authentication with JWT tokens
- ✅ **Password Security** - Bcrypt hashing with salt rounds
- ✅ **Form Validation** - Client-side and server-side validation
- ✅ **Beautiful UI** - Modern Flutter design with Material 3
- ✅ **Navigation Flow** - Seamless transitions between screens
- ✅ **Logout Functionality** - Secure session termination
- ✅ **RESTful API** - Industry-standard architecture
- ✅ **MongoDB Cloud** - Scalable database storage
- ✅ **Cross-platform** - Works on Android & iOS
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Password Visibility Toggle** - Show/hide password feature

## 🏗️ Project Structure

```
user-auth-fullstack/
├── mybackend1/           # Node.js + Express API
│   ├── models/          # MongoDB schemas
│   │   └── User.js      # User model
│   ├── routes/          # API endpoints
│   │   └── auth.js      # Authentication routes
│   ├── server.js        # Main server file
│   ├── .env             # Environment variables (not in git)
│   ├── .env.example     # Environment template
│   ├── .gitignore       # Git ignore rules
│   ├── package.json     # Dependencies
│   └── README.md        # Backend documentation
│
├── myapp/               # Flutter mobile app
│   ├── lib/
│   │   ├── screens/
│   │   │   ├── login_screen.dart      # Login UI
│   │   │   ├── register_screen.dart   # Registration UI
│   │   │   └── home_screen.dart       # Dashboard
│   │   ├── services/
│   │   │   └── api_service.dart       # API communication
│   │   └── main.dart                  # App entry point
│   ├── android/         # Android config
│   ├── ios/            # iOS config
│   ├── pubspec.yaml    # Flutter dependencies
│   └── README.md       # Mobile documentation
│
├── .gitignore          # Root git ignore
└── README.md           # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - Elegant MongoDB object modeling
- **JWT (jsonwebtoken)** - Secure token-based authentication
- **bcryptjs** - Password hashing and salting
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Mobile
- **Flutter** - Google's UI toolkit for cross-platform apps
- **Dart** - Programming language optimized for UI
- **HTTP Package** - RESTful API communication
- **Material Design 3** - Modern UI components

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Flutter SDK** (v3.0 or higher) - [Install Guide](https://docs.flutter.dev/get-started/install)
- **MongoDB Atlas Account** - [Sign Up Free](https://www.mongodb.com/cloud/atlas/register)
- **Android Studio** or **Xcode** (for mobile development)
- **Git** - Version control

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd mybackend1
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Update `.env` with your credentials:**
```env
PORT=3000
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_random_string_here
NODE_ENV=development
```

**Security Note:** Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

✅ Server will run at: `http://localhost:3000`

**Verify it's working:**
```bash
curl http://localhost:3000
# Should return: {"message":"Server is running"}
```

### Mobile Setup

1. **Navigate to mobile directory:**
```bash
cd myapp
```

2. **Install dependencies:**
```bash
flutter pub get
```

3. **Update API URL in `lib/services/api_service.dart`:**

```dart
// Choose based on your testing platform:

// For Android Emulator
static const String baseUrl = "http://10.0.2.2:3000/api/v1";

// For iOS Simulator
static const String baseUrl = "http://localhost:3000/api/v1";

// For Real Device (replace with your computer's IP)
static const String baseUrl = "http://computer's IP:3000/api/v1";
```

**Find your computer's IP:**
```bash
# macOS/Linux
ipconfig getifaddr en0

# Windows
ipconfig
```

4. **Configure for HTTP (Development Only):**

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<application
    android:usesCleartextTraffic="true"
    ...>
</application>
```

**iOS** (`ios/Runner/Info.plist`):
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

5. **Run the app:**
```bash
flutter run
```

Or select a specific device:
```bash
flutter devices
flutter run -d <device-id>
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "Abc",
  "email": "abc@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "user_id": "675abc123def456ghi789",
  "message": "Account created successfully"
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Email already exists"
}
```

#### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "abc@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "675abc123def456ghi789",
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

## 📱 App User Flow

```
Start App
    ↓
Login Screen
    ├─→ (New User?) → Register Screen
    │                       ↓
    │              (Success) → Login Screen
    │                       
    └─→ (Enter Credentials) → Validation
                                  ↓
                            (Success) → Home Screen
                                           ↓
                                  (Logout) → Login Screen
```

## 📱 Screenshots

### Login Screen
- Email and password input fields
- Form validation
- Password visibility toggle
- "Forgot Password?" link (coming soon)
- Navigation to register screen

### Register Screen
- Name, email, and password fields
- Client-side validation
- Auto-navigation to login after success
- Link to login for existing users

### Home Screen
- Welcome message
- User ID display
- JWT token preview
- Logout button with confirmation dialog


## 🔐 Security Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| Password Hashing | bcrypt with 10 salt rounds | ✅ |
| JWT Authentication | 7-day expiration tokens | ✅ |
| Environment Variables | Sensitive data in .env | ✅ |
| Input Validation | Frontend + Backend | ✅ |
| CORS Protection | Configured origins | ✅ |
| Password Visibility | Toggle on/off | ✅ |
| MongoDB Injection | Mongoose sanitization | ✅ |
| HTTPS Ready | SSL/TLS compatible | 🔄 |

## 🧪 Testing

### Test Backend with cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test with Postman

1. Import API collection (if available)
2. Set base URL: `http://localhost:3000/api/v1`
3. Test register endpoint
4. Copy user credentials
5. Test login endpoint
6. Verify JWT token is returned

### Test Flutter App

1. Start backend server
2. Run Flutter app
3. **Test Registration:**
   - Enter name, email, password
   - Click "Create Account"
   - Should auto-navigate to login
4. **Test Login:**
   - Enter registered credentials
   - Click "Login"
   - Should navigate to home screen
5. **Test Logout:**
   - Click logout button
   - Confirm in dialog
   - Should return to login

## 📝 Environment Variables

### Backend `.env`
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | Yes |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | Secret for JWT signing | `random_32_char_string` | Yes |
| `NODE_ENV` | Environment mode | `development` | No |

**⚠️ NEVER commit `.env` to Git!** Use `.env.example` as a template.

## 🚀 Deployment

### Backend Deployment Options

#### 1. Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set MONGO_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret_key
```

#### 2. Railway
- Connect GitHub repository
- Set environment variables in dashboard
- Auto-deploys on push

#### 3. DigitalOcean App Platform
- Create new app
- Link GitHub repo
- Add environment variables
- Deploy

#### 4. AWS EC2
- Launch EC2 instance
- Install Node.js and MongoDB
- Clone repository
- Configure PM2 for process management

### Mobile Deployment

#### Android - Google Play Store
```bash
flutter build appbundle --release
```
Upload to Google Play Console

#### iOS - Apple App Store
```bash
flutter build ios --release
```
Upload via Xcode to App Store Connect

## 🐛 Troubleshooting

### Backend Issues

**Problem:** MongoDB Connection Failed
```
MongoServerError: bad auth : authentication failed
```
**Solution:**
- Verify credentials in `.env`
- URL-encode special characters in password
- Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for development)

---

**Problem:** Port 5000 Already in Use (macOS)
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change `PORT=3000` in `.env`
- Or disable AirPlay Receiver in System Settings

---

**Problem:** JWT Secret Not Found
```
Error: secretOrPrivateKey must have a value
```
**Solution:**
- Add `JWT_SECRET` to your `.env` file
- Restart the server

### Mobile Issues

**Problem:** Connection Refused
```
SocketException: Failed to connect
```
**Solution:**
- Use correct IP address for your platform:
  - Android Emulator: `10.0.2.2`
  - iOS Simulator: `localhost`
  - Real Device: Your computer's actual IP
- Ensure backend server is running
- Check firewall settings

---

**Problem:** CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Verify CORS is enabled in backend `server.js`
- Restart backend server

---

**Problem:** Certificate Verification Failed (iOS)
```
CERTIFICATE_VERIFY_FAILED
```
**Solution:**
- Add NSAppTransportSecurity to Info.plist (see Mobile Setup)
- Only for development! Use HTTPS in production

## 📚 Learning Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Flutter Documentation](https://docs.flutter.dev/)
- [MongoDB Atlas Tutorial](https://www.mongodb.com/docs/atlas/)
- [JWT Introduction](https://jwt.io/introduction)
- [Bcrypt Explained](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/)
- [REST API Best Practices](https://restfulapi.net/)

## 🛣️ Roadmap

### Version 1.0 (Current) ✅
- [x] User registration
- [x] User login
- [x] JWT authentication
- [x] Password hashing
- [x] Basic navigation

### Version 1.1 (Planned)
- [ ] Persistent login (SharedPreferences)
- [ ] Forgot password functionality
- [ ] Email verification
- [ ] Profile picture upload
- [ ] User profile management

### Version 2.0 (Future)
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Refresh tokens
- [ ] Password strength indicator
- [ ] Biometric authentication


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vinindu Thamara**

- GitHub: [[@vininduthamara]([https://github.com/vininduthamara](https://github.com/thamara2X1))](https://github.com/thamara2X1)
- Email: vininduvtph@gmail.com
- Location: Galle, Sri Lanka 🇱🇰

## 🙏 Acknowledgments

- Flutter team for the amazing framework
- MongoDB Atlas for free cloud database
- Express.js community
- All open-source contributors

## ⭐ Show Your Support

Give a ⭐️ if this project helped you learn full-stack development!

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/user-auth-fullstack)
![GitHub stars](https://img.shields.io/github/stars/yourusername/user-auth-fullstack?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/user-auth-fullstack?style=social)

---

*Last Updated: December 2025*
