'use client';
import { useParams } from 'next/navigation';
import { CrudFormPage } from '@/components/crud/CrudFormPage';
import { topStudentsConfig } from '@/components/crud/configs';
export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <CrudFormPage cfg={topStudentsConfig} id={id} />;
}
