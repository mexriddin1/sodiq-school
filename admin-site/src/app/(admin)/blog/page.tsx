'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { blogConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={blogConfig} />; }
