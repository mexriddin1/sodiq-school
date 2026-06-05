'use client';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader, BackLink } from '@/components/PageHeader';
import { WebhookForm, type WebhookDto } from '@/components/WebhookForm';

export default function NewWebhookPage() {
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(data: WebhookDto) {
    await api('/api/webhooks', { method: 'POST', body: data });
    toast.push('Yaratildi', 'success');
    router.replace('/webhooks');
  }

  return (
    <>
      <PageHeader title="Yangi webhook" actions={<BackLink href="/webhooks" label="Webhooklar" />} />
      <main className="content">
        <WebhookForm onSubmit={handleSubmit} submitLabel="Yaratish" />
      </main>
    </>
  );
}
