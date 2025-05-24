# Twig HTML Editor

A powerful HTML editor with Twig templating support and configurable HTML head elements.

## Features

### 🎨 **Live HTML Editor**
- Real-time HTML editing with Monaco Editor
- Syntax highlighting and error detection
- Live preview with automatic rendering

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

### ⚡ **Advanced Features**
- Custom function editor with JavaScript support
- JSON data editor for template variables
- Popup preview window
- Auto-refresh functionality
- Dark theme interface

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
5. **Preview**: View the rendered result in the live preview panel

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

Built with React + TypeScript + Vite template with additional customizations for Twig templating and HTML head management.
