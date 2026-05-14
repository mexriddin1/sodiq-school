'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { lessonSubjectsConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={lessonSubjectsConfig} />; }
