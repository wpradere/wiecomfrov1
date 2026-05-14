'use client';

import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export default function AdminDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-white/20 hover:text-red-400 text-xs uppercase tracking-widest transition-colors"
    >
      Eliminar
    </button>
  );
}
