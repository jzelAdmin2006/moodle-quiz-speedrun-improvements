// ==UserScript==
// @name         Moodle Quiz Speedrun Shortcuts (Enter = Next, only if complete)
// @match        */moodle/mod/quiz*
// @grant        none
// ==/UserScript==

(function () {
  console.log("✅ Moodle Quiz Speedrun Shortcuts active (Enter)");

  document.addEventListener("keydown", function (e) {
    const tag = e.target.tagName.toLowerCase();
    if ((tag === "input" && e.target.type === "text") || tag === "textarea" || e.isComposing) return;

    if (e.key === "Enter") {
      console.log("🎯 Enter key detected");

      if (!allQuestionsAnswered()) {
        console.log("⛔ Some questions are still unanswered. Navigation cancelled.");
        return;
      }

      const nextBtn = document.querySelector('#mod_quiz-next-nav');
      if (nextBtn) {
        console.log("➡️ Clicking 'Next page' button...");
        nextBtn.click();
        return;
      }

      const saveBtn = document.querySelector('button[data-action="save"]');
      if (saveBtn) {
        console.log("💾 Clicking 'Save' button...");
        saveBtn.click();
        return;
      }

      const submitBtn = Array.from(document.querySelectorAll('button[type="submit"].btn-primary'))
        .find(btn => btn.textContent.trim().toLowerCase() === "abgeben");
      if (submitBtn) {
        console.log("📤 Clicking 'Submit' button...");
        submitBtn.click();
        return;
      }

      console.log("⚠️ No suitable button found.");
    }
  });

  function allQuestionsAnswered() {
    const questionElements = document.querySelectorAll('.que');

    for (const question of questionElements) {
      // Dropdowns (e.g. cloze or matching)
      const selects = question.querySelectorAll('select');
      if (selects.length > 0) {
        const allSelected = Array.from(selects).every(sel => sel.value && sel.value !== "0");
        if (!allSelected) return false;
        continue;
      }

      // Multiple choice (checkbox)
      const checkboxes = question.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length > 0) {
        const anyChecked = Array.from(checkboxes).some(c => c.checked);
        if (!anyChecked) return false;
        continue;
      }

      // Single choice (radio in .answer block)
      const answerDiv = question.querySelector('.answer');
      if (answerDiv) {
        const radios = answerDiv.querySelectorAll('input[type="radio"]');
        if (radios.length > 0) {
          const anyRadioChecked = Array.from(radios).some(r => r.checked);
          if (!anyRadioChecked) return false;
          continue;
        }
      }

      // Yes/No (e.g. kprim table): multiple radio groups in one question
      const allRadios = question.querySelectorAll('input[type="radio"]');
      if (allRadios.length > 0) {
        const groupNames = new Set(Array.from(allRadios).map(r => r.name));
        for (const groupName of groupNames) {
          const groupRadios = question.querySelectorAll(`input[name="${groupName}"]`);
          const isGroupAnswered = Array.from(groupRadios).some(r => r.checked);
          if (!isGroupAnswered) {
            console.log(`❌ Unanswered radio group: ${groupName}`);
            return false;
          }
        }
        continue;
      }

      // No inputs found — likely informational block, ignore
    }

    return true;
  }
})();
