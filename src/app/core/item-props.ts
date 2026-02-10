export enum ItemProps {
  Hidable = Math.pow(2, 0),
  Hidden = Math.pow(2, 1),
  CaptionModifiable = Math.pow(2, 2),
  LayoutModifiable = Math.pow(2, 3),
  LayoutRemovable = Math.pow(2, 4),
  LayoutPlacable = Math.pow(2, 5),
  FieldSizeModifiable = Math.pow(2, 6),
  FieldTypeModifiable = Math.pow(2, 7),
  FieldDeletable = Math.pow(2, 8),
  Defaultable = Math.pow(2, 9),
  FieldUsageModifiable = Math.pow(2, 10),
  Internal = Math.pow(2, 11),
  Custom = Math.pow(2, 12),
  AllowLookup = Math.pow(2, 13),
  LookupRulesModifiable = Math.pow(2, 14),
  DisableInput = Math.pow(2, 15),
  MultiSelectLookup = Math.pow(2, 16),
  AutoAddToLookupList = Math.pow(2, 17),
  LookupListModifiable = Math.pow(2, 18),
  AllowGrouping = Math.pow(2, 19),
  LookupFieldModifiable = Math.pow(2, 20),
  AutoComplete = Math.pow(2, 21),
  AutoCompleteRemoteDB = Math.pow(2, 22),
  ProperCase = Math.pow(2, 32),
  ShowAllInUsers = Math.pow(2, 33),
  ShowSelfInUsers = Math.pow(2, 34),
  Z_This_is_Last = Math.pow(2, 63),
}

export function isHidden(props: number): boolean {
  return (props & ItemProps.Hidden) > 0;
}

export function isMultiSelectLookup(props: number): boolean {
  return (props & ItemProps.MultiSelectLookup) > 0;
}

export function isDisableInput(props: number): boolean {
  return (props & ItemProps.DisableInput) > 0;
}

export function isCaptionModifiable(props: number): boolean {
  return (props & ItemProps.CaptionModifiable) > 0;
}

export function isAllowGrouping(props: number): boolean {
  return (props & ItemProps.AllowGrouping) > 0;
}

export function isLookupListModifiable(props: number): boolean {
  return (props & ItemProps.LookupListModifiable) > 0;
}
