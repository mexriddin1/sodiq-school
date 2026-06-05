'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader, BackLink } from '@/components/PageHeader';
import { WebhookForm, type WebhookDto } from '@/components/WebhookForm';

export default function EditWebhookPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [initial, setInitial] = useState<WebhookDto | null>(null);

  useEffect(() => {
    api<WebhookDto>(`/api/webhooks/${params.id}`)
      .then((w) => setInitial(w))
      .catch((err) => toast.push(err.message, 'danger'));
    // eslint-disable-next-line
  }, [params.id]);

  async function handleSubmit(data: WebhookDto) {
    await api(`/api/webhooks/${params.id}`, { method: 'PUT', body: data });
    toast.push('Saqlandi', 'success');
    router.replace('/webhooks');
  }

  return (
    <>
      <PageHeader
        title={`Webhook #${params.id}`}
        actions={<BackLink href="/webhooks" label="Webhooklar" />}
      />
      <main className="content">
        {!initial ? (
          <div className="muted">Yuklanmoqda...</div>
        ) : (
          <WebhookForm initial={initial} onSubmit={handleSubmit} submitLabel="Saqlash" />
        )}
      </main>
    </>
  );
}
