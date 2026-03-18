# Configuration Guide

Customize your Yarn Factory inventory management system with these configuration options.

## Color Scheme

### Update Global Colors

Edit `/app/globals.css` to change the color scheme:

```css
:root {
  --background: #0f1117;        /* Main background */
  --foreground: #e6edf3;        /* Main text color */
  --card: #161b22;              /* Card backgrounds */
  --primary: #58a6ff;           /* Primary accent (buttons, links) */
  --accent: #1f6feb;            /* Secondary accent */
  --muted: #30363d;             /* Muted text and backgrounds */
  --border: #30363d;            /* Border colors */
  --destructive: #f85149;       /* Delete/dangerous actions */
  /* ... more colors ... */
}
```

### Update Tailwind Tokens

Edit `/tailwind.config.ts` to add custom color utilities:

```typescript
colors: {
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: {
    DEFAULT: "var(--primary)",
    foreground: "var(--primary-foreground)",
  },
  // ... add more colors ...
}
```

## Typography

### Change Fonts

Edit `/app/layout.tsx`:

```typescript
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' })

// In your font family config
fontFamily: {
  sans: ["var(--font-sans)"],
  serif: ["var(--font-serif)"],
}
```

### Change Font Sizes

Edit global styles in `/app/globals.css`:

```css
body {
  @apply text-base; /* Change base font size */
}

h1 {
  @apply text-4xl; /* Adjust heading sizes */
}
```

## Navigation

### Add New Module to Sidebar

Edit `/components/admin/sidebar.tsx`:

```typescript
const menuItems = [
  // ... existing items ...
  {
    label: "New Module",
    href: "/admin/new-module",
    icon: FileText, // lucide-react icon
  },
]
```

Then create the page:
```
/app/admin/new-module/page.tsx
```

### Change Dashboard Stats

Edit `/app/admin/page.tsx` to modify the stats cards:

```typescript
const stats = [
  {
    label: "New Metric",
    value: "123",
    icon: BarChart3,
    trend: "+10 this month",
    color: "from-green-500 to-green-600",
  },
  // ... more stats ...
]
```

## Data Management

### Add New Inventory Module

1. **Create new storage collection** in `/lib/storage.ts` (seedDemoData function):
```typescript
const newItems = [
  { name: "Item 1", value: "data1" },
  { name: "Item 2", value: "data2" },
]

newItems.forEach((item) => addItem("new-collection", item))
```

2. **Create new page** at `/app/admin/new-collection/page.tsx`:
```typescript
const COLLECTION = "new-collection"

const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "value", label: "Value" },
]

const formFields: FormField[] = [
  {
    name: "name",
    label: "Item Name",
    type: "text",
    required: true,
  },
  // ... more fields ...
]
```

3. **Add to sidebar** in `/components/admin/sidebar.tsx`

### Modify Form Fields

Each inventory page has a `formFields` array. To customize:

```typescript
const formFields: FormField[] = [
  {
    name: "fieldName",
    label: "Display Label",
    type: "text", // text, email, number, textarea, select
    placeholder: "Enter value",
    required: true,
    options: [ // for select type
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
  },
]
```

### Change Table Columns

Each inventory page has a `columns` array:

```typescript
const columns: Column[] = [
  { key: "fieldName", label: "Display Label", width: "w-24" }, // optional width
  { key: "anotherField", label: "Another Label" },
]
```

## Authentication

### Customize Login Page

Edit `/app/login/page.tsx`:

- Change title and description
- Update logo/icon
- Modify form fields
- Change button text and colors

### Change Authentication Logic

Edit `/lib/auth.ts`:

```typescript
export function login(email: string, password: string): User {
  // Add custom validation
  if (!email.includes("@")) {
    throw new Error("Valid email required")
  }
  
  // Custom user creation logic
  const user: User = {
    id: `custom_${Date.now()}`,
    email,
    name: extractName(email),
  }
  
  setUser(user)
  return user
}
```

