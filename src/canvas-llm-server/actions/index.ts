import authActions from './auth/auth.actions';
import workspaceActions from './workspace/workspace.actions';
import filesActions from './files/files.actions';
import editorActions from './editor/editor.actions';
import settingsActions from './settings/settings.actions';
import aiActions from './ai/ai.actions';
import realtimeActions from './realtime/realtime.actions';
import metaActions from './meta/meta.actions';
import sourceControlActions from './source-control/source-control.actions';
import extensionActions from './extension/extension.actions';
import secretsActions from './secrets/secrets.actions';

export default [
    ...authActions,
    ...workspaceActions,
    ...filesActions,
    ...editorActions,
    ...settingsActions,
    ...aiActions,
    ...realtimeActions,
    ...metaActions,
    ...sourceControlActions,
    ...extensionActions,
    ...secretsActions,
];