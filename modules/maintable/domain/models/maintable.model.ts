export interface MainTableModel {
    maintableId: number;
    parentMaintableId?: number | null;
    tableName?: string;
    itemText: string;
    itemValue?: string | null;
    itemOrder?: number;
}

export type MaintableResponseModel = {
  maintable_id: number;
  parent_maintable_id?: number;
  table_name?: string;
  item_text?: string;
  item_value?: string;
  item_order?: number;
  description?: string;
  insert_date?: string;
  update_date?: string;
  user_create?: string;
  user_modify?: string;
}
