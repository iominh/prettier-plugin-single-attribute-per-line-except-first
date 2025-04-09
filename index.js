/**
 * Prettier plugin: singleAttributePerLineExceptFirst
 *
 * This plugin is similar to the built-in singleAttributePerLine option, but keeps the
 * first attribute on the same line as its tag.
 */

// The printer is responsible for taking an AST and converting it back to a string
const { printer } = require("prettier/doc");
const { hardline, group, indent, line, softline } = printer;

// Plugin definition
module.exports = {
  // Define the plugin name
  name: "prettier-plugin-single-attribute-per-line-except-first",

  // Define the languages this plugin applies to
  languages: [
    {
      name: "html",
      parsers: ["html"],
    },
    {
      name: "vue",
      parsers: ["vue"],
    },
    {
      name: "angular",
      parsers: ["angular"],
    },
    {
      name: "jsx",
      parsers: ["babel", "babel-flow", "babel-ts", "typescript", "flow"],
    },
  ],

  // Define the options that this plugin exposes
  options: {
    singleAttributePerLineExceptFirst: {
      type: "boolean",
      category: "Global",
      default: false,
      description:
        "Put each attribute on its own line, except for the first attribute.",
    },
  },

  // Define parsers
  parsers: {
    html: {
      ...require("prettier/parser-html").parsers.html,
      preprocess: (text, options) => text,
    },
    vue: {
      ...require("prettier/parser-html").parsers.vue,
      preprocess: (text, options) => text,
    },
    angular: {
      ...require("prettier/parser-angular").parsers.angular,
      preprocess: (text, options) => text,
    },
    babel: {
      ...require("prettier/parser-babel").parsers.babel,
      preprocess: (text, options) => text,
    },
    "babel-flow": {
      ...require("prettier/parser-babel").parsers["babel-flow"],
      preprocess: (text, options) => text,
    },
    "babel-ts": {
      ...require("prettier/parser-babel").parsers["babel-ts"],
      preprocess: (text, options) => text,
    },
    typescript: {
      ...require("prettier/parser-typescript").parsers.typescript,
      preprocess: (text, options) => text,
    },
    flow: {
      ...require("prettier/parser-flow").parsers.flow,
      preprocess: (text, options) => text,
    },
  },

  // Printer override
  printers: {
    html: {
      ...require("prettier/parser-html").printers.html,
      print: function (path, options, print) {
        const node = path.getValue();

        // Only proceed if our option is enabled
        if (!options.singleAttributePerLineExceptFirst) {
          // Use the default printer
          return require("prettier/parser-html").printers.html.print(
            path,
            options,
            print
          );
        }

        // Handle HTML opening tags with attributes
        if (node.type === "element" && node.attrs && node.attrs.length > 1) {
          // Get the tag name
          const tagName = node.name;

          // Print attributes (first one on same line, rest on their own lines)
          const firstAttr = node.attrs[0];
          const restAttrs = node.attrs.slice(1);

          // Format first attribute
          const firstAttrDoc = path.call(
            (attrPath) =>
              require("prettier/parser-html").printers.html.print(
                attrPath,
                options,
                print
              ),
            "attrs",
            0
          );

          // Format rest of attributes, each on its own line
          const restAttrsDoc = restAttrs.map((attr, i) => [
            hardline,
            path.call(
              (attrPath) =>
                require("prettier/parser-html").printers.html.print(
                  attrPath,
                  options,
                  print
                ),
              "attrs",
              i + 1
            ),
          ]);

          // Format children
          const children = path.map(print, "children");

          // Return the formatted element
          return group([
            "<",
            tagName,
            " ",
            firstAttrDoc,
            ...restAttrsDoc,
            node.selfClosing ? [softline, "/>"] : [softline, ">"],
            node.children && node.children.length > 0
              ? [indent([hardline, ...children]), hardline, "</", tagName, ">"]
              : ["</", tagName, ">"],
          ]);
        }

        // For all other cases, use the default printer
        return require("prettier/parser-html").printers.html.print(
          path,
          options,
          print
        );
      },
    },

    // Add similar overrides for JSX
    babel: {
      ...require("prettier/parser-babel").printers.estree,
      print: function (path, options, print) {
        const node = path.getValue();

        // Only proceed if our option is enabled
        if (!options.singleAttributePerLineExceptFirst) {
          // Use the default printer
          return require("prettier/parser-babel").printers.estree.print(
            path,
            options,
            print
          );
        }

        // Handle JSX elements with props
        if (
          (node.type === "JSXElement" || node.type === "JSXOpeningElement") &&
          node.attributes &&
          node.attributes.length > 1
        ) {
          // Extract the name and attributes
          const name = path.call(print, "name");

          // Format first attribute
          const firstAttr = path.call(print, "attributes", 0);

          // Format rest of attributes, each on its own line
          const restAttrs = path
            .map((attrPath, index) => {
              if (index === 0) return null;
              return [hardline, print(attrPath)];
            }, "attributes")
            .filter(Boolean);

          // For JSXElement, also print children
          if (node.type === "JSXElement") {
            const children = path.map(print, "children");
            const selfClosing = node.selfClosing;

            return group([
              "<",
              name,
              " ",
              firstAttr,
              ...restAttrs,
              selfClosing ? [softline, "/>"] : [softline, ">"],
              children.length > 0
                ? [indent([hardline, ...children]), hardline, "</", name, ">"]
                : ["</", name, ">"],
            ]);
          } else {
            // For JSXOpeningElement
            const selfClosing = node.selfClosing;

            return group([
              "<",
              name,
              " ",
              firstAttr,
              ...restAttrs,
              selfClosing ? [softline, "/>"] : [softline, ">"],
            ]);
          }
        }

        // For all other cases, use the default printer
        return require("prettier/parser-babel").printers.estree.print(
          path,
          options,
          print
        );
      },
    },

    // Add similar overrides for the other parsers
    "babel-flow": {
      ...require("prettier/parser-babel").printers.estree,
    },
    "babel-ts": {
      ...require("prettier/parser-babel").printers.estree,
    },
    typescript: {
      ...require("prettier/parser-typescript").printers.estree,
    },
    flow: {
      ...require("prettier/parser-flow").printers.estree,
    },
  },
};
