# Evo React Native Application

## Overview
**Evo** is a modern freelancing marketplace that connects clients and freelancers seamlessly. The app allows clients to post detailed projects, and freelancers to submit proposals and receive secure payments through an escrow-like system.

## Features
### For Clients
- Post projects with specific requirements:
  - Budget, delivery date, required skills, and category (e.g., software, design).
- Review freelancer proposals and select the best fit.
- Securely release payments upon project completion.

### For Freelancers
- Browse available projects and submit proposals.
- Include quotations and highlight relevant skills in proposals.
- Receive secure payments upon successful project delivery.

### Payment Workflow
- Funds are deposited securely into Evo's account.
- Payments are released to freelancers only after client approval of project completion.

## Technologies Used
- **Framework**: React Native with Expo
- **Language**: JavaScript
- **State Management**: React Navigation
- **UI Libraries**:
  - React Native Elements
  - Lottie for animations
  - React Native Linear Gradient
- **API and Integrations**:
  - Axios for API calls
  - TON for payment handling
- **Other Libraries**:
  - AsyncStorage for local storage
  - React Native Document Picker for file uploads

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- **Node.js**: Version `>=14.x` (recommended)
- **npm** or **yarn**: Latest stable version
- **Expo CLI**: Install using `npm install -g expo-cli`
- **Android Studio** or **Xcode**: For running the app on emulators

## Getting Started
Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/LuckyEmojiGames/Freelance.git
   ```
2. Navigate to the project directory:
   ```bash
   cd evo-react-native
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
4. Start the development server:
   ```bash
   expo start
   ```
5. Run the app:
   - **Android**: Connect a device/emulator and select the option in Expo.
   - **iOS**: Use a simulator or a connected device.
   - **Web**: Start the web server with `npm run web`.

## Project Structure
- **`App.js`**: Main application entry point.
- **`Components/`**: Reusable UI components.
- **`Screens/`**: Individual screens for the app.
- **`navigation/`**: Handles app navigation.
- **`service/`**: API and backend integration logic.
- **`assets/`**: Static files like images and icons.
- **`Test/`**: Contains test scripts for components and features.

## Scripts
- `npm start`: Start the Expo development server.
- `npm run android`: Build and run the app on an Android emulator or device.
- `npm run ios`: Build and run the app on an iOS emulator or device.
- `npm run web`: Start the web version of the app.


## TroubleShooting
reference https://github.com/expo/expo/issues/32955#issuecomment-2479691104