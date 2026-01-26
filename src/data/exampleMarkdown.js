/**
 * Example Markdown content to preload in the editor
 * Demonstrates all supported markdown features
 */
export const exampleMarkdown = `# Welcome to Markdown Previewer! 🎉

This is a **live Markdown previewer**. Start typing on the left to see the rendered output on the right!

---

## Features Supported

### Text Formatting

You can make text **bold**, *italic*, or ***both***! You can also use ~~strikethrough~~ text.

### Links

Visit [GitHub](https://github.com) or check out the [Markdown Guide](https://www.markdownguide.org).

### Lists

#### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered List
1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B

### Code

Inline code: \`const greeting = "Hello, World!";\`

Code block:

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### Blockquotes

> "The best way to predict the future is to invent it."
> 
> — Alan Kay

Nested blockquotes:

> Level 1
>> Level 2
>>> Level 3

### Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Line Breaks

This is the first line.  
This is the second line (with a line break).

This is a new paragraph.

---

## Tables (GFM)

| Feature | Supported |
|---------|-----------|
| Headings | ✅ |
| Bold/Italic | ✅ |
| Links | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Blockquotes | ✅ |
| Tables | ✅ |

---

## Images

![Placeholder Image](https://via.placeholder.com/400x200?text=Markdown+Previewer)

---

## Task Lists

- [x] Create the editor
- [x] Add live preview
- [x] Support dark mode
- [x] Add scroll sync
- [ ] More features coming!

---

Happy writing! ✍️
`;