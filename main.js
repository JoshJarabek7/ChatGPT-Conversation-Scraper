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
  // Get all message containers
  const messageGroups = document.querySelectorAll(
    '[data-testid^="conversation-turn-"]',
  );
  let conversationText = "";

  for (const group of messageGroups) {
    // Determine if it's the user or assistant message
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

  // Create and trigger download
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
