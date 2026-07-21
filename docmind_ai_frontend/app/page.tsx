import UploadPdf from "../app/components/uploadPDF";

export default function Home() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[linear-gradient(135deg,#f8fbff,#eef4ff)] px-4 pt-4 pb-2 text-slate-900">
      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="mb-3 inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700 shadow-sm">
          Smart PDF Q&A
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          DocMind AI
        </h1>

        <p className="mt-3 max-w-2xl text-lg text-slate-600 sm:text-xl">
          Upload your PDF and ask questions
        </p>
      </section>

      <div className="mt-3 min-h-0 flex-1">
        <UploadPdf />
      </div>
    </main>
  );
}