'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { universitiesConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={universitiesConfig} />; }
