// ==UserScript==
// @name         Moodle Quiz Speedrun Shortcuts: Next page and submit via [Enter]
// @match        */moodle/mod/quiz*
// @grant        none
// ==/UserScript==

(function () {
  console.log("✅ Moodle Quiz Speedrun Shortcuts active (Enter)");

  document.addEventListener("keydown", function (e) {
    const tag = e.target.tagName.toLowerCase();

    // Ignore Enter in text inputs or textareas
    if ((tag === "input" && e.target.type === "text") || tag === "textarea" || e.isComposing) return;

    if (e.key === "Enter") {
      console.log("🎯 Enter key detected");

      // 1. Click 'Next Page' button if present
      const nextBtn = document.querySelector('#mod_quiz-next-nav');
      if (nextBtn) {
        console.log("➡️ Clicking 'Next page' button...");
        nextBtn.click();
        return;
      }

      // 2. Click 'Save' button if available (preferred over full submit)
      const saveBtn = document.querySelector('button[data-action="save"]');
      if (saveBtn) {
        console.log("💾 Clicking 'Save' button (data-action='save')...");
        saveBtn.click();
        return;
      }

      // 3. Click full 'Submit' button (fallback)
      const submitBtn = Array.from(document.querySelectorAll('button[type="submit"].btn-primary'))
        .find(btn => btn.textContent.trim().toLowerCase() === "abgeben");
      if (submitBtn) {
        console.log("📤 Clicking 'Submit' button (type='submit')...");
        submitBtn.click();
        return;
      }

      console.log("⚠️ No matching button found.");
    }
  });
})();
