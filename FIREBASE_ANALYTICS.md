# Firebase Analytics Setup

This document describes the Firebase Analytics implementation for the Bhandara Finder project.

## Overview

Firebase Analytics has been integrated to track user interactions and provide insights into app usage patterns. The analytics track various events related to bhandara submissions, views, and user interactions.

## Files Added/Modified

### 1. `/src/lib/firebase.ts`

- Added Firebase Analytics import and initialization
- Analytics is conditionally initialized only in browser environments

### 2. `/src/lib/analytics.ts` (New)

- Type-safe analytics tracking functions
- Custom event definitions for bhandara-specific interactions
- Helper functions for common tracking scenarios

### 3. `/src/hooks/useAnalytics.ts` (New)

- React hook for automatic page view tracking
- Tracks route changes automatically

### 4. `/src/App.tsx`

- Integrated the analytics hook for page view tracking

### 5. `/src/components/BhandaraForm.tsx`

- Tracks when users start filling the form
- Tracks successful bhandara submissions with location and photo data

### 6. `/src/components/BhandaraCard.tsx`

- Tracks bhandara views when cards are displayed
- Tracks upvote interactions

## Events Tracked

### Core Events

- **page_view**: Automatic tracking of route changes
- **bhandara_form_started**: When user opens the bhandara submission form
- **bhandara_submitted**: When a bhandara is successfully submitted
- **bhandara_viewed**: When a bhandara card is displayed to user
- **bhandara_liked**: When user upvotes a bhandara
- **search_performed**: When user performs a search (ready for future implementation)

### Event Parameters

Each event includes relevant context:

- Location information (when available)
- Bhandara IDs for interaction tracking
- Photo availability for submissions
- Search terms for search events

## Usage Examples

```typescript
import { trackEvent, trackBhandaraSubmitted } from "../lib/analytics";

// Track custom event
trackEvent("bhandara_submitted", {
  location: "Delhi",
  has_photos: true,
});

// Use helper function
trackBhandaraSubmitted("Delhi", true);
```

## Analytics Dashboard

View analytics data in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the "bhandare-ki-jankari" project
3. Navigate to Analytics > Events

## Privacy Considerations

- No personal information is tracked
- User IDs are anonymized by Firebase
- Location data is aggregated and non-specific
- All tracking complies with data privacy best practices

## Development vs Production

Analytics events are sent in both development and production environments. During development, you can monitor events in the Firebase Analytics DebugView for real-time testing.

To enable DebugView during development:

1. Install the Firebase DebugView Chrome extension
2. Or run with debug parameter: `?debug_mode=true`
