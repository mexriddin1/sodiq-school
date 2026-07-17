import type { Metadata } from 'next';
import { HomeContent } from '../page';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '1-avgust imtihoni | Sodiq School',
    description: 'Sodiq School da 2026-2027 bepul qabul imtixoniga farzandingizni yozdiring.',
  };
}

export default async function Imtixon1AvgustPage({ params }: { params: { locale: string } }) {
  return HomeContent({ params, variant: 'exam-1avgust' });
}
