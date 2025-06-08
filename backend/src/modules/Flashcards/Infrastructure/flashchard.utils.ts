interface TipTapDocument {
    type: 'doc';
    content?: TipTapNode[];
}

interface TipTapNode {
    type: string;
    attrs?: Record<string, any>;
    content?: TipTapNode[];
    text?: string;
    marks?: TipTapMark[];
}

interface TipTapMark {
    type: string;
    attrs?: Record<string, any>;
}

interface HeadingAttrs {
    level: number;
}

interface CodeBlockAttrs {
    language?: string;
}

function convertTipTapToText(jsonDoc: TipTapDocument): string {
    if (!jsonDoc || !jsonDoc.content) {
        return '';
    }
    
    return processContent(jsonDoc.content);
}

function processContent(content: TipTapNode[]): string {
    if (!Array.isArray(content)) {
        return '';
    }
    
    return content.map(node => processNode(node)).join('');
}

function processNode(node: TipTapNode): string {
    if (!node) return '';
    
    switch (node.type) {
        case 'heading':
            const level = (node.attrs as HeadingAttrs)?.level || 1;
            const headingText = extractText(node.content || []);
            return '#'.repeat(level) + ' ' + headingText + '\n\n';
            
        case 'paragraph':
            const paragraphText = extractText(node.content || []);
            return paragraphText + '\n\n';
            
        case 'bulletList':
            return processList(node.content || [], '- ') + '\n';
            
        case 'listItem':
            const itemText = processContent(node.content || []);
            // Remove extra newlines from nested content
            return itemText.replace(/\n+$/, '\n');
            
        case 'codeBlock':
            const language = (node.attrs as CodeBlockAttrs)?.language || '';
            const codeText = extractText(node.content || []);
            return '```' + language + '\n' + codeText + '\n```\n\n';
            
        case 'text':
            return node.text || '';
            
        default:
            // For unknown node types, try to process their content
            if (node.content) {
                return processContent(node.content);
            }
            return '';
    }
}

function processList(listItems: TipTapNode[], prefix: string, indent: string = ''): string {
    if (!Array.isArray(listItems)) return '';
    
    return listItems.map(item => {
        if (item.type === 'listItem') {
            let result = indent + prefix;
            
            if (item.content) {
                // Process the content of the list item
                const itemContent = processContent(item.content);
                
                // Handle nested lists
                if (itemContent.includes('- ')) {
                    // Split into main content and nested list
                    const lines = itemContent.split('\n');
                    const mainContent = lines[0] || '';
                    const nestedContent = lines.slice(1).join('\n');
                    
                    result += mainContent + '\n';
                    if (nestedContent.trim()) {
                        // Add indentation to nested items
                        const nestedLines = nestedContent.split('\n');
                        const indentedNested = nestedLines
                            .map(line => line.trim() ? '  ' + line : line)
                            .join('\n');
                        result += indentedNested;
                    }
                } else {
                    result += itemContent.replace(/\n+$/, '');
                }
            }
            
            return result + '\n';
        }
        return '';
    }).join('');
}

function extractText(content: TipTapNode[]): string {
    if (!Array.isArray(content)) {
        return '';
    }
    
    return content.map(node => {
        if (node.type === 'text') {
            return node.text || '';
        } else if (node.content) {
            return extractText(node.content);
        }
        return '';
    }).join('');
}
export { convertTipTapToText, TipTapDocument, TipTapNode };