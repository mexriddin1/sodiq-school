'use client';
import { CrudFormPage } from '@/components/crud/CrudFormPage';
import { blogConfig } from '@/components/crud/configs';
export default function Page() { return <CrudFormPage cfg={blogConfig} />; }
