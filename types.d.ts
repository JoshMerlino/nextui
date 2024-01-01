type GetProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never