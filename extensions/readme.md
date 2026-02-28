# Specification: Modular Extension Architecture

## Overview

To ensure scalability, maintainability, and clean separation of concerns, complex extensions must be divided into distinct modules. This architecture prevents "fat controller" anti-patterns by decoupling state management, UI rendering, and business logic into separate files.

This specification follows a unidirectional data flow model, similar to the core `WorkspaceManager` implementation .

---

## Standard Directory Structure

A modular extension should follow a flat or shallowly nested directory structure containing three primary file types:

* `MyExtensionState.ts` (State Management)
* `MySidebarView.ts` / `MyLogView.ts` (UI Components)
* `index.ts` (Extension Entry Point & Controller)

---

## 1. State Management (`*State.ts`)

The State acts as the single source of truth for all views within the extension.

* 
**Define the Model:** Create an interface representing the exact shape of your data .


* 
**Encapsulate Data:** Maintain the state in a `private` variable.


* 
**Provide Immutable Access:** Expose a `getState()` method that returns a copy of the state.


* **Implement Pub/Sub:** Maintain a `Set` of listener callbacks. When the state updates via an `update()` method, iterate through the listeners and notify them with the new state .



```typescript
export interface ToolStateModel {
    isActive: boolean;
    data: string[];
}

export type StateListener = (state: ToolStateModel) => void;

export class ToolState {
    private state: ToolStateModel = { isActive: false, data: [] };
    private listeners: Set<StateListener> = new Set();

    public getState(): ToolStateModel { return { ...this.state }; }
    
    public addListener(callback: StateListener): () => void {
        this.listeners.add(callback);
        callback(this.getState());
        return () => this.listeners.delete(callback);
    }

    public update(partialState: Partial<ToolStateModel>): void {
        this.state = { ...this.state, ...partialState };
        this.listeners.forEach(cb => cb(this.getState()));
    }
}

```

---

## 2. View Components (`*View.ts`)

Views should be "dumb" components. They render UI based on the state they are given and bubble user interactions up via events.

* 
**Extend BaseComponent:** Extend the UI library's `BaseComponent` for automatic DOM lifecycle management.


* 
**Event Interfaces:** Define an `Events` interface (e.g., `ToolViewEvents`) that outlines user interactions (clicks, inputs) .


* 
**Pass Events via Constructor:** Accept these events in the constructor so the View does not need to know about the core IDE commands.


* 
**Implement an `update(state)` method:** Expose a public method that takes the `StateModel` and mutates the DOM elements (via `updateProps` or manual DOM manipulation) to reflect the new state.



```typescript
import { BaseComponent, Button, Stack } from '../../ui-lib';
import { ToolStateModel } from './ToolState';

export interface ToolViewEvents {
    onActionClicked: () => void;
}

export class ToolView extends BaseComponent {
    private events: ToolViewEvents;
    private actionBtn: Button;

    constructor(events: ToolViewEvents) {
        super('div');
        this.events = events;
        this.actionBtn = new Button({ 
            label: 'Run Action', 
            onClick: () => this.events.onActionClicked() 
        });
        this.appendChildren(new Stack({ children: [this.actionBtn] }));
    }

    public update(state: ToolStateModel): void {
        this.actionBtn.updateProps({ 
            label: state.isActive ? 'Running...' : 'Run Action' 
        });
    }
}

```

---

## 3. Extension Entry Point (`index.ts`)

The entry point acts as the Controller. It implements the `Extension` interface, instantiates the state and views, registers providers with the IDE, and contains the core business logic.

* 
**Implement the Extension Interface:** Define `id`, `name`, `version`, and the `activate(context: ExtensionContext)` method .


* 
**Instantiate State:** Create the centralized state instance.


* 
**Instantiate Views:** Create views and provide inline functions for their event hooks .


* 
**Bind State to Views:** Add a listener to the state that calls `.update(state)` on your view instances.


* 
**Register Providers:** Create `ViewProvider` objects mapping to `ViewLocation` slots (`'left-panel'`, `'bottom-panel'`, etc.) and register them using `context.ide.views.registerProvider`.


* **Mount Views Safely:** Inside `resolveView(container, disposables)`, call `view.mount(container)`. Ensure you push any global event cleanup functions to the `disposables` array .


* 
**Register Activity Bar Icons:** Use `context.ide.activityBar.registerItem` to link an icon to your registered ViewProvider ID.


* 
**Register Commands:** Encapsulate business logic in commands using `context.ide.commands.register`.



```typescript
import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';
import { ToolState } from './ToolState';
import { ToolView } from './ToolView';

export const MultiViewExtension: Extension = {
    id: 'my.multiview',
    name: 'Multi View Tool',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        const state = new ToolState();
        
        const sidebarView = new ToolView({
            onActionClicked: () => context.ide.commands.execute('tool.runAction')
        });

        state.addListener((currentState) => {
            sidebarView.update(currentState);
        });

        const provider: ViewProvider = {
            id: 'my.multiview.sidebar',
            name: 'Tool Explorer',
            resolveView: (container, disposables) => {
                sidebarView.mount(container);
                sidebarView.update(state.getState());
            }
        };

        context.ide.views.registerProvider('left-panel', provider);
        context.ide.activityBar.registerItem({
            id: provider.id,
            location: 'left-panel',
            icon: 'fas fa-wrench',
            title: 'Tool Explorer'
        });

        context.subscriptions.push(
            context.ide.commands.registerDisposable({
                id: 'tool.runAction',
                label: 'Run Tool Action',
                handler: async () => {
                    state.update({ isActive: true });
                    // ... perform logic ...
                    state.update({ isActive: false });
                }
            })
        );
    }
};
