import type { Locale } from '../LocaleTabs';

export type FieldType =
  | 'text' | 'textarea' | 'richtext' | 'number' | 'image'
  | 'select' | 'checkbox' | 'tags' | 'json' | 'facts';

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
  rows?: number;
};

export type EntityConfig = {
  endpoint: string;            // e.g. "/api/teachers"
  basePath: string;            // e.g. "/teachers"
  title: string;
  singular: string;
  parentFields: FieldDef[];
  translationFields: FieldDef[];
  listColumns: Array<{
    key: string;
    label: string;
    render?: (row: any) => React.ReactNode;
  }>;
  // Optional: extra slug column to show
  hasImage?: boolean;
  imageField?: string;
  // Optional: hide list rows that don't match this parent column value (client-side filter).
  listFilter?: { field: string; value: string | number };
  // Optional: default parent column values for newly created rows.
  defaults?: Record<string, any>;
};
