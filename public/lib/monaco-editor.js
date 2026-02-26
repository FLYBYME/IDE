// This is a proxy module served to dynamically loaded extensions.
// In index.ts, we attach monaco-editor to window.__IDE_MONACO__.

const monaco = window.__IDE_MONACO__;
export default monaco;
export const {
    editor, languages, Uri, Position, Range, Token
} = monaco;
