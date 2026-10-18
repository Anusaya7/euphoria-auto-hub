export function track(event: string, params?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', event, params);
}
