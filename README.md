# ChatGPT Conversation Exporter

A JavaScript script that lets you export your ChatGPT conversations to Markdown format. This script captures both your messages and ChatGPT's responses, preserving the conversation flow and basic formatting.

## Features

The script maintains several key formatting elements from your ChatGPT conversations:

- Distinguishes between user messages and ChatGPT responses
- Preserves code blocks with language-specific syntax highlighting
- Maintains basic text formatting (bold, italic)
- Handles paragraph breaks appropriately
- Removes unnecessary UI elements and clutter

Note: The script currently does not support exporting images or other media content from the conversation.

## How to Use

1. Open your ChatGPT conversation in your web browser
2. Open the browser's Developer Console:
   - Chrome/Edge: Press F12 or right-click and select "Inspect" then click "Console"
   - Firefox: Press F12 or right-click and select "Inspect" then click "Console"
   - Safari: Enable the Develop menu in Preferences > Advanced, then select Show Web Inspector
3. Copy the entire script below:

````javascript
function cleanHtml(html) {
  return html
    .replace(/<p>/g, "\n\n")
    .replace(/<\/p>/g, "")
    .replace(/<b>/g, "**")
    .replace(/<\/b>/g, "**")
    .replace(/<i>/g, "_")
    .replace(/<\/i>/g, "_")
    .replace(/<code[^>]*>/g, (match) => {
      const languageMatch = match.match(/class="[^"]*language-([^"]*)"/);
      return languageMatch ? "\n```" + languageMatch[1] + "\n" : "```";
    })
    .replace(/<\/code[^>]*>/g, "```")
    .replace(/<pre>/g, "")
    .replace(/<\/pre>/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/Copy code/g, "")
    .replace(
      /This content may violate our content policy\. If you believe this to be in error, please submit your feedback — your input will aid our research in this area\./g,
      "",
    )
    .trim();
}

(() => {
  const messageGroups = document.querySelectorAll(
    '[data-testid^="conversation-turn-"]',
  );
  let conversationText = "";

  for (const group of messageGroups) {
    const isAssistant = group.querySelector(
      '[data-message-author-role="assistant"]',
    );
    const messageContent =
      group.querySelector(".prose") ||
      group.querySelector(".whitespace-pre-wrap");

    if (messageContent) {
      const role = isAssistant ? "Assistant" : "Human";
      const cleanedContent = cleanHtml(messageContent.innerHTML);

      if (cleanedContent.trim()) {
        conversationText += `**${role}**: ${cleanedContent}\n\n`;
      }
    }
  }

  const downloadLink = document.createElement("a");
  downloadLink.download = "ChatGPT Conversation.md";
  downloadLink.href = URL.createObjectURL(
    new Blob([conversationText], { type: "text/markdown" }),
  );
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
})();
````

4. Paste the script into the console and press Enter
5. The conversation will automatically download as a Markdown file

## Output Format

The exported conversation will be saved as a Markdown file with the following format:

```markdown
**Human**: Your message here

**Assistant**: ChatGPT's response here

**Human**: Your next message

**Assistant**: ChatGPT's next response
```

## Limitations

- Does not export images or other media content
- May not preserve some complex formatting
- Requires browser console access
- Only works with the web version of ChatGPT
- May need updates if ChatGPT's HTML structure changes

## Contributing

Feel free to submit issues and enhancement requests! If ChatGPT's interface changes and the script stops working, please let me know by creating an issue.

## License

MIT License - feel free to modify and use this script as you like!
