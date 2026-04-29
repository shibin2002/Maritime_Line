import { FreightCalculator } from "@/components/FreightCalculator";
import { MaritimeBackground } from "@/components/freight/MaritimeBackground";

export default function Home() {
  return (
    <div className="relative min-h-full flex-1 overflow-x-hidden bg-slate-100 text-slate-900 dark:bg-[#050a14] dark:text-slate-100">
      <MaritimeBackground />
      <FreightCalculator />
    </div>
  );
}
