import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const WORKOUT_SCHEMA = {
  type: "object",
  properties: {
    workout_title: { type: "string" },
    summary: { type: "string" },
    estimated_duration: { type: "string" },
    difficulty: { type: "string" },
    training_goal: { type: "string" },
    equipment_needed: { type: "array", items: { type: "string" } },
    warmup: { type: "string" },
    exercises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          target_muscles: { type: "array", items: { type: "string" } },
          sets: { type: "string" },
          reps: { type: "string" },
          rest_seconds: { type: "number" },
          tempo: { type: "string" },
          equipment: { type: "string" },
          instructions: { type: "array", items: { type: "string" } },
          form_tips: { type: "array", items: { type: "string" } },
          common_mistakes: { type: "array", items: { type: "string" } },
          easier_modification: { type: "string" },
          harder_progression: { type: "string" },
          video_url: { type: "string" },
          thumbnail_url: { type: "string" }
        },
        required: ["name", "target_muscles", "sets", "reps", "equipment", "instructions"]
      }
    },
    finisher: { type: "string" },
    cooldown: { type: "string" },
    trainer_notes: { type: "string" },
    safety_notes: { type: "string" }
  },
  required: ["workout_title", "summary", "exercises"]
};

const EXERCISE_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    target_muscles: { type: "array", items: { type: "string" } },
    sets: { type: "string" },
    reps: { type: "string" },
    rest_seconds: { type: "number" },
    tempo: { type: "string" },
    equipment: { type: "string" },
    instructions: { type: "array", items: { type: "string" } },
    form_tips: { type: "array", items: { type: "string" } },
    common_mistakes: { type: "array", items: { type: "string" } },
    easier_modification: { type: "string" },
    harder_progression: { type: "string" },
    video_url: { type: "string" },
    thumbnail_url: { type: "string" }
  },
  required: ["name", "target_muscles", "sets", "reps", "equipment", "instructions"]
};

function buildPrompt(mode, input) {
  const {
    fitness_goal, body_area, experience_level, equipment, workout_location,
    duration, days_per_week, injuries, exercise_preferences, exercises_to_avoid,
    custom_request, profile
  } = input;

  const profileContext = profile ? `
User Fitness Profile:
- Name: ${profile.first_name || 'N/A'}
- Age range: ${profile.age_range || 'N/A'}
- Height: ${profile.height || 'N/A'}
- Weight: ${profile.weight || 'N/A'}
- Primary goal: ${profile.primary_goal || 'N/A'}
- Experience: ${profile.experience_level || 'N/A'}
- Training location: ${profile.training_location || 'N/A'}
- Injuries/limitations: ${profile.injuries_limitations || 'None'}
- Favorite exercises: ${(profile.favorite_exercises || []).join(', ') || 'N/A'}
- Exercises to avoid: ${(profile.exercises_to_avoid || []).join(', ') || 'N/A'}
` : '';

  if (mode === 'find_exercise') {
    return `You are HF AI Trainer, an elite fitness coaching AI for the High Frequency brand.
Your task: Find 3-5 specific exercises that match the user's criteria.

User Request: ${custom_request || 'No custom request provided'}

Selection Criteria:
- Fitness goal: ${fitness_goal || 'general fitness'}
- Target body area: ${body_area || 'full body'}
- Experience level: ${experience_level || 'beginner'}
- Available equipment: ${(equipment || []).join(', ') || 'none specified'}
- Workout location: ${workout_location || 'any'}
- Injuries/limitations: ${injuries || 'none reported'}
- Exercise preferences: ${exercise_preferences || 'none specified'}
- Exercises to avoid: ${(exercises_to_avoid || []).join(', ') || 'none'}
${profileContext}

Return a structured workout with these exercises. Each exercise must include detailed instructions, form tips, common mistakes, an easier modification, and a harder progression. For video_url and thumbnail_url, leave as empty strings if no specific video is available.

SAFETY: Never diagnose medical conditions. If injuries are mentioned, provide modifications and note that the user should consult a healthcare professional. Include safety notes.`;
  }

  // build_workout mode
  return `You are HF AI Trainer, an elite fitness coaching AI for the High Frequency brand.
Your task: Build a complete, structured workout session tailored to the user's specifications.

${custom_request ? `User Custom Request: "${custom_request}"` : ''}

Workout Parameters:
- Fitness goal: ${fitness_goal || 'general fitness'}
- Target body area: ${body_area || 'full body'}
- Experience level: ${experience_level || 'beginner'}
- Available equipment: ${(equipment || []).join(', ') || 'none specified'}
- Workout location: ${workout_location || 'any'}
- Workout duration: ${duration || '30'} minutes
- Training days per week: ${days_per_week || '3'}
- Injuries/limitations: ${injuries || 'none reported'}
- Exercise preferences: ${exercise_preferences || 'none specified'}
- Exercises to avoid: ${(exercises_to_avoid || []).join(', ') || 'none'}
${profileContext}

Design a safe, effective workout that fits within the specified duration. Include a proper warmup, 4-8 exercises (appropriate for the duration), a finisher, and a cooldown. Each exercise must include detailed step-by-step instructions, form tips, common mistakes, an easier modification, and a harder progression. Match the difficulty to the user's experience level. Respect all injuries and limitations by providing appropriate modifications.

SAFETY: Never diagnose medical conditions. If injuries are mentioned, provide modifications and note that the user should consult a healthcare professional. Include safety notes at the end.

For video_url and thumbnail_url fields, leave as empty strings unless you have a specific, real URL.`;
}

