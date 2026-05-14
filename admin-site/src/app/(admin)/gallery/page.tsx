'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { galleryConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={galleryConfig} />; }
