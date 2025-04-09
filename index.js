/**
 * Prettier plugin: singleAttributePerLineExceptFirst
 *
 * This plugin is similar to the built-in singleAttributePerLine option, but keeps the
 * first attribute on the same line as its tag.
 */

// Try to safely get the required parsers and printers
function safeRequire(module) {
  try {
    return require(module);
  } catch (e) {
    // Return empty objects as fallbacks
    return { parsers: {}, printers: { estree: {}, html: {} } };
  }
}

// Get parsers and printers with fallbacks
const htmlParser = safeRequire("prettier/parser-html");
const angularParser = safeRequire("prettier/parser-angular");
const babelParser = safeRequire("prettier/parser-babel");
const typescriptParser = safeRequire("prettier/parser-typescript");
const flowParser = safeRequire("prettier/parser-flow");

// Get printers
const htmlPrinter = htmlParser.printers?.html || {};
const estreePrinter =
  babelParser.printers?.estree ||
  typescriptParser.printers?.estree ||
  flowParser.printers?.estree ||
  {};

// Get the doc API from prettier
let docApi;
try {
  docApi = require("prettier").doc;
} catch (e) {
  try {
    docApi = require("prettier/doc");
  } catch (e) {
    // Fallback for older versions
    docApi = {
      printer: {
        hardline: "",
        group: (x) => x,
        indent: (x) => x,
        line: "",
        softline: "",
      },
    };
  }
}

const { hardline, group, indent, line, softline } = docApi.printer;

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

  // This is needed for Prettier v3 to properly register the plugin options
  defaultOptions: {
    singleAttributePerLineExceptFirst: false,
  },

  // Define parsers
  parsers: {
    html: htmlParser.parsers?.html
      ? {
          ...htmlParser.parsers.html,
          preprocess: (text, options) => text,
          // Tell Prettier this parser supports the option
          hasSingleAttributePerLineExceptFirst: () => true,
        }
      : undefined,
    vue: htmlParser.parsers?.vue
      ? {
          ...htmlParser.parsers.vue,
          preprocess: (text, options) => text,
          // Tell Prettier this parser supports the option
          hasSingleAttributePerLineExceptFirst: () => true,
        }
      : undefined,
    angular: angularParser.parsers?.angular
      ? {
          ...angularParser.parsers.angular,
          preprocess: (text, options) => text,
          // Tell Prettier this parser supports the option
          hasSingleAttributePerLineExceptFirst: () => true,
        }
      : undefined,
    babel: babelParser.parsers?.babel
      ? {
          ...babelParser.parsers.babel,
          preprocess: (text, options) => text,
          // Tell Prettier this parser supports the option
          hasSingleAttributePerLineExceptFirst: () => true,
        }
      : undefined,
    "babel-flow": babelParser.parsers?.["babel-flow"]
      ? {
          ...babelParser.parsers["babel-flow"],
          preprocess: (text, options) => text,
          // Tell Prettier this parser supports the option
          hasSingleAttributePerLineExceptFirst: () => true,
        }
      : undefined,
    "babel-ts": babelParser.parsers?.["babel-ts"]
      ? {
          ...babelParser.parsers["babel-ts"],
          preprocess: (text, options) => text,
          // Tell Prettier this parser supports the option
          hasSingleAttributePerLineExceptFirst: () => true,
        }
      : undefined,
    typescript: typescriptParser.parsers?.typescript
      ? {
          ...typescriptParser.parsers.typescript,
          preprocess: (text, options) => text,
          // Tell Prettier this parser supports the option
          hasSingleAttributePerLineExceptFirst: () => true,
        }
      : undefined,
    flow: flowParser.parsers?.flow
      ? {
          ...flowParser.parsers.flow,
          preprocess: (text, options) => text,
          // Tell Prettier this parser supports the option
          hasSingleAttributePerLineExceptFirst: () => true,
        }
      : undefined,
  },

  // Printer override
  printers: {
    html: {
      ...htmlPrinter,
      print: function (path, options, print) {
        // Safety check for missing printer
        if (!htmlPrinter.print) {
          console.error("HTML printer not available");
          return "";
        }

        const node = path.getValue();

        // Only proceed if our option is enabled
        if (!options.singleAttributePerLineExceptFirst) {
          // Use the default printer
          return htmlPrinter.print(path, options, print);
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
            (attrPath) => htmlPrinter.print(attrPath, options, print),
            "attrs",
            0
          );

          // Calculate the position of the first attribute - this is tagName length + 1 space + 1 "<"
          const firstAttrStart = tagName.length + 2;

          // Format rest of attributes, each on its own line, aligned with the first attribute
          const restAttrsDoc = restAttrs.map((attr, i) => [
            hardline,
            " ".repeat(firstAttrStart), // Align with first attribute position
            path.call(
              (attrPath) => htmlPrinter.print(attrPath, options, print),
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
            node.selfClosing ? [hardline, "/>"] : [hardline, ">"],
            node.children && node.children.length > 0
              ? [indent([hardline, ...children]), hardline, "</", tagName, ">"]
              : ["</", tagName, ">"],
          ]);
        }

        // For all other cases, use the default printer
        return htmlPrinter.print(path, options, print);
      },
    },

    // Add overrides for JSX (only if estree printer is available)
    ...(Object.keys(estreePrinter).length > 0
      ? {
          babel: {
            ...estreePrinter,
            print: function (path, options, print) {
              // Safety check for missing printer
              if (!estreePrinter.print) {
                console.error("estree printer not available");
                return "";
              }

              const node = path.getValue();

              // Only proceed if our option is enabled
              if (!options.singleAttributePerLineExceptFirst) {
                // Use the default printer
                return estreePrinter.print(path, options, print);
              }

              // Handle JSX elements with props
              if (
                (node.type === "JSXElement" ||
                  node.type === "JSXOpeningElement") &&
                node.attributes &&
                node.attributes.length > 1
              ) {
                // Extract the name and attributes
                const name = path.call(print, "name");

                // Format first attribute
                const firstAttr = path.call(print, "attributes", 0);

                // Format rest of attributes, each on its own line, aligned with the first attribute
                const restAttrs = path
                  .map((attrPath, index) => {
                    if (index === 0) return null;
                    // Calculate indent - name length + 2 (for "< ")
                    const nameNode = path.getValue().name;
                    const nameLength = nameNode.name
                      ? nameNode.name.length
                      : nameNode.type === "JSXIdentifier"
                        ? nameNode.name.length
                        : 1;
                    return [
                      hardline,
                      " ".repeat(nameLength + 2),
                      print(attrPath),
                    ];
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
                    selfClosing ? [hardline, "/>"] : [hardline, ">"],
                    children.length > 0
                      ? [
                          indent([hardline, ...children]),
                          hardline,
                          "</",
                          name,
                          ">",
                        ]
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
                    selfClosing ? [hardline, "/>"] : [hardline, ">"],
                  ]);
                }
              }

              // For all other cases, use the default printer
              return estreePrinter.print(path, options, print);
            },
          },
        }
      : {}),
  },
};
