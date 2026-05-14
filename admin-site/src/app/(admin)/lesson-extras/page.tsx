'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { lessonExtrasConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={lessonExtrasConfig} />; }
