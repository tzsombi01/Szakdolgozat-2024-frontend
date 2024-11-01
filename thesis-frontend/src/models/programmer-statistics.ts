export interface ProgrammerStatisticsRequest {
    ids: string[];
    type: StatisticsType;
    from?: number;
    until?: number;
}

export interface ProgrammerStatisticsResponse {
    ids: string[];
    type: StatisticsType;
    from?: number;
    until?: number;
    statisticsInfos: any[];
}

export enum StatisticsType {
    AVERAGE_COMMIT_SIZE = 'AVERAGE_COMMIT_SIZE',
    COMMITS_PER_PROJECT = 'COMMITS_PER_PROJECT',
    DAILY_COMMITS_FOR_YEAR = 'DAILY_COMMITS_FOR_YEAR'
}