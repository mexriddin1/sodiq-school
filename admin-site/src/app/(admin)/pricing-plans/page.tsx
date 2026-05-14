'use client';
import { CrudListPage } from '@/components/crud/CrudListPage';
import { pricingPlansConfig } from '@/components/crud/configs';
export default function Page() { return <CrudListPage cfg={pricingPlansConfig} />; }
