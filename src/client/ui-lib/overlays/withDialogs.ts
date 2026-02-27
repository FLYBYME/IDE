import { BaseComponent } from '../BaseComponent';
import { ConfirmDialog, ConfirmDialogOptions } from './ConfirmDialog';
import { PromptDialog, PromptDialogOptions } from './PromptDialog';
import { FormDialog, FormDialogOptions } from './FormDialog';
import { QuickPickDialog, QuickPickItem, QuickPickOptions } from './QuickPickDialog';

export function withDialogs<T extends { new(...args: any[]): BaseComponent<any> }>(Base: T) {
    return class extends Base {
        public render(): void {
            // Subclasses will implement this
        }

        public async confirm(options: ConfirmDialogOptions | string): Promise<boolean> {
            const opts = typeof options === 'string' ? { message: options } : options;
            return ConfirmDialog.show(opts);
        }

        public async prompt(options: PromptDialogOptions | string): Promise<string | null> {
            const opts = typeof options === 'string' ? { message: options } : options;
            return PromptDialog.show(opts);
        }

        public async form(options: FormDialogOptions): Promise<Record<string, any> | null> {
            return FormDialog.show(options);
        }

        public async quickPick<I extends QuickPickItem>(items: I[], options: QuickPickOptions): Promise<I | null> {
            return QuickPickDialog.show(items, options);
        }
    };
}
