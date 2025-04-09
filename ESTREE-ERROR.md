# Fixing "Cannot read properties of undefined reading estree" Error

If you encounter the error "Cannot read properties of undefined reading estree" when using this plugin, it indicates that the plugin cannot find the estree printer which is needed to format JSX/JavaScript content.

## Common Causes and Solutions

### 1. Missing Dependencies

The most common cause is that the required Prettier parser packages are not installed or not accessible to the plugin.

**Solution:**
Install the necessary Prettier parsers:

```bash
npm install --save-dev prettier prettier-plugin-single-attribute-per-line-except-first @prettier/plugin-babel @prettier/plugin-html
```

Or add these dependencies to your package.json:

```json
"dependencies": {
  "prettier": "^3.0.0"
},
"devDependencies": {
  "@prettier/plugin-php": "^0.19.6",
  "prettier-plugin-organize-imports": "^3.2.3"
}
```

### 2. Using Only HTML

If you're only formatting HTML files and don't need JSX support, you can modify your plugin usage to only apply to HTML files:

**.prettierrc.json**:

```json
{
  "plugins": ["prettier-plugin-single-attribute-per-line-except-first"],
  "singleAttributePerLineExceptFirst": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "html"
      }
    }
  ]
}
```

### 3. Using with Prettier v3

Prettier v3 changed how plugins are loaded and configured. Make sure you're using the latest version of the plugin that's compatible with Prettier v3.

**Solution:**
Update your Prettier configuration:

```json
{
  "plugins": [
    "./node_modules/prettier-plugin-single-attribute-per-line-except-first"
  ],
  "singleAttributePerLineExceptFirst": true
}
```

### 4. Use the Fixed Plugin Version

We've updated the plugin code to handle cases where the estree printer might not be available. This updated version adds:

1. Safe imports with fallbacks
2. Null checks before attempting to use the printers
3. Conditional inclusion of the babel printer only if estree is available

**Solution:**
Replace your index.js with the updated version provided in this repository.

### 5. Simplified Usage

If you continue having issues, you can use this plugin exclusively for HTML formatting and use standard Prettier configuration for JavaScript/JSX:

**.prettierrc.json**:

```json
{
  "plugins": ["prettier-plugin-single-attribute-per-line-except-first"],
  "singleAttributePerLineExceptFirst": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "html"
      }
    },
    {
      "files": ["*.jsx", "*.js", "*.tsx", "*.ts"],
      "options": {
        "singleAttributePerLine": true
      }
    }
  ]
}
```

This configuration will use our plugin for HTML files but fall back to Prettier's built-in singleAttributePerLine option for JavaScript/JSX files.