function buildReplacePrompt(input) {
  const { original_exercise, profile, workout_context, equipment, injuries, experience_level, exercises_to_avoid } = input;

  return `You are HF AI Trainer. The user wants to replace an exercise in their workout with a different one.

Original exercise to replace:
- Name: ${original_exercise.name}
- Target muscles: ${(original_exercise.target_muscles || []).join(', ')}
- Equipment: ${original_exercise.equipment}
- Sets: ${original_exercise.sets}, Reps: ${original_exercise.reps}

Workout context (other exercises already in the workout):
${(workout_context || []).map((e, i) => `${i + 1}. ${e.name} (${(e.target_muscles || []).join(', ')})`).join('\n')}

User constraints:
- Available equipment: ${(equipment || []).join(', ') || 'none specified'}
- Experience level: ${experience_level || 'beginner'}
- Injuries/limitations: ${injuries || 'none reported'}
- Exercises to avoid: ${(exercises_to_avoid || []).join(', ') || 'none'}
${profile ? `- User profile injuries: ${profile.injuries_limitations || 'none'}` : ''}

Requirements for the replacement exercise:
1. Train the SAME primary muscle group as the original exercise
2. Use only the available equipment
3. Respect any injuries or movement limitations
4. Match the user's experience level
5. Do NOT repeat any exercise already in the workout
6. Include full details: instructions, form tips, common mistakes, easier modification, harder progression

Return a single replacement exercise with all fields filled out.`;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { mode, input } = body;

    if (!mode || !['find_exercise', 'build_workout', 'replace_exercise'].includes(mode)) {
      return Response.json({ error: 'Invalid mode' }, { status: 400 });
    }

    let prompt, schema;

    if (mode === 'replace_exercise') {
      if (!input?.original_exercise) {
        return Response.json({ error: 'original_exercise is required for replace mode' }, { status: 400 });
      }
      prompt = buildReplacePrompt(input);
      schema = EXERCISE_SCHEMA;
    } else {
      prompt = buildPrompt(mode, input || {});
      schema = WORKOUT_SCHEMA;
    }

    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: schema,
      model: 'automatic'
    });

    // Save to history for build_workout and find_exercise modes
    if (mode !== 'replace_exercise') {
      try {
        const inputData = input || {};
        const requestSummary = inputData.custom_request || [
          inputData.fitness_goal,
          inputData.body_area,
          inputData.experience_level,
          inputData.duration ? `${inputData.duration} min` : null
        ].filter(Boolean).join(' • ');

        await base44.asServiceRole.entities.AIWorkoutHistory.create({
          workout_title: llmResponse.workout_title || 'AI Workout',
          summary: llmResponse.summary || '',
          estimated_duration: llmResponse.estimated_duration || '',
          difficulty: llmResponse.difficulty || '',
          training_goal: llmResponse.training_goal || '',
          mode,
          equipment_needed: llmResponse.equipment_needed || [],
          exercises: llmResponse.exercises || [],
          trainer_notes: llmResponse.trainer_notes || '',
          safety_notes: llmResponse.safety_notes || '',
          request_summary: requestSummary
        });
      } catch (historyErr) {
        console.error('Failed to save workout history:', historyErr.message);
      }
    }

    return Response.json(llmResponse);
  } catch (error) {
    console.error('HF AI Trainer error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}