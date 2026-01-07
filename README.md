# 📝 Online MD Editor
## Complete User & Developer Guide

![Markdown Editor](https://img.shields.io/badge/Markdown%20Editor-v3.0-blue?style=for-the-badge&logo=markdown)
![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-green?style=for-the-badge&logo=gnu)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)

---

## Overview

**Online MD Editor** is a professional, client-side README creation tool built with React and Next.js. It provides a split-screen editor with live preview, intelligent draft management, templates, and comprehensive error handling—all without requiring a backend.

### What You Get

✨ Real-time markdown preview with GitHub Flavored Markdown  
📝 Split-screen editor with resizable panes and scroll synchronization  
🎨 Multiple preview themes (light, dark, minimal)  
📦 Structured README builder with section-based editing  
💾 Automatic autosave with draft versioning  
✅ Markdown syntax validation with helpful feedback  
🛡️ Comprehensive error handling and recovery  
📱 Fully responsive design for mobile and desktop  
🚀 Zero backend, no authentication needed  

---

## Getting Started

### Installation

Start with the shadcn CLI for a fresh setup:

```bash
npx shadcn-cli@latest init
cd your-project
npm install
npm run dev
```

Open `http://localhost:3000` in your browser and you're ready to go.

### Your First Document

1. Start typing or paste existing markdown into the left editor pane
2. Watch the live preview update instantly in the right pane
3. Choose a template from the Template Selector to get started quickly
4. All changes save automatically to your browser storage

---



## Using the Editor

### Writing Your Document

Type directly into the left editor pane, paste markdown from other sources, import markdown files using the toolbar, or select a template to start with a structured outline. The right pane updates in real-time as you type, showing full support for headings, formatting, links, images, code blocks, tables, lists, blockquotes, and GitHub Flavored Markdown extensions like strikethrough and task lists.

### Adjusting Your Layout

Drag the divider between editor and preview to resize panes. Toggle scroll synchronization in the toolbar to keep the preview aligned with your editor scroll position. On mobile devices, the layout stacks vertically for easier navigation. Access the theme switcher from the header to change between light, dark, and minimal preview styles.

### Selecting Templates

Click the Template Selector button and choose from four starting points: the README template for standard project documentation, a Blog Post template with metadata, a formal Report template, or a Blank template to start from scratch. Each includes helpful section comments to guide your writing.

### Saving and Managing Drafts

Your content auto-saves every two seconds to browser storage, indicated by an unsaved changes banner when edits haven't been saved yet. Click "Save Draft" to manually save a version with a descriptive name and timestamp. Open the Drafts panel to view all saved versions, load any draft with a single click, pin important versions to keep them accessible, rename drafts for clarity, copy draft content, export individual drafts as markdown files, or delete unwanted versions.

---

## Advanced Features

### Structured Mode (README Builder)

Switch between raw markdown and Structured Mode for guided document building. In Structured Mode, add sections for headings, body text, code blocks, lists, or blockquotes. Move sections up and down, delete them, and reorder freely before exporting. The mode automatically converts your structure to clean markdown.

### Scroll Synchronization

Enable or disable scroll sync in the toolbar. When active, scrolling in the editor updates the preview position, useful for long documents. Toggle at any time based on your preference.

### Preview Themes

Choose your preferred reading style from the theme switcher in the app header. The light theme offers standard white background with dark text, dark theme provides a comfortable low-light reading experience, and minimal theme delivers clean black-on-white without styling distractions. Your preference persists across sessions.

### Copy, Export, and Import

Copy your full markdown content to the clipboard with one click. Export valid documents as `README.md` files directly to your computer. Import `.md` or `.txt` files from your computer to continue editing, replacing the current editor content.

---

## Error Handling and Validation

### Validation System

The app validates your markdown to catch issues before export. Errors block exporting: unclosed code blocks, unbalanced brackets, invalid characters, and empty content. Warnings are informational: heading hierarchy issues, performance concerns for large files, images without alt text, and approaching size limits. Validation feedback appears as banners in the editor.

### Empty States

When the editor is empty, you'll see a helpful prompt with template shortcuts. The preview shows supported markdown features and a list of GitHub Flavored Markdown extensions, updating in real-time as you type.

### Button States and Tooltips

Buttons intelligently disable based on context. The Copy button disables when the editor is empty. Export disables for invalid or empty content, showing the specific reason. Save Draft disables when unchanged. Import shows error messages if file reading fails. Clear disables for empty editors. Hover over any disabled button to see why it's unavailable.

### Handling Storage Issues

If localStorage becomes unavailable, a banner appears explaining the issue. Quota exceeded? Delete old drafts or clear your browser cache. Private browsing mode? The app works fine but won't save between sessions—export your work before closing. Access denied? Check your browser privacy and security settings.

### Unsaved Changes Warning

A yellow banner appears when you have unsaved edits. Dismiss it with the X button (your changes remain unsaved). Attempting to leave or refresh the page triggers a browser dialog. Auto-save clears the banner when your changes are saved.

---

## Technical Details

### Architecture

The project is organized with a main app folder containing the page and layout, a components folder with the editor, preview, toolbar, and supporting UI elements, and a lib folder with validation, storage, and utility functions.

