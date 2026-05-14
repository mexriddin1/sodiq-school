'use client';
import { useParams } from 'next/navigation';
import { CarouselImageForm } from '@/components/CarouselImageForm';
export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <CarouselImageForm id={id} />;
}
