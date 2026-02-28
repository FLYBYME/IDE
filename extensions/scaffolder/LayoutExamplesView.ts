import {
    BaseComponent,
    Stack,
    Row,
    Column,
    Divider,
    Spacer,
    ScrollArea,
    Collapsible,
    SplitView,
    DockingSystem,
    Heading,
    Text,
    Theme,
    Button,
    Modal,
    Popover,
    ConfirmDialog,
    PromptDialog,
    Toolbar,
    StatusBarItem,
    Badge,
    ProgressBar,
    Spinner,
    Tooltip,
    EmptyStateView,
    StepProgress,
    TextInput,
    TextArea,
    Checkbox,
    Select,
    Switch,
    RadioGroup,
    Slider,
    SearchInput,
    Pagination,
    ColorPicker,
    MultiSelectTagInput,
    PropertyGrid,
    TitleBar,
    Breadcrumb,
    Tab
} from 'ide-core';

export class LayoutExamplesView extends BaseComponent {
    constructor() {
        super('div');
        this.applyStyles({
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: Theme.colors.bgPrimary
        });
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';

        // --- Top Navigation Area ---
        const headerArea = new Stack({
            direction: 'column',
            gap: 'none',
            children: [
                new TitleBar('UI Component Gallery'),
                new Stack({
                    padding: 'sm',
                    children: [
                        new Breadcrumb({
                            items: [
                                { label: 'IDE Core', icon: 'fas fa-cube' },
                                { label: 'Library Showcase' },
                                { label: 'Components' }
                            ]
                        })
                    ]
                }),
                new Divider({ orientation: 'horizontal' })
            ]
        });

        // --- Main Scrollable Content ---
        const scrollArea = new ScrollArea({
            fill: true,
            padding: 'md',
            children: [
                new Stack({
                    direction: 'column',
                    gap: 'xl',
                    children: [
                        // --- Layout & Navigation Section ---
                        this.createSection('Layout & Navigation', [
                            new Collapsible({
                                title: 'Basic Layouts',
                                isOpen: true,
                                children: [
                                    new Stack({
                                        gap: 'lg',
                                        padding: 'sm',
                                        children: [
                                            this.createSubSection('Tabs & Spacing', [
                                                new Row({
                                                    gap: 'xs',
                                                    children: [
                                                        new Tab({ label: 'Editor.ts', icon: 'fab fa-ts', active: true, closable: true }),
                                                        new Tab({ label: 'styles.css', icon: 'fab fa-css3', active: false, closable: true }),
                                                        new Spacer(),
                                                        new Button({ icon: 'fas fa-ellipsis-h', variant: 'ghost', size: 'sm' })
                                                    ]
                                                })
                                            ]),

                                            this.createSubSection('SplitView (Horizontal)', [
                                                new Stack({
                                                    height: '150px',
                                                    children: [
                                                        new SplitView({
                                                            orientation: 'horizontal',
                                                            panes: [
                                                                this.createBox('File Explorer (20%)', Theme.colors.bgSecondary),
                                                                this.createBox('Code Editor (80%)', Theme.colors.bgTertiary)
                                                            ],
                                                            initialSizes: [20, 80]
                                                        })
                                                    ]
                                                })
                                            ]),

                                            this.createSubSection('Docking System', [
                                                new Stack({
                                                    height: '200px',
                                                    children: [
                                                        new DockingSystem({
                                                            layout: 'horizontal',
                                                            areas: [
                                                                {
                                                                    id: 'area-1',
                                                                    activeTabIndex: 0,
                                                                    tabs: [
                                                                        { label: 'Terminal', icon: 'fas fa-terminal', content: this.createBox('> npm run dev', Theme.colors.bgSecondary) },
                                                                        { label: 'Output', icon: 'fas fa-list', content: this.createBox('Build successful.', Theme.colors.bgTertiary) }
                                                                    ]
                                                                }
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ])
                                        ]
                                    })
                                ]
                            })
                        ]),

                        // --- Feedback & States Section ---
                        this.createSection('Feedback & States', [
                            this.createSubSection('Empty State', [
                                new EmptyStateView({
                                    icon: 'fas fa-search',
                                    title: 'No results found',
                                    description: 'Try adjusting your search queries or filters to find what you are looking for.',
                                    action: new Button({ label: 'Clear Filters', variant: 'primary' })
                                })
                            ]),

                            this.createSubSection('Progress & Loaders', [
                                new Row({
                                    gap: 'xl',
                                    align: 'center',
                                    children: [
                                        new Stack({
                                            gap: 'sm',
                                            width: '200px',
                                            children: [
                                                new Text({ text: 'Compiling...', variant: 'muted', size: 'xs' }),
                                                new ProgressBar({ progress: 42 })
                                            ]
                                        }),
                                        new Spinner({ size: 'md', variant: 'accent' }),
                                        new StepProgress({
                                            steps: [
                                                { label: 'Build' },
                                                { label: 'Test' },
                                                { label: 'Deploy' }
                                            ],
                                            currentStepIndex: 1
                                        })
                                    ]
                                })
                            ]),

                            this.createSubSection('Badges & Indicators', [
                                new Row({
                                    gap: 'md',
                                    children: [
                                        new Badge({ count: 5, variant: 'accent' }),
                                        new Badge({ count: 'NEW', variant: 'success' }),
                                        new Badge({ count: '!', variant: 'error' }),
                                        new Badge({ count: 99, variant: 'warning', size: 'md' })
                                    ]
                                })
                            ])
                        ]),

                        // --- Overlays & Interactions Section ---
                        this.createSection('Overlays & Interactions', [
                            this.createSubSection('Dialogs', [
                                new Row({
                                    gap: 'sm',
                                    children: [
                                        new Button({
                                            label: 'Show Modal',
                                            onClick: () => {
                                                const modal = new Modal({
                                                    title: 'Component Settings',
                                                    children: [
                                                        new Text({ text: 'Adjust the settings for this module.' }),
                                                        new Spacer(),
                                                        new Switch({ label: 'Enable preview features', checked: true })
                                                    ],
                                                    footer: [
                                                        new Button({ label: 'Cancel', variant: 'ghost', onClick: () => modal.hide() }),
                                                        new Button({ label: 'Save Changes', variant: 'primary', onClick: () => modal.hide() })
                                                    ]
                                                });
                                                modal.show();
                                            }
                                        }),
                                        new Button({
                                            label: 'Confirm Dialog',
                                            variant: 'danger',
                                            onClick: async () => {
                                                const confirmed = await ConfirmDialog.show({
                                                    title: 'Delete Repository',
                                                    message: 'Are you sure you want to delete this repository?',
                                                    detail: 'This action is irreversible.',
                                                    isDestructive: true,
                                                    primaryLabel: 'Delete'
                                                });
                                                console.log('Confirmed:', confirmed);
                                            }
                                        }),
                                        new Button({
                                            label: 'Prompt Input',
                                            variant: 'secondary',
                                            onClick: async () => {
                                                const result = await PromptDialog.show({
                                                    title: 'Rename File',
                                                    message: 'Enter the new file name:',
                                                    defaultValue: 'index.ts',
                                                    okLabel: 'Rename'
                                                });
                                                console.log('New name:', result);
                                            }
                                        })
                                    ]
                                })
                            ]),
                            this.createSubSection('Tooltips', [
                                (() => {
                                    const hoverBtn = new Button({ label: 'Hover Me for Info', variant: 'secondary' });
                                    new Tooltip({ text: 'This is an informative tooltip rendered on top!', target: hoverBtn.getElement(), position: 'top' });
                                    return hoverBtn;
                                })()
                            ])
                        ]),

                        // --- Data Entry & Forms Section ---
                        this.createSection('Data Entry', [
                            new SplitView({
                                orientation: 'horizontal',
                                initialSizes: [50, 50],
                                panes: [
                                    new Stack({
                                        gap: 'md',
                                        padding: 'sm',
                                        children: [
                                            new SearchInput({ placeholder: 'Search components...' }),
                                            new Select({
                                                label: 'Color Theme',
                                                options: [
                                                    { label: 'Dark Modern', value: 'dark' },
                                                    { label: 'Light Modern', value: 'light' },
                                                    { label: 'High Contrast', value: 'hc' }
                                                ],
                                                value: 'dark'
                                            }),
                                            new Stack({
                                                gap: 'xs',
                                                children: [
                                                    new Text({ text: 'Zoom Level', size: 'xs', variant: 'muted' }),
                                                    new Slider({ min: 50, max: 200, value: 100 })
                                                ]
                                            }),
                                            new ColorPicker({
                                                color: Theme.colors.accent,
                                                onChange: (c) => console.log('Selected Color:', c)
                                            })
                                        ]
                                    }),
                                    new Stack({
                                        gap: 'md',
                                        padding: 'sm',
                                        children: [
                                            new MultiSelectTagInput({
                                                placeholder: 'Assign roles...',
                                                options: [
                                                    { label: 'Admin', value: 'admin' },
                                                    { label: 'Editor', value: 'editor' },
                                                    { label: 'Viewer', value: 'viewer' }
                                                ],
                                                selectedValues: ['viewer'],
                                                onChange: (v) => console.log('Roles:', v)
                                            }),
                                            new PropertyGrid({
                                                items: [
                                                    { label: 'ID', control: new Text({ text: 'comp-1029', monospace: true }) },
                                                    { label: 'Visible', control: new Switch({ checked: true }) },
                                                    { label: 'Access', control: new Checkbox({ label: 'Read-only', checked: false }) }
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ])
                    ]
                })
            ]
        });

        this.appendChildren(headerArea, scrollArea);
    }

    private createSection(title: string, children: (BaseComponent<any> | Node | string)[]): BaseComponent {
        return new Stack({
            direction: 'column',
            gap: 'md',
            children: [
                new Stack({
                    direction: 'row',
                    align: 'center',
                    gap: 'sm',
                    children: [
                        new Heading({ text: title, level: 3, variant: 'main' })
                    ]
                }),
                new Divider(),
                ...children
            ]
        });
    }

    private createSubSection(title: string, children: (BaseComponent<any> | Node | string)[]): BaseComponent {
        return new Stack({
            direction: 'column',
            gap: 'sm',
            children: [
                new Text({ text: title, variant: 'accent', weight: '600', size: 'sm' }),
                new Stack({
                    gap: 'md',
                    padding: 'sm',
                    children
                })
            ]
        });
    }

    private createBox(text: string, color: string): BaseComponent {
        const box = new Stack({
            padding: 'md',
            align: 'center',
            justify: 'center',
            children: [new Text({ text, monospace: true, size: 'sm' })]
        });

        Object.assign(box.getElement().style, {
            backgroundColor: color,
            borderRadius: Theme.radius,
            color: Theme.colors.textMain,
            minWidth: '50px',
            border: `1px solid ${Theme.colors.border}`,
            flex: '1'
        });

        return box;
    }
}