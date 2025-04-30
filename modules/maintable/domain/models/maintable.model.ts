export interface MainTableModel {
    maintableId: number;
    parentMaintableId?: number | null;
    tableName?: string;
    itemText: string;
    itemValue?: string | null;
    itemOrder?: number;
}
