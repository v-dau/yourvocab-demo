# Header Component - Quick Reference

## What Was Created

### ✅ Core Components

1. **Header.tsx** - Main header with navigation, theme toggle, language selector, user menu
2. **MainLayout.tsx** - Layout wrapper that includes Header + page content

### ✅ UI Components

3. **dropdown-menu.tsx** - Radix UI dropdown menu (used for language selector and user menu)
4. **avatar.tsx** - Radix UI avatar component (used for user profile picture)

### ✅ Documentation

5. **HEADER_README.md** - Complete usage guide with examples and props documentation
6. **INTEGRATION_GUIDE.md** - Step-by-step integration instructions
7. **HEADER_IMPLEMENTATION_SUMMARY.md** - Full technical summary

## Quick Start (3 Steps)

### Step 1: Import

```tsx
import { Header } from "@/components/layout";
```

### Step 2: Use in your page

```tsx
<Header
  isLoggedIn={false}
  currentTheme="light"
  onThemeToggle={() => toggleTheme()}
/>
```

### Step 3: Or use MainLayout wrapper

```tsx
<MainLayout isLoggedIn={true} username="John">
  {/* Your page content */}
</MainLayout>
```

## Features

✅ Minimalist design (transparent background)  
✅ Logo with navigation links (Cards, Spaced Repetition)  
✅ Theme toggle (Sun/Moon icons)  
✅ Language selector (English/Vietnamese)  
✅ User authentication (Login button or Avatar menu)  
✅ Responsive (hidden nav links on mobile)  
✅ Full TypeScript support  
✅ Zero compilation errors

## File Locations

```
frontend/
└── src/
    └── components/
        ├── layout/
        │   ├── Header.tsx
        │   ├── MainLayout.tsx
        │   ├── index.ts
        │   ├── HEADER_README.md
        │   └── INTEGRATION_GUIDE.md
        └── ui/
            ├── avatar.tsx
            ├── dropdown-menu.tsx
            └── index.ts
```

## Props

```typescript
// Header Props
interface HeaderProps {
  isLoggedIn?: boolean; // default: false
  username?: string; // default: "User"
  userAvatar?: string; // user's avatar URL
  onLogout?: () => void; // logout callback
  onThemeToggle?: () => void; // theme toggle callback
  currentTheme?: "light" | "dark"; // default: 'light'
}
```

## Routes Used

- `/dashboard` - Home page (logo click)
- `/cards` - Vocabulary cards page (nav link)
- `/review` - Spaced repetition page (nav link)
- `/signin` - Sign in page (login button)
- `/settings` - Settings page (user menu)

Make sure these routes exist in your app!

## Example: Full Integration

```tsx
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { MainLayout } from "@/components/layout";
import { CardsPage } from "@/pages/CardsPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear auth token, etc.
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Apply to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <BrowserRouter>
      <MainLayout
        isLoggedIn={isLoggedIn}
        username="John Doe"
        currentTheme={theme}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/cards" element={<CardsPage />} />
          {/* Add more routes */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
```

## Verification

✅ **TypeScript**: Zero errors  
✅ **Imports**: All working correctly  
✅ **Dependencies**: All installed (@radix-ui, lucide-react)  
✅ **Components**: Ready to use

## Need Help?

- **Usage examples**: See [HEADER_README.md](./frontend/src/components/layout/HEADER_README.md)
- **Integration steps**: See [INTEGRATION_GUIDE.md](./frontend/src/components/layout/INTEGRATION_GUIDE.md)
- **Full details**: See [HEADER_IMPLEMENTATION_SUMMARY.md](./HEADER_IMPLEMENTATION_SUMMARY.md)

## Created Files Summary

| File                             | Type          | Purpose                     |
| -------------------------------- | ------------- | --------------------------- |
| Header.tsx                       | Component     | Main header navigation      |
| MainLayout.tsx                   | Component     | Layout wrapper with Header  |
| dropdown-menu.tsx                | UI Component  | Dropdown menu functionality |
| avatar.tsx                       | UI Component  | Avatar display component    |
| HEADER_README.md                 | Documentation | Usage guide                 |
| INTEGRATION_GUIDE.md             | Documentation | Integration instructions    |
| HEADER_IMPLEMENTATION_SUMMARY.md | Documentation | Technical summary           |

**Status**: ✅ Ready to use - No errors, fully documented, production-ready!
