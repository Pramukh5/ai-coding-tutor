import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin access
);

// 1. Load the embedding model
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

// 2. Fetch all lessons
async function getLessons() {
  const { data: lessons, error } = await supabase.from('lessons').select('id, title, description');
  if (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
  return lessons;
}

// 3. Generate and store embeddings
async function generateEmbeddings() {
  // Test read permissions first
  const { data: testData, error: testError } = await supabase.from('lesson_sections').select('id').limit(1);
  if (testError) {
    console.error('Error reading from lesson_sections:', JSON.stringify(testError, null, 2));
    return; // Stop execution if we can't even read
  }
  console.log('Successfully connected and read from lesson_sections table.');

  const lessons = await getLessons();
  console.log(`Found ${lessons.length} lessons to process.`);

  for (const lesson of lessons) {
    // Simple content chunking: combine title and description
    // For more complex documents, you might split the content into smaller paragraphs.
    const content = `${lesson.title}: ${lesson.description}`;

    console.log(`Generating embedding for lesson: ${lesson.title}`);

    // Generate the embedding
    const output = await embedder(content, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);

    // Store in the database
    const { error } = await supabase.from('lesson_sections').insert({
      lesson_id: lesson.id,
      content: content,
      embedding: embedding,
    });

    if (error) {
      console.error(`Error inserting embedding for lesson ${lesson.id}:`, JSON.stringify(error, null, 2));
    } else {
      console.log(`Successfully embedded lesson: ${lesson.title}`);
    }
  }

  console.log('\nEmbedding process complete!');
}

generateEmbeddings();
