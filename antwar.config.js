const _ = require("lodash");
const path = require("path");
const moment = require("moment");
const rssPlugin = require("antwar-rss-plugin");
const generateAdjacent = require("./utils/generate-adjacent");
const clean = require("./utils/clean");

// TODO: fix page descriptions
// TODO: fix react extras + source links
// TODO: add source links to webpack book
module.exports = () => ({
  template: {
    file: path.resolve(__dirname, "templates/page.ejs")
  },
  output: "build",
  plugins: [
    rssPlugin({
      baseUrl: "https://survivejs.com/",
      sections: ["blog"],
      get: {
        content: page => page.file.body,
        date: page => moment(page.file.attributes.date).utcOffset(0).format(),
        title: page => page.file.attributes.title
      }
    })
  ],
  layout: () => require("./layouts/SiteBody").default,
  paths: {
    "/": {
      content: () => require.context("./pages", true, /^\.\/.*\.md$/),
      index: () => {
        const index = require("./layouts/SiteIndex").default;

        index.title = "SurviveJS";

        return index;
      },
      paths: {
        blog: {
          index: () => {
            const index = require("./layouts/BlogIndex").default;

            index.title = "Blog";

            return index;
          },
          layout: () => require("./layouts/BlogPage").default,
          transform: pages =>
            generateAdjacent(_.sortBy(pages, "date")).reverse(),
          url: ({ fileName }) => `/${clean.chapterName(fileName)}/`,
          redirects: require("./redirects/blog")
        }
      }
    },
    clinic: () =>
      require("./components/IndexPage").default({
        type: "Clinic",
        content: require("./layouts/clinic.md").body
      }),
    training: () =>
      require("./components/IndexPage").default({
        type: "Training",
        content: require("./layouts/training.md").body
      }),
    workshop: () =>
      require("./components/IndexPage").default({
        type: "Workshop",
        content: require("./layouts/workshop.md").body
      }),
    react: {
      content: () =>
        require.context("./books/react-book/manuscript", true, /^\.\/.*\.md$/),
      index: () => {
        const index = require("./layouts/BookIndex").default;

        index.title = "SurviveJS - React";

        return index;
      },
      layout: () => require("./layouts/BookPage").default,
      transform: pages =>
        generateAdjacent(
          require("./books/react-book/manuscript/Book.txt")
            .split("\n")
            .filter(name => path.extname(name) === ".md")
            .map(fileName => {
              const result = _.find(pages, { fileName });

              if (!result) {
                return console.error("Failed to find", fileName);
              }

              return result;
            })
        ),
      url: ({ sectionName, fileName }) =>
        `/${sectionName}/${clean.chapterName(fileName)}/`
    },
    webpack: {
      content: () =>
        require.context(
          "./books/webpack-book/manuscript",
          true,
          /^\.\/.*\.md$/
        ),
      index: () => {
        const index = require("./layouts/WebpackIndex").default;

        index.title = "SurviveJS - Webpack";

        return index;
      },
      layout: () => require("./layouts/BookPage").default,
      transform: pages =>
        generateAdjacent(
          require("./books/webpack-book/manuscript/Book.txt")
            .split("\n")
            .filter(name => path.extname(name) === ".md")
            .map(fileName => {
              const result = _.find(pages, { fileName });

              if (!result) {
                return console.error("Failed to find", fileName);
              }

              return result;
            })
        ),
      url: ({ sectionName, fileName }) =>
        `/${sectionName}/${clean.chapterName(fileName)}/`,
      redirects: require("./redirects/webpack")
    },
    webpack_react: {
      redirects: require("./redirects/webpack_react")
    }
  }
});
