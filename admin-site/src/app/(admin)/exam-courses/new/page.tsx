'use client';
import { CrudFormPage } from '@/components/crud/CrudFormPage';
import { examCoursesConfig } from '@/components/crud/configs';
export default function Page() { return <CrudFormPage cfg={examCoursesConfig} />; }
