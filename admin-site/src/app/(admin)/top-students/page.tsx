'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { topStudentsConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={topStudentsConfig} />; }
