'use client';
import { CrudFormPage } from '@/components/crud/CrudFormPage';
import { alumniConfig } from '@/components/crud/configs';
export default function Page() { return <CrudFormPage cfg={alumniConfig} />; }
