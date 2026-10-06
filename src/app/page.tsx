import { redirect } from 'next/navigation';

// Kept in sync with DEFAULT_LANGUAGE in src/middleware.ts. In practice the
// middleware already redirects "/" before this runs; this is the fallback for
// when middleware is bypassed (e.g. a fully static export).
export default function RootPage() {
  redirect('/az');
}
