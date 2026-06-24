import {
  Check,
  Copy,
  History,
  Info,
  Link,
  Plus,
  Trash2,
} from 'lucide-react';

import type { UTMParameters } from './types';

export const INITIAL_UTM: UTMParameters = {
  websiteUrl: '',
  campaignId: '',
  campaignSource: '',
  campaignMedium: '',
  campaignName: '',
  campaignTerm: '',
  campaignContent: '',
  customParams: [],
};

export const Icons = {
  Link: () => <Link size={20} strokeWidth={2} />,
  Copy: () => <Copy size={20} strokeWidth={2} />,
  History: () => <History size={20} strokeWidth={2} />,
  Trash: () => <Trash2 size={18} strokeWidth={2} />,
  Check: () => <Check size={20} strokeWidth={2} />,
  Info: () => <Info size={14} strokeWidth={2} />,
  Plus: () => <Plus size={18} strokeWidth={2} />,
};
