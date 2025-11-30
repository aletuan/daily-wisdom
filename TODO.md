# Youth Wisdom - Feature Roadmap

This document outlines planned features to enhance the Youth Wisdom app experience, prioritizing depth, personalization, and shareability.

---

## 1. "Deep Dive" (Contextual Wisdom)

### Overview
Provide users with contextual background about quote authors without leaving the app, enabling deeper understanding of the wisdom source.

### Feature Description
**"Who is [Author]?" expandable card**

Users can tap on the author's name or a subtle info icon to reveal a brief biography focused on their philosophical contributions.

### User Experience
- **Entry Point**: Tappable author name or small info icon (ⓘ) next to the author's name
- **Interaction**: Tap to expand/collapse biography card
- **Content**: 2-3 sentence biography emphasizing philosophy and historical context
  - Example: "Lao Tzu was an ancient Chinese philosopher and writer, reputed author of the Tao Te Ching, the founder of philosophical Taoism, and a deity in religious Taoism and traditional Chinese religions."
- **Design**: Subtle, non-intrusive. Appears below the quote/author area when expanded

### Technical Considerations
- **Data Source**:
  - Option 1: Pre-curated biographies in `src/data/authorBios.js` (bilingual)
  - Option 2: AI-generated via Claude API (fallback to curated)
- **State Management**: Local component state for expand/collapse animation
- **Animation**: Smooth accordion-style expansion with spring animation
- **Bilingual**: Author bios must support both English and Vietnamese

### Success Metrics
- % of users who expand author info
- Average time spent reading author bios
- Correlation with app engagement/retention

---

## 2. "My Wisdom Book" (Favorites & History)

### Overview
Enable users to bookmark meaningful quotes and revisit their personal collection, fostering long-term engagement and personalization.

### Feature Description
**Favoriting system with dedicated library view**

Users can save quotes to a personal "Wisdom Book" and access their curated collection anytime.

### User Experience
- **Favoriting Action**:
  - Heart/bookmark icon on main wisdom screen (top-right or near quote)
  - Tap to toggle favorite status (filled/unfilled icon)
  - Optional: Haptic feedback on favorite
- **Library View**:
  - New tab in navigation or accessible from settings/profile
  - Named "My Wisdom Book" or "Saved Wisdom"
  - Scrollable list of favorited quotes with author avatars
  - Display format: Quote preview + author + date saved
  - Tap to view full wisdom details (including "why this" and activities)
- **Management**:
  - Swipe to unfavorite/delete from library
  - Optional: Sort by date saved or author
- **Carousal Slide**
  - Showing carousal slides in the Welcome Screen to introduce about app and features

### Technical Considerations
- **Storage**: AsyncStorage for persisted favorites
  - Data structure: Array of wisdom objects with metadata
  ```javascript
  {
    id: string,
    text: string,
    author: string,
    why_this: string,
    activities: array,
    savedAt: timestamp,
    language: 'en' | 'vi'
  }
  ```
- **Navigation**: Add new screen `MyWisdomBookScreen.js`
- **Component**: Reusable `WisdomCard` component for list items
- **Empty State**: Beautiful placeholder when no favorites yet

### Success Metrics
- % of users who favorite at least one quote
- Average number of favorites per active user
- Re-engagement: % of users who return to view favorites

---

## 3. Shareable Wisdom Cards (Social Grace)

### Overview
Transform wisdom into beautiful, shareable visual artifacts optimized for social media, eliminating the need for messy screenshots.

### Feature Description
**Beautiful quote image generator**

Generate aesthetically designed quote cards with one tap, ready for Instagram Stories, messaging apps, or saving to camera roll.

### User Experience
- **Entry Point**: "Share" button on main wisdom screen (icon: share arrow or export)
- **Generation Process**:
  1. Tap Share → Brief loading indicator
  2. Image generated showing quote + author + avatar
  3. Native share sheet appears with image attached
- **Image Design**:
  - Square format (1080x1080px) for Instagram
  - Background: Sage green gradient or textured paper effect
  - Quote text: Lora font, elegant typography
  - Author name + avatar at bottom
  - Subtle Youth Wisdom branding (small logo/watermark)
- **Share Options**: Instagram, Messages, Twitter, Save to Photos, etc.

