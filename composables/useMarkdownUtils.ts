// import markdown-it
import MarkdownIt from "markdown-it";

// import plugins
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItLinkAttributes from "markdown-it-link-attributes";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItContainer from "markdown-it-container";
import MarkdownItAttrs from "markdown-it-attrs";

export const useMarkdownUtils = () => {
  const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    linkify: true,
    typographer: true,
    breaks: true,
  });

  // use plugins
  md.use(MarkdownItAnchor);
  md.use(MarkdownItAttrs);
  md.use(MarkdownItLinkAttributes, {
    attrs: {
      target: "_blank",
      rel: "noopener",
    },
  });
  md.use(MarkdownItEmoji);
  md.use(MarkdownItContainer, "spoiler", {
    validate: function (params: string) {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },
    render: function (tokens: any, idx: any) {
      const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        // opening tag
        return (
          "<details><summary>" + md.utils.escapeHtml(m[1]) + "</summary>\n"
        );
      } else {
        // closing tag
        return "</details>\n";
      }
    },
  });

  function render(markdown: string): string {
    try {
      return md.render(markdown);
    } catch (e) {
      return "You have an error in your markdown syntax.";
    }
  }

  return {
    render,
  };
};
