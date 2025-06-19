// cooking.js logic
document.getElementById("submit-button").addEventListener("click", generateMealPlan);

async function generateMealPlan() {
    const mealData = {
        diets: Array.from(document.querySelectorAll('input[name="diet"]:checked')).map(el => el.value),
        time: document.querySelector('input[name="cooking-time"]:checked')?.value,
        objectives: Array.from(document.querySelectorAll('input[name="objective"]:checked')).map(el => el.value),
        mealTypes: Array.from(document.querySelectorAll('input[name="meal-type"]:checked')).map(el => el.value)
    };

    // Format prompt for ChatGPT
    const prompt = `Suggest ${mealData.mealTypes.join(', ')} recipes with these requirements:
    - Diet: ${mealData.diets.join(', ') || 'No restrictions'}
    - Time: ${mealData.time}
    - Goals: ${mealData.objectives.join(', ')}
    
    For each meal provide:
    1. [Meal Name] - [Prep Time]
    2. Ingredients (bullet points)
    3. Instructions (numbered steps)
    4. Nutrition info (calories, macros)`;

    try {
        const response = await fetch('http://localhost:3000/api/generate-meal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        displayMealPlan(data.result);
    } catch (error) {
        document.body.insertAdjacentHTML('beforeend', 
            `<div class="error">⚠️ Error generating meal plan. Please try again.</div>`);
        console.error("API Error:", error);
    }
}

function displayMealPlan(text) {
    // Create a new window/tab with the meal plan
    const mealPlanWindow = window.open();
    mealPlanWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Your Custom Meal Plan</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                .meal { margin-bottom: 30px; }
                h2 { color: #ff6b9d; }
            </style>
        </head>
        <body>
            <h1>🍽️ Your Personalized Meal Plan</h1>
            <div>${text.replace(/\n/g, "<br>")}</div>
        </body>
        </html>
    `);
}