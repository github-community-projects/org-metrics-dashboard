import DarkModeToggle from '@/components/DarkModeToggle';
import OldDashboard from '@/components/OldDashboard';

export default function PlaygroundPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <DarkModeToggle/>
      <OldDashboard/>
    </main>
  );
}
