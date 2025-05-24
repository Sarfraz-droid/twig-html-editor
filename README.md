# Twig HTML Editor

A powerful HTML editor with Twig templating support and configurable HTML head elements.

## Features

### 🎨 **Live HTML Editor**
- Real-time HTML editing with Monaco Editor
- Syntax highlighting and error detection
- Live preview with automatic rendering
- **Auto New-Tab Links**: All links in preview automatically open in new tabs for safety

### 🧩 **Twig Templating**
- Full Twig template engine support
- Dynamic content rendering with JSON data
- Custom functions and filters support
- Variables and control structures

### 📄 **HTML Head Management**
- **NEW**: Configure HTML head elements through an intuitive drawer interface
- Set page title, meta description, and meta keywords
- Configure viewport settings
- Add custom head content (CSS, scripts, meta tags)
- Real-time preview integration

### 🔗 **URL State Management**
- **NEW**: Save and share application state via compressed URLs
- **Advanced Compression**: Uses LZ-string compression to dramatically reduce URL size
- **Hash Fragments**: Uses URL hash (#) instead of query parameters to avoid server limits
- **Smart Optimization**: Only stores differences from default values
- Automatic URL updates as you edit (debounced)
- One-click sharing with clipboard integration
- Restore complete state from shared URLs
- Includes HTML content, JSON data, and head elements
- **100% URL-based**: No localStorage dependency - truly portable sharing

### ⚡ **Advanced Features**
- Custom function editor with JavaScript support
- JSON data editor for template variables
- Popup preview window
- Auto-refresh functionality
- Dark theme interface
- **Secure Link Handling**: Links automatically get `target="_blank"` and `rel="noopener noreferrer"`

## Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

### Usage

1. **Edit HTML**: Write your HTML with Twig template syntax in the left editor
2. **Configure Head Elements**: Click the "📄 HTML Head" button to open the header drawer
3. **Add JSON Data**: Provide template variables in the JSON editor
4. **Create Functions**: Use the "+ Function" button to add custom JavaScript functions
5. **Share Your Work**: Click the "Share" button to copy a shareable URL
6. **Preview**: View the rendered result in the live preview panel

## Sharing & URL State

### 🔗 **Share Button**
- Click the "Share" button in the navbar to generate a shareable URL
- **Compressed URLs**: Uses advanced LZ-string compression for minimal URL size
- **No Server Issues**: Uses URL hash fragments that don't get sent to servers
- **Truly Portable**: Everything is in the URL - works across browsers and devices
- Share the URL with others to restore the exact same content and settings

### 🔄 **Auto-Save to URL**
- Your work is automatically saved as you type (with 1-second debouncing)
- **Hash-based Storage**: State stored in URL hash fragment (after #)
- **Optimized Encoding**: Only saves differences from defaults to minimize size
- Bookmark or share the URL at any time to preserve your current state
- Refresh the page and your work will be automatically restored

### 📋 **Technical Features**
- **LZ-String Compression**: Advanced compression algorithm reduces URL size by 60-80%
- **Smart Defaults**: Only encodes values that differ from defaults
- **Hash Fragments**: Uses `#state=...` to avoid server processing
- **URL Safe**: All encoding is URL-safe and shareable
- **No 431 Errors**: Hash fragments bypass server header size limits

### 📋 **State Includes**
- HTML template content
- JSON data variables
- All HTML head elements (title, meta tags, custom content)
- Everything needed to reproduce your exact setup

## HTML Head Features

The header drawer allows you to configure:

- **Page Title**: Set the HTML `<title>` tag
- **Meta Description**: Add SEO-friendly page descriptions (with character count)
- **Meta Keywords**: Specify page keywords for SEO
- **Viewport**: Configure responsive design settings
- **Custom Head Content**: Add any additional HTML head elements

### Quick Meta Tag Buttons
- UTF-8 Charset
- Robots Meta Tag
- Author Meta Tag

## Example

```html
<header>
    <h1>Welcome to {{name}}</h1>
    <p>Today is: {{now() | dateFormat}}</p>
</header>
<main>
    <div class="content">
        <h2>About {{name}}</h2>
        <p>This page demonstrates HTML head integration with Twig templating.</p>
    </div>
</main>
```

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Monaco Editor** for code editing
- **Twig.js** for template processing
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components

## Development

Built with React + TypeScript + Vite template with additional customizations for Twig templating, HTML head management, and URL state persistence.
