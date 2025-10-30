# ParetOS Mock Data Setup

## Overview
This application has been modified to run without external authentication and API dependencies. All data is now served from comprehensive mock data sources, allowing the UI to function fully offline.

## Changes Made

### 1. Authentication Bypass
- AWS Amplify authentication has been disabled
- The app now automatically treats users as authenticated
- No login is required to access any features
- `AuthenticatedRoute` component always allows access

### 2. Mock Data Service (`src/services/mockDataService.ts`)
Created a comprehensive mock data service that provides:

#### Mock User Data
- Default demo user with full profile information
- User ID: `bc382b6b-b3fc-4f9c-8f41-88280779ced0`
- Includes XP, achievements, and learning progress

#### Mock Experiences
- **Training/Apprenticeship**: Development environment setup tutorials
- **Product**: Portfolio product building experience  
- **Interviewing**: Technical interview preparation materials

#### Mock Sprints
- Pre-configured sprint data with missions and daily tasks
- Includes planning and review sections
- Team collaboration features

#### Mock Mentorship Data
- Sample coaches/mentors with profiles
- Sample athletes/mentees
- Relationship management data

#### Mock Sanity CMS Data
- **Technical Schemas**: React, Node.js, Database courses
- **Economic Schemas**: Freelancing and startup economics
- **Hub Schemas**: Community hubs for developers

### 3. API Call Replacements
All API calls have been replaced with mock service calls:
- `fetchUser()` → `mockService.api.getUser()`
- `fetchSprints()` → `mockService.api.getSprints()`
- `fetchCoaches()` → `mockService.api.getCoaches()`
- `fetchExperiences()` → `mockService.api.getExperiences()`
- WebSocket connections removed (sprints use static data)

### 4. Files Modified
- `src/App.tsx` - Replaced Auth and API calls with mock service
- `src/components/AuthenticatedRoute.tsx` - Bypassed authentication checks
- `src/utils/queries/initialFetchQueries.ts` - Uses mock data providers
- `src/offline-data/*.js` - Fixed exports for mock data files

### 5. Mock Authentication Flow
The mock auth service provides:
- `signIn()` - Always returns success with demo user
- `signOut()` - Clears local storage
- `currentSession()` - Returns mock session
- `signUp()` - Creates new mock user
- `resetPassword()` - Returns success message

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will run on `http://localhost:5173/`

## Available Features with Mock Data

1. **User Profile** - View and edit demo user profile
2. **Learning Experiences** - Browse training, product, and interview prep modules
3. **Sprint Management** - View and interact with sprint planning tools
4. **Mentorship** - See coach/athlete relationships
5. **Context Builder** - Browse technical and economic learning resources
6. **Community Hubs** - Access developer community features

## Data Persistence
- Mock data is loaded fresh on each page reload
- User modifications are stored in browser localStorage
- No backend persistence (all changes are local)

## Demo Credentials
No login required! The app automatically uses a demo user account.

## Extending Mock Data
To add more mock data:
1. Edit `src/services/mockDataService.ts`
2. Add new data to the appropriate section
3. Update the mock API methods if needed

## Original Data Sources (Now Mocked)
- AWS Cognito (Authentication)
- AWS API Gateway + Lambda (REST APIs)
- WebSocket connections (Real-time sprint updates)
- Sanity CMS (Content management)
- AWS S3 (File storage)

All these services are now simulated locally with comprehensive mock data.
