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
        document.getElementById("meal-list").innerHTML = formatResponse(data.result);
    } catch (error) {
        document.body.insertAdjacentHTML('beforeend', 
            `<div class="error">⚠️ Error generating meal plan. Please try again.</div>`);
        console.error("API Error:", error);
    }
}

function formatResponse(text) {
    // Convert ChatGPT response to HTML
    return text.replace(/\n/g, "<br>")
               .replace(/\d+\. /g, "<strong>$&</strong>");
    }