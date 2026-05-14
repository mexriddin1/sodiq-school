'use client';
import { useParams } from 'next/navigation';
import { TestimonialVideoForm } from '@/components/TestimonialVideoForm';
export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <TestimonialVideoForm id={id} />;
}
