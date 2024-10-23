import { serialize } from 'cookie';
import type { OptionsType, TmpCookiesObj, CookieValueTypes } from '../common/types';
import { stringify, decode, isClientSide } from '../common/utils';

const ensureClientSide = () => {
  if (!isClientSide()) {
    throw new Error(
      'You are trying to access cookies on the server side. Please, use the server-side import with `cookies-next/server` instead.',
    );
  }
};

const getCookies = (_options?: OptionsType): TmpCookiesObj => {
  ensureClientSide();
  const cookies: TmpCookiesObj = {};
  const documentCookies = document.cookie ? document.cookie.split('; ') : [];

  for (let i = 0, len = documentCookies.length; i < len; i++) {
    const cookieParts = documentCookies[i].split('=');
    const cookie = cookieParts.slice(1).join('=');
    const name = cookieParts[0];
    cookies[name] = cookie;
  }

  return cookies;
};

const getCookie = (key: string, options?: OptionsType): CookieValueTypes => {
  ensureClientSide();
  const _cookies = getCookies(options);
  const value = _cookies[key];
  if (value === undefined) return undefined;
  return decode(value);
};

const setCookie = (key: string, data: any, options?: OptionsType): void => {
  ensureClientSide();
  const _cookieOptions = options || {};
  const cookieStr = serialize(key, stringify(data), { path: '/', ..._cookieOptions });
  document.cookie = cookieStr;
};

const deleteCookie = (key: string, options?: OptionsType): void => {
  ensureClientSide();
  setCookie(key, '', { ...options, maxAge: -1 });
};

const hasCookie = (key: string, options?: OptionsType): boolean => {
  ensureClientSide();
  if (!key) return false;
  const cookies = getCookies(options);
  return Object.prototype.hasOwnProperty.call(cookies, key);
};

export * from '../common/types';
export { getCookies, getCookie, setCookie, deleteCookie, hasCookie };