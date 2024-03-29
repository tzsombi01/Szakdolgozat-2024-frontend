export interface Entity {
    id?: string;
    createdAt: number;
    modifiedAt: number;
    createdBy: string;
    modifiedBy: string;
    deleted: boolean;
}