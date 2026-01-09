import { Locale } from '@/types';
import * as enUs from './messages/en-US';
import * as kkKz from './messages/kk-KZ';
import * as ruRu from './messages/ru-RU';
import * as uzUz from './messages/uz-UZ';

export const DEFAULT_LANG: Locale = 'en-US';

export const MESSAGES = {
  'en-US': enUs,
  'kk-KZ': kkKz,
  'ru-RU': ruRu,
  'uz-UZ': uzUz,
};
