import BaseResize from 'tiptap-extension-resize-image'


function injectGlobalStyles() {
    if (typeof document === 'undefined' || document.getElementById('tiptap-image-styles')) {
      return
    }
    const style = document.createElement('style')
    style.id = 'tiptap-image-styles'
    style.innerHTML = `
      /* Hide the top‐bar alignment icons */
      .ProseMirror-selectednode div[style*="translate(-50%, -50%)"] {
        display: none !important;
      }
  
      /* Replace the default dashed border with our own dashed outline */
      .ProseMirror-selectednode > div {
        border: none !important;
        outline: 2px dashed #3B82F6 !important;
        border-radius: .375rem !important;
      }
  
      /* Add vertical breathing room around the image wrapper */
      .ProseMirror-selectednode,
      .ProseMirror img {
        margin-block: 1rem;
        display: block;
      }
    `
    document.head.appendChild(style)
  }

export const CustomImageResize = BaseResize.extend({
  addAttributes() {
    const attrs: { style?: { default?: string } } = this.parent?.() || {}
    if (attrs.style && attrs.style.default) {
      attrs.style.default = `cursor: pointer; margin-block: 10rem 1rem 1rem 1rem;`.trim()
    }

    return attrs
  },
  addNodeView() {
    const createNodeView = this.parent?.() as any

    return (props: any) => {
      const nodeView = createNodeView(props)
      const wrapper: HTMLElement = nodeView.dom
      wrapper.setAttribute('draggable', 'true')
      return nodeView
    }
  },
})
