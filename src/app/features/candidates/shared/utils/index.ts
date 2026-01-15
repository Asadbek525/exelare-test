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
