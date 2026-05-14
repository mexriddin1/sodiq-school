'use client';
import { useParams } from 'next/navigation';
import { CrudFormPage } from '@/components/crud/CrudFormPage';
import { blogConfig } from '@/components/crud/configs';
export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <CrudFormPage cfg={blogConfig} id={id} />;
}
