import Documentation from '@/components/Documentation';
import { Layout } from '@/components/Layout';

export default function DocumentationPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl h-screen">
      <Layout>
        <Documentation />
      </Layout>
    </main>
  );
}