## UI Customization

### Change Button Styles

Edit button components in pages to modify styles:

```typescript
<Button 
  className="bg-green-600 hover:bg-green-700 text-white"
  size="lg"
>
  Custom Button
</Button>
```

### Customize Modal Forms

Edit `/components/admin/item-modal.tsx`:

- Change modal size: `max-w-md` → `max-w-lg`
- Modify form styling
- Update button labels
- Add custom validation

### Change Table Appearance

Edit `/components/admin/data-table.tsx`:

```typescript
// Change items per page
export default function DataTable({
  itemsPerPage = 20, // Was 10
  // ... other props
}) {
```

## Layout

### Change Sidebar Width

Edit `/components/admin/sidebar.tsx`:

```typescript
return (
  <aside
    className={`${
      open ? "w-72" : "w-24"  // Change from w-64 to w-72
    } bg-sidebar ...`}
  >
```

### Modify Admin Header

Edit `/app/admin/layout.tsx` to change the top navigation bar:

```typescript
<header className="h-20 bg-gradient-to-r from-primary to-accent">
  {/* Custom header content */}
</header>
```

## PWA Configuration

### Update App Name

Edit `/public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "description": "Your description",
  // ... more config ...
}
```

### Change App Icons

Replace icons in `/public/`:
- `icon-192x192.png` - Small icon
- `icon-512x512.png` - Large icon

### Modify Service Worker

Edit `/public/sw.js`:

```javascript
const CACHE_NAME = "your-app-v1" // Change cache name
const ASSETS_TO_CACHE = [
  "/",
  "/admin",
  // Add more routes to cache
]
```

## API Configuration

### Change API Endpoints

Edit pages to modify API calls (currently using localStorage):

```typescript
// Before: localStorage
const items = getAllItems("collection")

// After: API endpoint
const response = await fetch("/api/collection")
const items = await response.json()
```

### Add Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=your_database_url
AUTH_SECRET=your_secret_key
```

Use in code:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## Performance Tuning

### Change Pagination Size

Edit each inventory page:

```typescript
<DataTable
  itemsPerPage={15} // Change from 10
  data={items}
  // ... other props
/>
```

### Optimize Images

Add next/image:

```typescript
import Image from "next/image"

<Image
  src="/icon.png"
  alt="Icon"
  width={32}
  height={32}
/>
```

### Enable Next.js Optimizations

Edit `next.config.mjs`:

```typescript
const nextConfig = {
  images: {
    optimization: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
}
```

## Theme Customization Example

Here's a complete theme customization example:

### 1. Update Colors in globals.css

```css
:root {
  --background: #1a1a2e;
  --foreground: #fff;
  --primary: #16c784;
  --accent: #00d4aa;
  --destructive: #ef5350;
}
```

### 2. Update Tailwind Config

```typescript
colors: {
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: { DEFAULT: "var(--primary)" },
  accent: { DEFAULT: "var(--accent)" },
}
```

### 3. Update Sidebar Branding

Edit sidebar.tsx to change logo colors:

```typescript
<div className="bg-gradient-to-br from-green-500 to-teal-600">
  {/* Logo */}
</div>
```

### 4. Test Changes

Save files - HMR will reload automatically and show new theme.

## Exporting Configuration

Create a config file for easy management:

Create `/config/app.ts`:

```typescript
export const APP_CONFIG = {
  name: "Yarn Factory",
  modules: [
    { name: "manager", label: "Managers" },
    { name: "machines", label: "Machines" },
    // ... more modules
  ],
  colors: {
    primary: "#58a6ff",
    accent: "#1f6feb",
  },
  paginationSize: 10,
}
```

Then import in components:

```typescript
import { APP_CONFIG } from "@/config/app"

const pageSize = APP_CONFIG.paginationSize
```

---

For more detailed information, see README.md and QUICKSTART.md
