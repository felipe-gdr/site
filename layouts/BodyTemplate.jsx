"use strict";
var React = require("react");

module.exports = React.createClass({
  displayName: "Body",
  render() {
    const head = this.props.head;
    const page = this.props.page;
    const section = this.props.section;
    const config = this.props.config;
    const language = config.language || "en";

    const description = page.description || config.description;
    const keywords = page.keywords || config.keywords;

    const titleGetter = this.props.getPageTitle || getPageTitle;
    const pageTitle = titleGetter(config, section.title, page.title, " - ");

    return (
      <html lang={language}>
        <head>
          <title>
            {pageTitle}
          </title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimal-ui"
          />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <link rel="icon" type="image/png" href="/assets/img/favicon.png" />

          {this.props.head ? this.props.head : null}

          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css"
          />

          {!__DEV__ ? <link rel="stylesheet" href="/assets/main.css" /> : null}
        </head>
        <body>
          <main role="main">
            {this.props.children}
          </main>
          {__DEV__ ? <script src="/main-bundle.js" /> : null}
        </body>
      </html>
    );
  }
});

function getPageTitle(config, sectionTitle, pageTitle, separator) {
  var title = pageTitle || sectionTitle || "";
  var siteTitle = config.title || "";

  return title || siteTitle;
}
