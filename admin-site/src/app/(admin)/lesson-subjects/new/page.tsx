'use client';
import { CrudFormPage } from '@/components/crud/CrudFormPage';
import { lessonSubjectsConfig } from '@/components/crud/configs';
export default function Page() { return <CrudFormPage cfg={lessonSubjectsConfig} />; }
