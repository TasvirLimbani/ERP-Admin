# Quick Start Guide

## First Time Setup

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Run Development Server
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

### 3. Open the Application
Navigate to [http://localhost:3000](http://localhost:3000)

You'll automatically be redirected to the login page.

## Logging In

**Demo Credentials:**
- Email: `demo@example.com` (or any email)
- Password: `demo123` (or any password with 6+ characters)

The app accepts any valid email and password (minimum 6 characters) for demo purposes.

## First Steps

### 1. Dashboard Overview
After login, you'll see the dashboard with:
- Key statistics (Managers, Machines, Yarn Types, Stock Items)
- Recent activity feed
- Quick action buttons
- System status

### 2. Explore Inventory Modules

Use the sidebar to navigate to different inventory sections:

- **Managers**: Add and manage personnel
- **Machines**: Track equipment and status
- **Yarn**: Manage yarn variants
- **TPM**: Schedule maintenance
- **Dyeing**: Track dyeing batches
- **Conning**: Manage cone production
- **Packing**: Track packing operations
- **Stock**: Warehouse inventory

### 3. Common Tasks

#### Add a New Item
1. Click on any inventory module from the sidebar
2. Click the "Add New" button
3. Fill in the form fields
4. Click "Save"

#### Edit an Item
1. Navigate to the module
2. Find the item in the table
3. Click the edit icon (pencil)
4. Update the fields
5. Click "Save"

#### Delete an Item
1. Navigate to the module
2. Find the item in the table
3. Click the delete icon (trash)
4. Confirm the deletion

#### Search Through Data
- Use pagination controls at the bottom of tables
- Tables display 10 items per page by default

### 4. Demo Data

The app automatically loads demo data on first visit including:
- 3 sample managers
- 3 sample machines
- 3 sample yarn types
- Sample maintenance records
- Sample production batches

Feel free to delete or modify this data.

## Key Features to Try

### Responsive Design
- Try resizing your browser to see the responsive layout
- Sidebar collapses on smaller screens
- Test on mobile device using DevTools

### PWA Installation
1. In Chrome/Edge, look for install prompt in address bar
2. Click "Install"
3. App appears in your applications menu
4. Works offline (cached assets)

### Dark Theme
The app uses a premium dark theme throughout. The theme is applied automatically to the entire interface.

## File Organization

### Pages to Customize
- `/app/admin/` - All admin pages (dashboard and inventory modules)
- `/app/login/page.tsx` - Login page
- `/app/page.tsx` - Root page (redirects to login)

### Components to Modify
- `/components/admin/sidebar.tsx` - Navigation menu
- `/components/admin/data-table.tsx` - Data table display
- `/components/admin/item-modal.tsx` - Add/Edit form modal

### Styling
- `/app/globals.css` - Global styles and design tokens
- `/tailwind.config.ts` - Tailwind configuration

### Data Management
- `/lib/storage.ts` - localStorage utilities and demo data
- `/lib/auth.ts` - Authentication logic

## Troubleshooting

### Data Not Persisting
- Check if localStorage is enabled in your browser
- Open DevTools → Application → Local Storage
- Data should show with prefix `yarn_factory_`

### Sidebar Not Working
- Ensure JavaScript is enabled
- Check browser console for errors (F12)
- Try refreshing the page

### Icons Not Showing
- Icons use lucide-react library
- Ensure all dependencies are installed: `npm install`
- Clear browser cache and reload

### Service Worker Issues
- Service worker should register automatically
- Check DevTools → Application → Service Workers
- On first load, service worker needs to cache assets

## Next Steps

### To Make Changes
1. Edit React components in `/components/` and `/app/`
2. Save changes - HMR will reload automatically
3. Check browser for any errors

### To Add New Modules
1. Create new page: `/app/admin/[moduleName]/page.tsx`
2. Copy existing module (e.g., manager) as template
3. Update the formFields and columns
4. Add menu item in `/components/admin/sidebar.tsx`

### To Connect Real Database
1. Replace storage functions in `/lib/storage.ts`
2. Use your database API instead of localStorage
3. Implement proper authentication
4. Add error handling for API calls

### To Customize Colors
1. Open `/app/globals.css`
2. Edit CSS custom properties (--color-*)
3. Also update `/tailwind.config.ts` if needed
4. Colors will update throughout the app

## Development Tips

### Hot Module Replacement (HMR)
- Changes in components/pages hot reload without losing state
- CSS changes apply instantly
- Useful for rapid development

### TypeScript
- Strong type checking for all components
- Intellisense helps discover available props
- Import types: `interface ComponentProps { }`

### Browser DevTools
- React DevTools extension helpful for debugging
- Inspect localStorage data directly
- Check Network tab for API calls

### Console Logs
- Use for debugging data flow
- Check form submissions: `console.log(formData)`
- Verify state updates

## Performance Tips

- App caches static assets with service worker
- CSS-in-JS and styling is minimal
- Pagination prevents huge data tables
- Images are optimized

## Common Questions

**Q: Where is my data saved?**
A: In browser localStorage. Each collection has a prefix `yarn_factory_`

**Q: Can I share data between browsers?**
A: No, each browser has separate localStorage. For shared data, implement database backend.

**Q: Is there a real backend?**
A: No, this is a frontend-only demo. API routes exist but use client-side storage.

**Q: How do I reset all data?**
A: Open DevTools → Application → Local Storage → Delete all `yarn_factory_*` entries

**Q: Can I deploy this?**
A: Yes! Use `npm run build` then deploy to Vercel, Netlify, or any Node.js host.

---

Have questions? Check the README.md for more detailed documentation!
