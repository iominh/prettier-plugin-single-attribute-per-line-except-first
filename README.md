# prettier-plugin-single-attribute-per-line-except-first

A Prettier plugin that formats HTML and JSX elements with a special attribute alignment pattern:

- First attribute stays on the same line as the tag
- Additional attributes each go on their own line
- All subsequent attributes are aligned with the first attribute

This creates a clean, readable format that's ideal for components with multiple attributes.

## Installation

```bash
npm install --save-dev prettier prettier-plugin-single-attribute-per-line-except-first
```

## Usage

Add the following to your Prettier config file (`.prettierrc`, `.prettierrc.json`, or `.prettierrc.js`):

```json
{
  "singleAttributePerLineExceptFirst": true
}
```

## Example

**Input code (before formatting):**

```html
<div
  id="container"
  class="main-container"
  style="width: 100%"
  data-testid="test-container"
>
  <span>Content</span>
</div>
```

**With this plugin (singleAttributePerLineExceptFirst: true):**

```html
<div
  id="container"
  class="main-container"
  style="width: 100%"
  data-testid="test-container"
>
  <span>Content</span>
</div>
```

**With standard Prettier (singleAttributePerLine: true):**

```html
<div
  id="container"
  class="main-container"
  style="width: 100%"
  data-testid="test-container"
>
  <span>Content</span>
</div>
```

## JSX Example

**Before formatting:**

```jsx
<Button
  onClick={handleClick}
  className="primary"
  disabled={isDisabled}
  type="submit"
  aria-label="Submit"
>
  Submit
</Button>
```

**After formatting with this plugin:**

```jsx
<Button
  onClick={handleClick}
  className="primary"
  disabled={isDisabled}
  type="submit"
  aria-label="Submit"
>
  Submit
</Button>
```

## Supported Languages

This plugin works with:

- HTML
- JSX (React)
- Vue
- Angular

## Features

- ✅ Keeps first attribute on the same line as the tag
- ✅ Places each additional attribute on its own line
- ✅ Aligns subsequent attributes with the first attribute
- ✅ Works with self-closing tags
- ✅ Maintains proper indentation of content
- ✅ Compatible with Prettier v2.x and v3.x

## Why use this plugin?

This formatting style combines the best of both worlds:

- The compactness of inline attributes for simple elements
- The readability of one-attribute-per-line for complex elements
- The visual clarity of aligned attributes

It's especially useful for components with many attributes, like form elements, containers with multiple props, or components with complex event handlers.

## License

MIT
