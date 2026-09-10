import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-center p-6">
      <h2 className="text-4xl font-extrabold text-[#163B5C] mb-2">404 - Page Not Found</h2>
      <p className="text-sm text-[#64748B] mb-6">Could not find requested resource.</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-[#ED3500] text-white font-bold text-sm shadow-md hover:bg-[#D02E00] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
