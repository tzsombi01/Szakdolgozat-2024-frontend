export interface State {
    error: string;
    loading: boolean;
}

export interface Payload {
    data: { content: any, total: number } | any;
    error: string;
    loading: boolean;
}