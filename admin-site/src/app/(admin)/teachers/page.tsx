'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { teachersConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={teachersConfig} />; }
