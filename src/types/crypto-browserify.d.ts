// src/@types/crypto-browserify.d.ts

declare module 'crypto-browserify' {
    export function createHash(algorithm: string): {
        update(data: string | Buffer): any;
        digest(encoding?: string): string | Buffer;
    };

    export function createHmac(algorithm: string, key: string): {
        update(data: string | Buffer): any;
        digest(encoding?: string): string | Buffer;
    };

    // Adicione outras funções conforme necessário
}
