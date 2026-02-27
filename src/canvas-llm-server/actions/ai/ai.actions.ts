import { ServiceAction, Adapter } from 'tool-ms';
import { z } from 'zod';
import {
    AIChatInput,
    AIGenerateInput,
    AIExplainInput,
    AIReviewInput,
    AIRefactorInput,
    AICodeIssueOutput,
    AICodeChangeOutput,
} from '../../models/schemas';
import * as crypto from 'crypto';
import { AdapterPromptState } from 'tool-ms/dist/lib/Adapter';


// ── ai.chat ──────────────────────────────────────────
export const aiChatAction: ServiceAction = {
    name: 'ai.chat',
    version: 1,
    description: 'Send message to AI code assistant',
    domain: 'ai',
    tags: ['ai', 'chat'],
    rest: { method: 'POST', path: '/ai/chat' },
    auth: { required: true },
    input: AIChatInput,
    output: z.object({
        id: z.string(),
        message: z.string(),
        suggestions: z.array(z.record(z.unknown())).optional().nullable(),
        tokens: z.object({ prompt: z.number(), completion: z.number() }),
    }),
    handler: async (ctx) => {
        const params = ctx.params as z.infer<typeof AIChatInput>;


        const aiAdapter = new Adapter.Adapter(ctx.serviceManager);

        const actions = await ctx.serviceManager.getAll();

        const state: AdapterPromptState = {
            messages: params.messages,
            model: "claude-3-haiku-20240307",
            actions: actions,
        };

        const result = await aiAdapter.prompt(state);
        console.log(result);


        // Placeholder — integrate with OpenAI/Anthropic SDK
        return {
            id: crypto.randomUUID(),
            message: result.message.content,
            suggestions: [],
            tokens: { prompt: 0, completion: 0 },
        };
    },
};

// ── ai.generateCode ──────────────────────────────────
export const aiGenerateCodeAction: ServiceAction = {
    name: 'ai.generateCode',
    version: 1,
    description: 'Generate code from description',
    domain: 'ai',
    tags: ['ai', 'generate'],
    rest: { method: 'POST', path: '/ai/codeGenerate' },
    auth: { required: true },
    input: AIGenerateInput,
    output: z.object({
        code: z.string(),
        language: z.string(),
        explanation: z.string().optional().nullable(),
        preview: z.boolean().optional().nullable(),
    }),
    handler: async (ctx) => {
        const { prompt, language } = ctx.params as z.infer<typeof AIGenerateInput>;
        return {
            code: `// Generated from prompt: ${prompt}\n// TODO: Implement AI code generation`,
            language: language ?? 'typescript',
            explanation: 'AI provider not configured.',
            preview: true,
        };
    },
};

// ── ai.explainCode ───────────────────────────────────
export const aiExplainCodeAction: ServiceAction = {
    name: 'ai.explainCode',
    version: 1,
    description: 'Explain selected code',
    domain: 'ai',
    tags: ['ai', 'explain'],
    rest: { method: 'POST', path: '/ai/codeExplain' },
    auth: { required: true },
    input: AIExplainInput,
    output: z.object({
        explanation: z.string(),
        summary: z.string(),
        complexity: z.object({ time: z.string(), space: z.string() }).optional().nullable(),
    }),
    handler: async (ctx) => {
        return {
            explanation: 'AI explanation pending. Configure your AI provider.',
            summary: 'Code explanation stub',
        };
    },
};

// ── ai.reviewCode ────────────────────────────────────
export const aiReviewCodeAction: ServiceAction = {
    name: 'ai.reviewCode',
    version: 1,
    description: 'Review code for issues',
    domain: 'ai',
    tags: ['ai', 'review'],
    rest: { method: 'POST', path: '/ai/codeReview' },
    auth: { required: true },
    input: AIReviewInput,
    output: z.object({
        issues: z.array(AICodeIssueOutput),
        summary: z.string(),
        score: z.number().optional().nullable(),
    }),
    handler: async (ctx) => {
        return {
            issues: [],
            summary: 'AI review pending. Configure your AI provider.',
            score: 100,
        };
    },
};

// ── ai.refactor ──────────────────────────────────────
export const aiRefactorAction: ServiceAction = {
    name: 'ai.refactor',
    version: 1,
    description: 'Refactor code',
    domain: 'ai',
    tags: ['ai', 'refactor'],
    rest: { method: 'POST', path: '/ai/codeRefactor' },
    auth: { required: true },
    input: AIRefactorInput,
    output: z.object({
        refactored: z.string(),
        changes: z.array(AICodeChangeOutput),
        explanation: z.string().optional().nullable(),
    }),
    handler: async (ctx) => {
        const { code } = ctx.params as z.infer<typeof AIRefactorInput>;
        return {
            refactored: code,
            changes: [],
            explanation: 'AI refactoring pending. Configure your AI provider.',
        };
    },
};

export default [
    aiChatAction,
    aiGenerateCodeAction,
    aiExplainCodeAction,
    aiReviewCodeAction,
    aiRefactorAction,
];
