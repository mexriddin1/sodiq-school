'use client';
import { CrudFormPage } from '@/components/crud/CrudFormPage';
import { pricingPlansConfig } from '@/components/crud/configs';
export default function Page() { return <CrudFormPage cfg={pricingPlansConfig} />; }
