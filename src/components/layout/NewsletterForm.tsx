'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmail('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex border-b-2 border-dark pb-2.5">
      <input
        type="email"
        placeholder="TU@EMAIL.COM"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border-none bg-transparent font-(family-name:--font-main) flex-1 outline-none text-sm"
      />
      <button type="submit" className="bg-transparent border-none text-2xl cursor-pointer">→</button>
    </form>
  );
}
