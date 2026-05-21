import { Button, Card } from '@topiadesk/ui';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Card className="flex max-w-md flex-col items-center gap-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#22c55e]">
          Topiadesk
        </span>
        <h1 className="text-3xl font-bold text-[#1d3a5f]">Super Admin</h1>
        <p className="text-slate-500">Topiadesk-internal Super-Admin portal</p>
        <Button>Get started</Button>
      </Card>
    </main>
  );
}
