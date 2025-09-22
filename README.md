# Namaz Mobile App

A beautiful and comprehensive Islamic prayer companion mobile app built with React Native and Expo.

## Features

### 🕌 **Core Features**
- **Prayer Times**: Accurate daily prayer schedules with location-based calculations
- **Qibla Direction**: Compass-based Qibla finder with real-time direction
- **Learn Namaz**: Step-by-step prayer learning guide with progress tracking
- **Duas & Hadith**: Collection of Islamic supplications and Prophet's sayings
- **Settings**: Comprehensive app customization and preferences

### 📱 **Mobile-Optimized**
- **Beautiful UI**: Modern glass-morphism design with smooth animations
- **Dark Theme**: Elegant dark theme optimized for mobile viewing
- **Responsive Design**: Perfectly adapted for all screen sizes
- **Touch-Friendly**: Intuitive touch interactions and gestures
- **Offline Support**: Core features work without internet connection

### 🔧 **Technical Features**
- **React Native**: Cross-platform mobile development
- **Expo**: Easy development and deployment
- **TypeScript**: Type-safe development
- **Context API**: State management for authentication and settings
- **AsyncStorage**: Local data persistence
- **Location Services**: GPS-based prayer times and Qibla direction

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd namaz-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

### Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Build for production
expo build

# Publish to Expo
expo publish
```

## Project Structure

```
namaz-mobile/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── prayer-times.tsx
│   │   ├── qibla.tsx
│   │   ├── learn.tsx
│   │   └── settings.tsx
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication context
│   └── SettingsContext.tsx # Settings context
├── constants/             # App constants
│   └── Theme.ts          # Theme and styling constants
├── assets/               # Images, fonts, etc.
└── package.json
```

## Features Overview

### 🏠 **Home Screen**
- Beautiful Bismillah display
- Real-time clock
- Quick access to all features
- User profile integration

### ⏰ **Prayer Times**
- Location-based prayer times
- Current time display
- Next prayer highlighting
- Islamic date information

### 🧭 **Qibla Direction**
- Real-time compass
- GPS-based calculations
- Distance to Kaaba
- Visual direction indicator

### 📚 **Learn Namaz**
- Step-by-step prayer guide
- Progress tracking
- Interactive learning
- Completion badges

### ⚙️ **Settings**
- Theme customization
- Notification preferences
- Accessibility options
- Data usage controls

## Customization

### Themes
The app supports multiple themes:
- **Auto**: Follows system theme
- **Light**: Light theme
- **Dark**: Dark theme (default)

### Notifications
- Prayer time alerts
- Daily reminders
- Customizable timing

### Accessibility
- Large text support
- High contrast mode
- Reduced motion

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Web
```bash
expo build:web
```

## Deployment

### Expo Go
1. Publish to Expo: `expo publish`
2. Share the link with users
3. Users can open in Expo Go app

### App Stores
1. Build production app: `expo build:ios` or `expo build:android`
2. Submit to App Store or Google Play Store

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## Acknowledgments

- Islamic prayer times calculation
- Qibla direction algorithms
- Beautiful UI/UX design
- Community contributions

---

**Namaz Mobile** - Your complete Islamic prayer companion 📱🕌