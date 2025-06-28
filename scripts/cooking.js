// cooking.js - Simplified Essential Version
async function generateMealPlan() {
    const mealPlanDiv = document.getElementById("meal-plan");
    const defaultMessage = document.getElementById("default-message");
    defaultMessage.style.display = 'none';
    mealPlanDiv.innerHTML = '<p style="color:#8bc2ef;">Creating your meal plan... Please wait</p>';

    // Scroll to the result H2
    const resultHeader = document.getElementById("result");
    if (resultHeader) {
        resultHeader.scrollIntoView({ behavior: "smooth" });
    }

    // Gather user inputs
    const mealData = {
        diets: Array.from(document.querySelectorAll('input[name="diet"]:checked')).map(el => el.value),
        time: document.querySelector('input[name="cooking-time"]:checked')?.value || "Any time",
        objectives: Array.from(document.querySelectorAll('input[name="objective"]:checked')).map(el => el.value),
        mealTypes: Array.from(document.querySelectorAll('input[name="meal-type"]:checked')).map(el => el.value),
        notes: document.querySelector('input[name="additional-notes"]')?.value
    };

    // Format prompt
    const prompt = `Create a meal plan with:
    - Diets: ${mealData.diets.join(', ') || 'No restrictions'}
    - Time: ${mealData.time}
    - Goals: ${mealData.objectives.join(', ')}
    - Meals: ${mealData.mealTypes.join(', ')}
    ${mealData.notes ? `Notes: ${mealData.notes}` : ''}
    
    Provide recipes with ingredients and instructions.`;

    try {
        const response = await fetch('https://cutiegym.com/api/generate-meal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        displayMealPlan(data.result);
    } catch (error) {
        mealPlanDiv.innerHTML = '<p style="color:#ff6b6b;">Failed to generate. Please try again.</p>';
    }
}

function displayMealPlan(text) {
    const mealPlanDiv = document.getElementById("meal-plan");
    const defaultMessage = document.getElementById("default-message");
    defaultMessage.style.display = 'none';
    mealPlanDiv.innerHTML = `
        <div style="background:white; padding:15px; border-radius:10px;">
            ${DOMPurify.sanitize(marked(text))}
        </div>
    `;
}
