/**
 * Minimal version of the plugin focusing only on HTML
 * Correctly implements singleAttributePerLineExceptFirst
 */
const { parsers } = require("prettier/parser-html");

// Get the doc API from prettier
const prettier = require("prettier");
const { builders } = prettier.doc;
const { group, indent, hardline, line } = builders;

// Helper function for debugging
const debug = (enabled) => (msg) => {
  if (enabled) console.log("[PLUGIN DEBUG]", msg);
};

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
      // Explicitly tell Prettier this parser supports our option
      getSupportInfo() {
        return {
          options: [
            {
              name: "singleAttributePerLineExceptFirst",
              type: "boolean",
              default: false,
              description:
                "Put each attribute on its own line, except for the first attribute.",
            },
          ],
        };
      },
    },
  },

  printers: {
    html: {
      print(path, opts, print) {
        const log = debug(false); // Set to true to enable debugging

        const node = path.getValue();

        // Only apply our formatting if the option is enabled
        if (!opts.singleAttributePerLineExceptFirst) {
          log("Option disabled, using standard printer");
          return parsers.html.printer.print(path, opts, print);
        }

        // Handle HTML opening tags with attributes
        if (node.type === "element" && node.attrs && node.attrs.length > 1) {
          log(`Found element with ${node.attrs.length} attributes`);

          // Get the tag name
          const tagName = node.name;
          log(`Tag name: ${tagName}`);

          // Print attributes (first one on same line, rest on their own lines)
          const firstAttr = node.attrs[0];
          const restAttrs = node.attrs.slice(1);

          // Format first attribute
          const firstAttrDoc = path.call(print, "attrs", 0);
          log(`First attribute formatted`);

          // Calculate the position of the first attribute - this is tagName length + 1 space + 1 "<"
          const firstAttrStart = tagName.length + 2;
          log(`Indent for subsequent attributes: ${firstAttrStart}`);

          // Format rest of attributes, each on its own line, aligned with the first attribute
          const restAttrsDoc = restAttrs.map((_, i) => {
            return [
              hardline,
              " ".repeat(firstAttrStart),
              path.call(print, "attrs", i + 1),
            ];
          });
          log(`Formatted ${restAttrsDoc.length} remaining attributes`);

          // Format children
          const childDocs = path.map(print, "children");
          log(`Formatted ${childDocs.length} children`);

          // Return the formatted element
          return group([
            "<",
            tagName,
            " ",
            firstAttrDoc,
            ...restAttrsDoc,
            node.selfClosing
              ? [hardline, "/>"]
              : [
                  hardline,
                  ">",
                  node.children && node.children.length > 0
                    ? [
                        indent([hardline, ...childDocs]),
                        hardline,
                        "</",
                        tagName,
                        ">",
                      ]
                    : ["</", tagName, ">"],
                ],
          ]);
        }

        // For all other nodes, use the default printer
        log("Using default printer for non-matching node");
        return parsers.html.printer.print(path, opts, print);
      },
    },
  },
};
