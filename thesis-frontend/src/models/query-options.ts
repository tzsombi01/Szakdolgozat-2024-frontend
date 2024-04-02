export interface QueryOptions {
    skip?: number;
    take?: number;
    filters?: Filter[];
    sort?: Sort;
    siteOptions: SiteOptions;
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

export interface SiteOptions {
    siteRef: string;
    withSubSites: boolean;
}