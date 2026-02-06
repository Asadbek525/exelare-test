export interface IFilterExpression {
  oper: string;
  fieldName?: string;
  tableName?: string;
  fieldValue1?: string;
  fieldValue2?: string;
  isMultiValue?: boolean;
  isFacet?: boolean;
}

export interface IFilterStatement extends IFilterExpression {
  items: IFilterStatement[];
}
export interface IOrderByStatement {
  items: [
    {
      oper: string;
      fieldName: string;
    },
  ];
}

export interface GetPageRequest {
  pageNumber: number; // starts from 1
  pageSize: number;
  needData: boolean;
  needSchema: boolean;
  needRecordCount: boolean;
  entityId: string;
  which: string;
  whichId: string;
  needStyleMap: boolean;
  requestId?: string; // for caching
  selectFields?: string;
  filterBy?: IFilterStatement;
  orderBy?: IOrderByStatement;
  excludeConsultants?: string;
  isFacetedSearch?: boolean;
  extraFields?: string;
  serverData?: string;
}

export interface IStyleMap {
  kind: string; // row | column
  rowIndex: number; // rowNum
  colIndex: number; // colNum
  background: string;
  foreground: string; // fontColor
  bold: boolean;
  italic: boolean;
}

export interface Facet {
  fieldName: string;
  type: string;
  maxDisplay: number;
  facetResults: FacetResult[];
}

export interface FacetResult {
  isChecked: boolean;
  kind: string;
  caption: string;
  value: string;
  count: number;
  start: number;
  end: number;
}

export interface RecordSet<T> {
  schema: {
    fieldName: string;
    fieldCaption: string;
    tableName: string;
    columnName: string;
    origFieldName: string;
    dataType: string;
  }[];
  records: T[];
  keys: string[];
  origin: string;
}

export interface GetPageResponse<T> {
  request: GetPageRequest;
  recordSet: RecordSet<T>;
  recentViews: string[];
  hasMoreData: boolean;
  pageNumber: number;
  recordCount: number;
  styleMap?: IStyleMap[];
  serverData?: object;
  debugInfo?: string;
  facets?: Facet[];
}
