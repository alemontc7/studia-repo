import Image from '@tiptap/extension-image'

export const FloatImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      float: {
        default: null,
        parseHTML: element => element.style.float || null,
        renderHTML: attrs => {
          if (!attrs.float) return {}
          return {
            style: `
              float: ${attrs.float};
              margin: 0.5rem;
              max-width: 50%;      /* or whatever limit you like */
            `,
          }
        },
      },
      width: {
        default: null,
        parseHTML: el => el.getAttribute('width'),
        renderHTML: attrs => attrs.width ? { width: attrs.width } : {},
      },
      height: {
        default: null,
        parseHTML: el => el.getAttribute('height'),
        renderHTML: attrs => attrs.height ? { height: attrs.height } : {},
      },
      style: {
        default: this.options.HTMLAttributes?.style || null,
        parseHTML: el => el.getAttribute('style'),
        renderHTML: attrs => attrs.style ? { style: attrs.style } : {},
      },
    }
  },
})