/**
 * Minimal version of the plugin focusing only on HTML
 */
const { parsers } = require("prettier/parser-html");
const { builders } = require("prettier").doc;
const { group, indent, hardline } = builders;

// Only implement the HTML portion for maximum compatibility
module.exports = {
  name: "prettier-plugin-single-attribute-per-line-except-first",

  options: {
    singleAttributePerLineExceptFirst: {
      type: "boolean",
      category: "Global",
      default: false,
      description:
        "Put each attribute on its own line, except for the first attribute.",
    },
  },

  defaultOptions: {
    singleAttributePerLineExceptFirst: false,
  },

  parsers: {
    html: {
      ...parsers.html,
      preprocess: (text) => text,
    },
  },

  printers: {
    html: {
      print(path, options, print) {
        const node = path.getValue();

        // Only apply our formatting if the option is enabled
        if (!options.singleAttributePerLineExceptFirst) {
          return parsers.html.printer.print(path, options, print);
        }

        // Format elements with multiple attributes
        if (node.type === "element" && node.attrs && node.attrs.length > 1) {
          const tagName = node.name || "";
          const attrs = node.attrs || [];

          // Print the first attribute
          const firstAttr = path.call(print, "attrs", 0);

          // Calculate alignment for subsequent attributes
          const indent = tagName.length + 2; // "<tag " length

          // Print rest of attributes
          const restAttrs = attrs.slice(1).map((_, i) => {
            return [
              hardline,
              " ".repeat(indent),
              path.call(print, "attrs", i + 1),
            ];
          });

          // Print children, if any
          const children =
            node.children && node.children.length
              ? [indent([hardline, ...path.map(print, "children")]), hardline]
              : [];

          // Build the resulting doc
          return group([
            "<",
            tagName,
            " ",
            firstAttr,
            ...restAttrs,
            node.selfClosing
              ? [hardline, "/>"]
              : [
                  ">",
                  ...children,
                  children.length ? "" : hardline,
                  "</",
                  tagName,
                  ">",
                ],
          ]);
        }

        // For all other cases, use the default printer
        return parsers.html.printer.print(path, options, print);
      },
    },
  },
};
