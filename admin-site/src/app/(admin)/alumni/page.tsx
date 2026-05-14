'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { alumniConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={alumniConfig} />; }
