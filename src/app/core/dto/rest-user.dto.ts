export interface RestUserResponse {
  request: RestUserRequest;
  entities: EntityDefinition[];
  features: FeatureDefinition[];
  permissionsXml: string;
  errors: unknown[];
  allowEWS: boolean;
  user: UserDefinition;
  expireDate?: string;
}

export interface RestUserRequest {
  companyId: string;
  userId: string;
  password?: string;
  utcOffset: number;
  debugKey?: string | null;
  device?: unknown | null;
  exelareAppType?: unknown | null;
  authToken: string;
  relogin: boolean;
  rNewMeta: boolean;
  rNewDB: boolean;
  rUseXTC: boolean;
  rDBId: string;
  rAppXmlVersion: string;
  rLicenseMessage: string;
  rServerTime: string;
  sessionTimeoutMins: number;
  ignoreForeignEntities: boolean;
}

export interface EntityDefinition {
  id: string;
  caption: string;
  properties: number;
  views: EntityView[];
  tabs: EntityTab[];
  sid?: string;
  scaption?: string;
}

export interface EntityView {
  kind: number;
  id: string;
  caption: string;
  singleCall: boolean;
  properties: number;
  defaultColumns?: string[];
  regions?: DashboardRegion[];
}

export interface EntityTab {
  kind: number;
  id: string;
  caption: string;
  singleCall: boolean;
  properties: number;
}

export interface DashboardRegion {
  caption: string;
  content: RegionContent;
}

export interface RegionContent {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'grid' | 'tabs' | string;
  dataLabelIdx?: number;
  seriesLabelIdx?: number;
  showLegend?: boolean;
  columnBased?: boolean;
  filters?: FilterDefinition[];
  tabs?: RegionContentTab[];
  groupDescriptor?: string;
  jumps?: JumpDefinition[];
  basedOn?: string;
}

export interface RegionContentTab {
  caption: string;
  content: RegionContent;
}

export interface FilterDefinition {
  fieldName: string;
  fieldCaption?: string;
  caption: string;
  lookupType: 'UsersAndGroups' | 'Date' | 'MultiSelectList' | 'Entity' | string;
  isLookupGroupable: boolean;
  isHidden: boolean;
  isOverridable: boolean;
  allowAllInLookup: boolean;
  extraLookupValues?: string[];
  defaultValue?: string;
  defaultFilterType?: string;
  disallowNewLookupItem?: boolean;
  isMultiSelect: boolean;
  values?: string[];
  lookupEntityId?: string;
}

export interface JumpDefinition {
  jumpToEntityId: string;
  jumpToCategoryId: string;
  jumpToReportId: string;
  sourceFieldName: string;
  destinationFieldName: string;
  passFilters: string[];
  passCells: unknown[];
}

export interface FeatureDefinition {
  id: string;
  enabled: boolean;
}

export interface UserDefinition {
  companyId: string;
  userId: string;
  email: string;
  permissions: string;
  allowPowerMTA: boolean;
  massMailLimitPerBatch: number;
  massTextLimitPerBatch: number;
  trackActivityMins: number;
}

export interface AuthRequest {
  companyID: string;
  userID: string;
  password: string;
  authToken?: string;
  relogin: boolean;
  debugKey?: string;
  utcOffset?: number;
  userEnvironment?: unknown;
  ignoreForeignEntities?: boolean;
}
