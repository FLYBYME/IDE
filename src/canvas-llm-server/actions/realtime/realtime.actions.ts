import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import { sseManager } from '../../core/sse-manager';

// ── realtime.broadcast ───────────────────────────────
export const broadcastAction: ServiceAction = {
    name: 'realtime.broadcast',
    version: 1,
    description: 'Broadcast a custom event to all SSE clients',
    domain: 'realtime',
    tags: ['realtime', 'broadcast', 'admin'],
    rest: { method: 'POST', path: '/realtime/broadcast', middleware: ['requireAuth'] },
    auth: { required: true, roles: ['admin'] },
    input: z.object({
        event: z.string().min(1),
        data: z.any().optional(),
    }),
    output: z.object({ success: z.boolean(), sentAt: z.string() }),
    handler: async (ctx) => {
        const { event, data } = ctx.params;
        sseManager.broadcast(event, data);
        return { success: true, sentAt: new Date().toISOString() };
    },
};

export default [
    broadcastAction,
];
