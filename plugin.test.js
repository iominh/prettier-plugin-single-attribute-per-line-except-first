const prettier = require("prettier");
const path = require("path");

// Define the plugin path
const pluginPath = path.resolve(__dirname, "index.js");

// Helper function to format code with the plugin
async function format(code, options = {}) {
  return await prettier.format(code, {
    parser: "html",
    plugins: [pluginPath],
    singleAttributePerLineExceptFirst: true,
    ...options,
  });
}

describe("prettier-plugin-single-attribute-per-line-except-first", () => {
  test("Simple HTML element with multiple attributes", async () => {
    const input = `<div id="container" class="main-container" style="width: 100%" data-testid="test-container"></div>`;
    const output = await format(input);
    expect(output).toMatchInlineSnapshot(`
      "<div id="container"
           class="main-container"
           style="width: 100%"
           data-testid="test-container"></div>
      "
    `);
  });

  test("Nested HTML elements with multiple attributes", async () => {
    const input = `<div id="parent" class="parent-class"><span id="child" class="child-class" data-testid="child"></span></div>`;
    const output = await format(input);
    expect(output).toMatchInlineSnapshot(`
      "<div id="parent"
           class="parent-class">
        <span id="child"
              class="child-class"
              data-testid="child"></span>
      </div>
      "
    `);
  });

  test("Element with only one attribute", async () => {
    const input = `<div id="container"></div>`;
    const output = await format(input);
    expect(output).toMatchInlineSnapshot(`
      "<div id="container"></div>
      "
    `);
  });

  test("Self-closing element with multiple attributes", async () => {
    const input = `<img src="image.jpg" alt="Description" width="100" height="100" />`;
    const output = await format(input);
    expect(output).toMatchInlineSnapshot(`
      "<img src="image.jpg"
           alt="Description"
           width="100"
           height="100" />
      "
    `);
  });

  test("Element with extremely long tag name and attributes", async () => {
    const input = `<super-duper-long-custom-element id="long-id" class="long-class-name" style="width: 100%; height: 100vh;" data-custom-attribute="custom-value"></super-duper-long-custom-element>`;
    const output = await format(input);
    expect(output).toMatchInlineSnapshot(`
      "<super-duper-long-custom-element id="long-id"
                                        class="long-class-name"
                                        style="width: 100%; height: 100vh;"
                                        data-custom-attribute="custom-value"></super-duper-long-custom-element>
      "
    `);
  });

  test("Element with no attributes", async () => {
    const input = `<div></div>`;
    const output = await format(input);
    expect(output).toMatchInlineSnapshot(`
      "<div></div>
      "
    `);
  });

  test("Element with attributes containing expressions", async () => {
    const input = `<div id={id} className={isActive ? 'active' : 'inactive'} style={{color: 'red', margin: '10px'}} onClick={() => handleClick()}></div>`;
    const output = await format(input, { parser: "babel" });
    expect(output).toMatchInlineSnapshot(`
      "<div id={id}
           className={isActive ? "active" : "inactive"}
           style={{ color: "red", margin: "10px" }}
           onClick={() => handleClick()}></div>;
      "
    `);
  });

  test("Element with boolean and shorthand attributes", async () => {
    const input = `<button disabled type="submit" hidden onClick={handleClick}></button>`;
    const output = await format(input, { parser: "babel" });
    expect(output).toMatchInlineSnapshot(`
      "<button disabled
              type="submit"
              hidden
              onClick={handleClick}></button>;
      "
    `);
  });

  test("React component with many props", async () => {
    const input = `<CustomComponent
    prop1="value1"
    prop2={value2}
    prop3={true}
    prop4={() => doSomething()}
    prop5={[1, 2, 3]}
    prop6={{ key: 'value' }}
  >
    <ChildComponent />
  </CustomComponent>`;
    const output = await format(input, { parser: "babel" });
    expect(output).toMatchInlineSnapshot(`
      "<CustomComponent prop1="value1"
                       prop2={value2}
                       prop3={true}
                       prop4={() => doSomething()}
                       prop5={[1, 2, 3]}
                       prop6={{ key: "value" }}>
        <ChildComponent />
      </CustomComponent>;
      "
    `);
  });

  test("When option is disabled, should use default formatting", async () => {
    const input = `<div id="container" class="main-container" style="width: 100%" data-testid="test-container"></div>`;
    const output = await format(input, {
      singleAttributePerLineExceptFirst: false,
    });
    expect(output).toMatchInlineSnapshot(`
      "<div id="container" class="main-container" style="width: 100%" data-testid="test-container"></div>
      "
    `);
  });

  test("Element with attributes and children with mixed content", async () => {
    const input = `<div id="mixed" class="content">
      Some text
      <span>And a span</span>
      More text
    </div>`;
    const output = await format(input);
    expect(output).toMatchInlineSnapshot(`
      "<div id="mixed"
           class="content">
        Some text
        <span>And a span</span>
        More text
      </div>
      "
    `);
  });

  test("Vue-style template with directives", async () => {
    const input = `<template>
    <div v-if="isVisible" v-bind:class="{ 'active': isActive }" v-on:click="handleClick" :data-id="id">
      {{ message }}
    </div>
  </template>`;
    const output = await format(input, { parser: "vue" });
    expect(output).toMatchInlineSnapshot(`
      "<template>
        <div v-if="isVisible"
             v-bind:class="{ 'active': isActive }"
             v-on:click="handleClick"
             :data-id="id">
          {{ message }}
        </div>
      </template>
      "
    `);
  });
});
