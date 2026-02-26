// This is a proxy module served to dynamically loaded extensions.
// In index.ts, we attach ReactDOM to window.__IDE_REACT_DOM__.

const ReactDOM = window.__IDE_REACT_DOM__;
export default ReactDOM;
export const {
    createPortal, flushSync
} = ReactDOM;
