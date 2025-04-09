# Testing the Plugin

This document explains how to run and extend the tests for the `prettier-plugin-single-attribute-per-line-except-first` plugin.

## Setup

1. Install the development dependencies:

```bash
npm install
```

2. Run the tests:

```bash
npm test
```

## Test Structure

The tests are written using Jest and cover various scenarios:

- Simple HTML elements with multiple attributes
- Nested elements
- Elements with only one attribute
- Self-closing elements
- Elements with extremely long tag names
- Elements with no attributes
- JSX elements with expressions
- Boolean and shorthand attributes
- Complex React components
- Testing the disabled option
- Mixed content
- Vue templates with directives

## Adding New Tests

To add a new test case:

1. Open `plugin.test.js`
2. Add a new test using the `test()` function
3. Use the `format()` helper function to run your input through the plugin
4. Use an `expect().toMatchInlineSnapshot()` assertion - Jest will update the snapshot when you run the tests

Example:

```javascript
test("My new test case", async () => {
  const input = `<my-element attr1="value1" attr2="value2"></my-element>`;
  const output = await format(input);
  expect(output).toMatchInlineSnapshot(); // Empty - Jest will fill this in
});
```

## Testing Different Parsers

The `format()` function accepts an options object as its second parameter. You can specify different parsers to test formatting for different file types:

```javascript
// For HTML (default)
const output = await format(input);

// For JSX
const output = await format(input, { parser: "babel" });

// For Vue
const output = await format(input, { parser: "vue" });

// For Angular
const output = await format(input, { parser: "angular" });
```

## Troubleshooting Tests

If tests are failing:

1. Check that your snapshots match the expected output
2. Verify that the plugin is correctly handling the specific edge case
3. Inspect the raw output by adding `console.log(output)` before the expect statement
4. To update snapshots after intentional changes, run `npm test -- -u`
