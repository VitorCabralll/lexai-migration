# LexAI

LexAI is a legal document generation platform built with **Next.js** using the App Router. The frontend integrates with **Firebase** (Authentication, Firestore and Storage) and serverless **Genkit** functions. All assets are deployed using Firebase App Hosting.

## Architecture Overview
- **Next.js 15** with TypeScript and App Router
- **Firebase Authentication** for user sign-in
- **Firestore** for document and OCR results storage
- **Firebase Storage** for uploaded files
- **Genkit Cloud Functions** handle document generation and OCR

## Installation
1. Clone the repository
   ```bash
   git clone <repo-url>
   cd projeto_alvo
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on the template below and fill with your Firebase credentials
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```
4. (Optional) install function dependencies
   ```bash
   npm run install:functions
   ```

## Usage
- **Development**
  ```bash
  npm run dev
  ```
- **Type Checking & Lint**
  ```bash
  npm run typecheck
  npm run lint
  ```
- **Build**
  ```bash
  npm run build
  npm start
  ```

## Deploy
1. Build frontend and functions
   ```bash
   npm run build
   npm run build:functions
   ```
2. Deploy everything to Firebase
   ```bash
   firebase deploy
   ```

