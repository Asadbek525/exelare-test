export const SEVERITY_MAP: Record<
  string,
  'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined
> = {
  Received: 'info',
  Potential: 'success',
  Interview: 'warn',
  Offer: 'danger',
  Placed: 'secondary',
};

export const STATUS_SEVERITY_MAP: Record<
  string,
  'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined
> = {
  REJECTED: 'danger',
  ARCHIVED: 'secondary',
  NEW: 'info',
  HIRED: 'success',
  'ON HOLD': 'warn',
};

export const STAGE_SEVERITY_MAP: Record<
  string,
  'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined
> = {
  Rejected: 'danger',
  Submit: 'info',
  Applied: 'success',
  Offer: 'contrast',
  Hired: 'success',
  Interview: 'warn',
};
