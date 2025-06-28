// gym.js - Updated version

async function generateWorkout() {
    const workoutPlanDiv = document.getElementById("workout-plan");
    const defaultMessage = document.getElementById("default-message");

    // Hide default message and show loading
    defaultMessage.style.display = 'none';
    workoutPlanDiv.innerHTML = '<p style="color:#ff8fab;">Creating your workout plan... Please wait</p>';

    // Scroll to the result H2
    const resultHeader = document.getElementById("result");
    if (resultHeader) {
        resultHeader.scrollIntoView({ behavior: "smooth" });
    }

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
        const response = await fetch('https://cutiegym.com/api/generate-workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        displayWorkoutPlan(data.result);
    } catch (error) {
        defaultMessage.style.display = 'block'; // Show default message again
        workoutPlanDiv.innerHTML = '<p style="color:#ff6b6b;">⚠️ Error generating workout. Please try again later.</p>';
        console.error("API Error:", error);
    }
}

function displayWorkoutPlan(text) {
    const workoutPlanDiv = document.getElementById("workout-plan");
    workoutPlanDiv.innerHTML = `
        <div style="background:white; padding:15px; border-radius:10px;">
            ${marked(text)}
        </div>
    `;
}

// Initialize muscle group toggles
document.querySelectorAll('input[name="workout-type"]').forEach(input => {
    input.addEventListener('change', function () {
        const muscleGroup = document.getElementById(`${this.value}-muscle-group`);
        if (muscleGroup) {
            muscleGroup.style.display = this.checked ? 'block' : 'none';
        }
    });
});
