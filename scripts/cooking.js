// cooking.js - Simplified Essential Version
document.getElementById("submit-button").addEventListener("click", generateMealPlan);

async function generateMealPlan() {
    const mealList = document.getElementById("meal-list");
    mealList.innerHTML = '<p style="color:#8bc2ef;">Creating your meal plan... Please wait</p>';

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
        const response = await fetch('http://localhost:3000/api/generate-meal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        displayMealPlan(data.result);
    } catch (error) {
        mealList.innerHTML = '<p style="color:#ff6b6b;">Failed to generate. Please try again.</p>';
    }
}

function displayMealPlan(text) {
    const mealList = document.getElementById("meal-list");
    mealList.innerHTML = `
        <div style="background:white; padding:15px; border-radius:10px;">
            ${text.replace(/\n/g, '<br>')}
        </div>
    `;
}