# Aikido Safe Package Chrome Extension

A Chrome extension that embeds security badge images on npmjs.com package pages.

## Features

- Automatically detects npm package pages
- Embeds a security badge at the top of the page
- Clickable badge for more information
- Responsive design

## Project Structure

```
chrome/
├── manifest.json       # Extension configuration
├── content.js         # Main script that runs on npmjs.com
├── content.css        # Styles for the embedded badge
├── badge.png          # Badge image (you need to add this)
└── images/            # Extension icons (you need to add these)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Setup

1. **Add required images:**
   - Add a `badge.png` file (the image to embed on pages)
   - Create an `images/` folder with icon files (16x16, 48x48, 128x128)

2. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `chrome/` directory

3. **Test the extension:**
   - Visit any npm package page (e.g., https://www.npmjs.com/package/react)
   - You should see the badge embedded on the page

## Customization

### Change the badge position
Edit `content.js` in the `findTargetElement()` function to target different elements on the page.

### Change the badge style
Edit `content.css` to customize the appearance of the badge.

### Make the badge clickable
The badge currently logs to console. Update the click handler in `content.js` to:
- Open a popup
- Redirect to a security report
- Show an inline modal

## Development Tips

- Use Chrome DevTools to inspect the extension
- Check the Console for debug messages
- Right-click the extension icon > "Inspect popup" for popup debugging
- Changes to content scripts require reloading the extension

## Next Steps

1. Replace the placeholder badge image with your actual security badge
2. Add extension icons
3. Integrate with your security API to fetch real-time data
4. Add more sophisticated badge placement logic
5. Create a popup with detailed security information
