declare type Stateable<T> = [T, (value: T) => void] | ReturnType<typeof import("react").useState<T>>;

declare type ExtractProps<T> = T extends import("react").ComponentType<infer P> ? P : never;