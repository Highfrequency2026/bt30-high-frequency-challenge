import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const GITHUB_DATASET_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json';
const GITHUB_BASE = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/';
const SOURCE_NAME = 'hasaneyldrm/exercises-dataset';

function mapExercise(raw: any) {
  return {
    source_id: String(raw.id),
    name: raw.name || '',
    category: raw.category || '',
    body_part: raw.body_part || '',
    equipment: raw.equipment || '',
    target: raw.target || '',
    muscle_group: raw.muscle_group || '',
    secondary_muscles: raw.secondary_muscles || [],
    instructions_en: raw.instructions?.en || '',
    instruction_steps_en: raw.instruction_steps?.en || [],
    instructions_es: raw.instructions?.es || '',
    instructions_fr: raw.instructions?.fr || '',
    image_url: raw.image ? GITHUB_BASE + raw.image : '',
    gif_url: raw.gif_url ? GITHUB_BASE + raw.gif_url : '',
    media_id: raw.media_id || '',
    attribution: raw.attribution || '',
    source_created_at: raw.created_at || '',
    source_name: SOURCE_NAME,
    is_active: true,
    is_featured: false,
  };
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

    const body = await req.json();
    const { action } = body;

    if (action === 'fetch') {
      const response = await fetch(GITHUB_DATASET_URL);
      if (!response.ok) throw new Error(`Failed to fetch dataset: ${response.status}`);
      const data = await response.json();
      return Response.json({ total: data.length, exercises: data });
    }

    if (action === 'import') {
      const { batch } = body;
      if (!Array.isArray(batch)) return Response.json({ error: 'batch must be an array' }, { status: 400 });

      const mapped = batch.map(mapExercise);
      const sourceIds = mapped.map((m: any) => m.source_id);

      // Check for existing source_ids to skip duplicates
      const existing = await base44.entities.Exercise.filter(
        { source_id: { $in: sourceIds } },
        '-created_date',
        100
      );
      const existingIds = new Set(existing.map((e: any) => e.source_id));

      const toCreate = mapped.filter((m: any) => !existingIds.has(m.source_id));
      const skipped = mapped.length - toCreate.length;

      let imported = 0;
      let errors = 0;

      if (toCreate.length > 0) {
        try {
          await base44.entities.Exercise.bulkCreate(toCreate);
          imported = toCreate.length;
        } catch (err: any) {
          console.error('Bulk create failed:', err.message);
          errors = toCreate.length;
        }
      }

      return Response.json({ imported, skipped, errors });
    }

    if (action === 'clear') {
      const result = await base44.entities.Exercise.deleteMany({});
      return Response.json({ deleted: result?.deleted_count || result?.count || 'all' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Import exercises error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}