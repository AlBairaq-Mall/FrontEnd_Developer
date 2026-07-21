import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden print:overflow-visible h-full">
        <div className="print:hidden">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible print:h-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
