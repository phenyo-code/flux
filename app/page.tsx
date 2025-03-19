import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Flux</h1>
      </header>
      <main className="container mx-auto py-12 text-center">
        <h2 className="text-4xl font-bold mb-6">Design & Build Interactively</h2>
        <Link href="/builder/1" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Start Designing
        </Link>
      </main>
    </div>
  );
}