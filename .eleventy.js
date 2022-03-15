const htmlmin = require("html-minifier");
const { pluginPrismic } = require("eleventy-plugin-prismic");

module.exports = (eleventyConfig) => {
  // Fix hot reloading issue
  // From: https://github.com/BrowserSync/browser-sync/issues/955
  eleventyConfig.setBrowserSyncConfig({
    stream: true,
    port: 3000,
  });

  // Prismic
  eleventyConfig.addPlugin(pluginPrismic, {
    endpoint: "",
  });

  // Html
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      outputPath &&
      outputPath.endsWith(".html") &&
      process.env.NODE_ENV === "production"
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
      });
      return minified;
    }
    return content;
  });

  // Fonts & images
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "./" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "./" });

  return {
    dir: {
      input: "src",
    },
  };
};
