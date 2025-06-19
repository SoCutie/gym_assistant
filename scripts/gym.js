// gym.js logic
async function generateWorkout() {
    // Gather user inputs
    const workoutData = {
        workoutTypes: Array.from(document.querySelectorAll('input[name="workout-type"]:checked')).map(el => el.value),
        muscleGroups: Array.from(document.querySelectorAll('input[name="muscle-group"]:checked')).map(el => el.value),
        cardioOptions: Array.from(document.querySelectorAll('input[name="cardio-option"]:checked')).map(el => el.value),
        duration: document.querySelector('input[name="workout-duration"]:checked')?.value,
        intensity: document.querySelector('input[name="workout-intensity"]:checked')?.value,
        equipment: Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(el => el.value),
        notes: document.querySelector('input[name="additional-notes"]')?.value
    };

    // Format prompt for ChatGPT
    const prompt = `Create a detailed ${workoutData.duration}-minute workout plan for a ${workoutData.intensity} level trainee focusing on:
    - Primary targets: ${workoutData.workoutTypes.join(', ')}
    - Specific muscles: ${workoutData.muscleGroups.join(', ')}
    - Cardio: ${workoutData.cardioOptions.join(', ') || 'None'}
    - Equipment available: ${workoutData.equipment.join(', ')}
    ${workoutData.notes ? `\nAdditional notes: ${workoutData.notes}` : ''}
    
    Provide exercises in this format:
    1. [Exercise Name] - [Muscle] - [Sets]x[Reps] - [Rest]
    Include warm-up and cool-down.`;

    // Call backend API
    try {
        const response = await fetch('/api/generate-workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        document.getElementById("workout-plan").innerHTML = formatResponse(data.result);
    } catch (error) {
        document.getElementById("workout-plan").innerHTML = 
            "⚠️ Error generating workout. Please try again later.";
        console.error("API Error:", error);
    }
}

function formatResponse(text) {
    // Convert ChatGPT response to HTML
    return text.replace(/\n/g, "<br>")
               .replace(/\d+\. /g, "<strong>$&</strong>");
}

// Initialize muscle group toggles
document.querySelectorAll('input[name="workout-type"]').forEach(input => {
    input.addEventListener('change', function() {
        const muscleGroup = document.getElementById(`${this.value}-muscle-group`);
        if (muscleGroup) {
            muscleGroup.style.display = this.checked ? 'block' : 'none';
        }
    });
});