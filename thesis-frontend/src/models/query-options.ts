export interface QueryOptions {
    skip?: number;
    take?: number;
    filters?: Filter[];
    sort?: Sort;
}

export interface Filter {
    field: string;
    operator: ('eq' | 'neq' | 'contains' | 'doesnotcontain' | 'startswith' | 'endswith' | 'gte' | 'gt' | 'lte' | 'lt' | 'includes' | 'between');
    value: any;
    type: string
}

export interface Sort {
    dir: string;
    field: string;
}
