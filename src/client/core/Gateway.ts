import { GatewayClient, GatewayClientOptions } from "tool-ms/dist/lib/GatewayClient.js";
import { IDE } from "./IDE.js";


export class Gateway extends GatewayClient {
    private ide: IDE;
    constructor(ide: IDE) {
        const apiBase = ide.settings.get<string>('core.apiBase');
        const tokenKey = ide.settings.get<string>('core.tokenKey');
        const token = localStorage.getItem(tokenKey);

        const options: GatewayClientOptions = {
            baseUrl: apiBase
        }
        if (token) {
            options.token = token;
            console.log('Token found');
        } else {
            console.log('No token found');
        }
        super(options);
        this.ide = ide;
        this.registerCommands();
    }

    public async saveToken(token: string): Promise<void> {
        const tokenKey = this.ide.settings.get<string>('core.tokenKey');
        localStorage.setItem(tokenKey, token);
        await this.close();
        const connectWs = this.ide.settings.get<boolean>('ide.connectWs');
        await this.init(connectWs, true);
        console.log('Token saved successfully');
    }

    public async removeToken(): Promise<void> {
        const tokenKey = this.ide.settings.get<string>('core.tokenKey');
        localStorage.removeItem(tokenKey);
        await this.close();
        const connectWs = this.ide.settings.get<boolean>('ide.connectWs');
        await this.init(connectWs, true);
        console.log('Token removed successfully');
    }

    private registerCommands(): void {
        this.ide.commands.register({
            id: 'core.gateway.saveToken',
            label: 'Save Token',
            handler: (token: string) => this.saveToken(token)
        });
        this.ide.commands.register({
            id: 'core.gateway.removeToken',
            label: 'Remove Token',
            handler: () => this.removeToken()
        });
    }
}