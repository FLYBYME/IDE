// This is a proxy module served to dynamically loaded extensions.
// In index.ts, we attach React to window.__IDE_REACT__.

const React = window.__IDE_REACT__;
export default React;
export const {
    useState, useEffect, useContext, useReducer, useCallback,
    useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue
} = React;
