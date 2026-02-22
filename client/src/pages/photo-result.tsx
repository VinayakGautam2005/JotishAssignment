import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function PhotoResult() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const img = localStorage.getItem("lastCapturedPhoto");
    if (img) setImageSrc(img);
  }, []);

  return (
    <Layout title="Capture Result" showBack>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-1 shadow-xl border border-border">
          <div className="rounded-[20px] overflow-hidden relative bg-black/5 aspect-video flex items-center justify-center">
            {imageSrc ? (
              <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <div className="text-muted-foreground">No image found</div>
            )}

            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <CheckCircle2 size={16} />
              Uploaded Successfully
            </div>
          </div>

          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold font-display text-foreground mb-2">Capture Complete</h2>
            <p className="text-muted-foreground mb-8">The employee photo has been securely uploaded to the server.</p>

            <Link href="/">
              <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 flex items-center gap-2 mx-auto">
                Return to Dashboard
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
