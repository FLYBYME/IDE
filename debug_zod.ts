import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

console.log('Zod version:', z.version);

const test = (name: string, schema: any) => {
    try {
        console.log(`Testing ${name}...`);
        zodResponseFormat(schema, 'input');
        console.log(`  ✅ ${name} passed`);
    } catch (e) {
        console.log(`  ❌ ${name} failed: ${e.message}`);
    }
};

test('boolean.nullable().optional()', z.object({ f: z.boolean().nullable().optional() }));
test('boolean.optional().nullable()', z.object({ f: z.boolean().optional().nullable() }));
test('boolean.nullable()', z.object({ f: z.boolean().nullable() }));
test('boolean.optional()', z.object({ f: z.boolean().optional() }));
test('string.nullable().optional()', z.object({ f: z.string().nullable().optional() }));
test('string.optional().nullable()', z.object({ f: z.string().optional().nullable() }));
