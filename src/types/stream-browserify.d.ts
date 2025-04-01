// src/@types/stream-browserify.d.ts

declare module 'stream-browserify' {
    export class Readable {
        // Adicione os métodos que você usará
        constructor();
        pipe(destination: any): this;
        // outros métodos conforme necessário
    }

    export class Writable {
        // Adicione os métodos que você usará
        constructor();
        write(chunk: any): boolean;
        end(chunk?: any): void;
        // outros métodos conforme necessário
    }

    // Adicione outras classes ou tipos conforme necessário
}