**Key Libraries:** React 19 for UI, Next.js 16 for the framework, React Markdown with Remark GFM for GitHub Flavored Markdown rendering, Lucide Icons for the UI, TailwindCSS v4 for styling, and shadcn/ui for components.

**State Management:** Component-level state via useState for editor content and UI modes, side effects via useEffect for autosave and validation, memoized functions via useCallback for performance, and browser localStorage for persistent draft storage.

**Data Flow:** User input reaches the editor component, triggering change detection and localStorage autosave, which feeds into validation and rendering, ultimately displaying in the preview component.

### Browser Support

All modern browsers support core editing, localStorage, file downloads, file imports, scroll synchronization, and responsive design. Mobile support includes iOS Safari, Chrome for Android, and Samsung Internet. Minimum requirements: a modern browser with ES6+ support, 5MB localStorage space, and JavaScript enabled.

---

## Performance Tips

Keep files under 500KB for optimal preview rendering. Use structured mode for complex documents—it's more efficient for large files. Clear old drafts periodically to free up storage quota. Disable scroll sync for large files to reduce re-renders. Use templates for consistency and fewer validation errors.

For hardware requirements, 8GB RAM is recommended on desktop, 2GB+ on mobile for smooth performance. The app works completely offline with no internet connection required.

---

## Troubleshooting

**Changes Not Saving:** Check for the unsaved changes banner, verify localStorage is enabled in your browser, delete old drafts if quota is exceeded, and check the browser console (F12) for errors.

**Preview Not Rendering:** Look for validation error banners, ensure code blocks are properly closed with backticks, try toggling the preview theme, and clear your browser cache if the issue persists.

**Draft Not Loading:** Verify the draft exists in the draft manager, try refreshing the page, and if storage is corrupted, export what you can and clear site data to start fresh.

**Can't Export:** Verify your markdown is valid by checking error banners, ensure content isn't empty, confirm file size is under 10MB, and check your browser's download permissions.

**Mobile or Responsive Issues:** The editor stacks vertically on phones (this is normal), resize your browser window or rotate your device, use landscape orientation for a wider view, and pinch-to-zoom if text is too small.

**Private Browsing:** The app works fine but doesn't save drafts between sessions. Export your work before closing, use normal browsing for persistent storage, or accept limited functionality and export manually.

**Storage Quota Exceeded:** Open the Drafts manager and delete old or unused drafts, export important ones as backups first, clear your browser cache, and try again.

**File Import Not Working:** Ensure the file is `.md` or `.txt` format, check that the file is under 10MB, verify your browser file reading permissions, try a different file, or copy-paste as an alternative.

---

## Advanced Tips

### Working with Drafts

Name drafts descriptively—"v1.0 - Initial Release" is helpful; "Draft 1" is not. Use pinning to keep current versions easily accessible and maintain versions in chronological order. Periodically export important drafts as backups and keep versions as files (v1.0.md, v1.1.md, etc.).

### Large Projects

Split content across drafts: your main README in one, a contributing guide in another, API docs in a separate draft. Use structured mode for consistency and easier rearrangement. Preview different themes—light for standard reading, dark to reduce eye strain, minimal to focus purely on content.

### Collaboration

Create and export a draft as `.md`, share it via email or cloud storage, have your colleague import the file and save their own draft, then export and share back. It's not version control, but it works for asynchronous collaboration.

### Accessibility

The editor includes semantic HTML for screen readers, ARIA labels for buttons and regions, keyboard navigation support, high contrast themes, clear focus indicators, and validation warnings for images without alt text.

---

## FAQ

**Is my data secure?** All data stays on your device. Nothing is sent to servers. Keep in mind that localStorage can be accessed by any script on the site.

**Can I use this offline?** Yes, the app is completely offline-capable. Drafts stay local to your device.

**How much can I store?** Browser storage is typically 5-10MB. Multiple drafts consume space quickly, so manage old versions regularly.

**Can I recover deleted drafts?** No, deleted drafts are permanently removed. Exports are your backup strategy.

**Will this work on my phone?** Yes, responsive design adapts to all screen sizes with a single-column layout on mobile.

**Can I collaborate?** Export drafts and share `.md` files via email or cloud storage. Others can import and continue editing.

**What markdown features are supported?** All GitHub Flavored Markdown features: headings, bold, italic, links, images, code, tables, lists, task lists, strikethrough, and blockquotes.

---

---

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). 

You are free to use, modify, and distribute this software under the terms of the GPL-3.0 license. For more information, visit [https://www.gnu.org/licenses/gpl-3.0.en.html](https://www.gnu.org/licenses/gpl-3.0.en.html).

### What This Means

**Freedom to use:** You can use this software for any purpose.  
**Freedom to modify:** You can change and improve the code.  
**Freedom to distribute:** You can share your modified versions.  
**Copyleft:** Any derivative work must also be licensed under GPL-3.0.  

### Disclaimer

This software is provided "as is" without warranty of any kind. The authors are not liable for any damages arising from its use.

---

Built with ❤️ for developers who love clean, professional documentation.

Powered by React, Next.js, and the open-source community.