### Technical Considerations
- **Image Generation**:
  - Option 1: `react-native-view-shot` to capture rendered view
  - Option 2: Canvas API to programmatically draw image
- **Implementation Steps**:
  1. Create `ShareableCard` component (hidden, renders off-screen)
  2. Style with fixed dimensions and export-friendly design
  3. Capture as image using view-shot
  4. Use `expo-sharing` to trigger native share sheet
- **Performance**: Cache author avatars, optimize image compression
- **Permissions**: Request photo library access if saving locally

### Success Metrics
- % of users who share wisdom cards
- Share frequency (shares per active user per week)
- Viral coefficient: New users from shared cards (if trackable)

---

## 4. Home Screen Widget (Low-Friction Wisdom)

### Overview
Provide ambient wisdom through a minimalist home screen widget, reducing friction and serving as a daily reminder without demanding attention.

### Feature Description
**Daily Wisdom Widget**

A simple, elegant widget that displays the quote of day directly on the user's home screen.

### User Experience
- **Widget Appearance**:
  - Clean, minimalist design
  - Quote text in beautiful serif font (Lora)
  - Rotating background colors: charcoal, cream, deep sage green
  - No clutter—just quote + attribution
- **Sizes**:
  - Small: Quote preview (first line + "...")
  - Medium: Full quote + author name
  - Large: Quote + author avatar
- **Interaction**: Tap widget → Opens full app to detailed wisdom view
- **Updates**: Widget refreshes daily with new quote

### Technical Considerations
- **iOS**: WidgetKit (Swift/SwiftUI widget extension)
  - Requires native module or Expo config plugin
  - Timeline provider for daily updates
- **Android**: App Widget (Kotlin/Java)
  - Update mechanism via WorkManager
- **Cross-Platform Challenge**:
  - Widgets require native code (not pure React Native)
  - May need separate native implementations for iOS/Android
  - Consider using Expo config plugins or bare workflow
- **Data Sharing**:
  - Widget needs access to quote data
  - Options: Shared preferences, app groups (iOS), or fetch from API
- **Fallback**: If widget unavailable, guide users to create manual shortcut

### Implementation Complexity
⚠️ **High complexity**: Requires native development skills

**Recommended Approach**:
1. Start with iOS WidgetKit implementation
2. Use curated quotes (not AI-generated) to avoid API calls from widget
3. Create widget extension in Xcode
4. Bridge data using App Groups
5. Replicate for Android if iOS proves successful

### Success Metrics
- Widget installation rate (% of users who add widget)
- Widget engagement (taps per day)
- Impact on daily app opens

---

## Implementation Priority

### Phase 1: Quick Wins (MVP)
1. **My Wisdom Book** (Favorites) - High value, moderate complexity
2. **Shareable Wisdom Cards** - High shareability potential, moderate complexity

### Phase 2: Depth & Context
3. **Deep Dive** (Author Bios) - Adds educational value, low complexity

### Phase 3: Advanced
4. **Home Screen Widget** - High technical complexity, consider after other features validate engagement

---

## Design Considerations

### Visual Consistency
- All features should align with existing sage green aesthetic
- Typography: Lora (serif) for quotes, Inter (sans) for UI
- Maintain minimalist, calming design language

### Bilingual Support
- All features must support English and Vietnamese
- Author bios, UI labels, share card text

### Performance
- Lazy load author bios to avoid bloating app bundle
- Optimize share card image generation (compress, cache)
- Widget should not drain battery or consume excessive data

---

## Future Enhancements

- **Wisdom Streaks**: Encourage daily engagement with streak counter
- **Reflection Journal**: Allow users to add personal notes to saved quotes
- **Community Wisdom**: See anonymized highlights of what others are favoriting
- **Audio Wisdom**: Text-to-speech option for listening to daily wisdom
- **Smart Notifications**: Time wisdom delivery based on user's emotional patterns

---

## Questions for Product Discussion

1. Should favoriting be unlimited, or encourage curation (e.g., max 50 favorites)?
2. For shareable cards: Include branding/watermark, or keep it minimal?
3. Widget: Is native development investment justified at this stage?
4. Author bios: AI-generated or hand-curated for quality control?

---

*Document Version: 1.0*
*Last Updated: 2025-11-27*
