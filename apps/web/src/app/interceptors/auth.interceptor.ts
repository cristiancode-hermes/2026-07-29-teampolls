import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/')) {
    const token = localStorage.getItem('teampolls_token');
    if (token) {
      return next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      }));
    }
  }
  return next(req);
};
