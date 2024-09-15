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
    COMMITS_PER_PROJECT= 'COMMITS_PER_PROJECT',
    COMMITS_PER_DAY = 'COMMITS_PER_DAY',
    LINES_PER_DAY = 'LINES_PER_DAY',
    TICKETS_PER_WEEK = 'TICKETS_PER_WEEK',
}