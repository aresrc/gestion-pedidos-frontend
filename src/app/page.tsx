import Image from "next/image";
import LayoutConSidebar from '@/app/components/LayoutConSidebar';

export default function Home() {
  return (
    <LayoutConSidebar>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          {}
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Bienvenido al Sistema de Gestión de Pedidos
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-xl">
          </p>
        </main>
      </div>
    </LayoutConSidebar>
  );
}
