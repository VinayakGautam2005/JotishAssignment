import { useEmployee } from "@/hooks/use-employees";
import { useUploadPhoto } from "@/hooks/use-photos";
import { Layout } from "@/components/layout";
import { useRoute, useLocation } from "wouter";
import {
  Camera,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  Loader2
} from "lucide-react";
import Webcam from "react-webcam";
import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export default function EmployeeDetails() {
  const [, params] = useRoute("/employee/:id");
  const [, setLocation] = useLocation();
  const { employee, isLoading } = useEmployee(params?.id || "");

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const uploadPhotoMutation = useUploadPhoto();

  const handleCapture = useCallback(async () => {
    setCaptureError(null);

    if (!webcamRef.current) {
      setCaptureError("Camera not ready. Please try again.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setCaptureError("Failed to capture image. Make sure the camera is active and try again.");
      return;
    }

    try {
      await uploadPhotoMutation.mutateAsync({ imageUrl: imageSrc });

      setIsCameraOpen(false);
      setCaptureError(null);

      // Persist image for the result page (Wouter has no route state)
      localStorage.setItem("lastCapturedPhoto", imageSrc);
      setLocation("/photo");
    } catch (error: any) {
      console.error("Failed to upload photo:", error);
      const message = error?.message || "Failed to upload photo. Please try again.";
      setCaptureError(message);
    }
  }, [webcamRef, uploadPhotoMutation, setLocation]);

  if (isLoading || !employee) {
    return (
      <Layout showBack>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={employee.name} showBack>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-secondary to-primary/10 flex items-center justify-center text-4xl font-bold font-display text-primary shadow-inner border border-primary/5">
                {employee.name.charAt(0)}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-foreground">{employee.name}</h2>
                  <p className="text-primary font-medium text-lg">{employee.role}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <InfoItem icon={<User size={18} />} label="Employee ID" value={employee.employeeId} />
                  <InfoItem icon={<MapPin size={18} />} label="Location" value={employee.city} />
                  <InfoItem icon={<Calendar size={18} />} label="Start Date" value={employee.startDate} />
                  <InfoItem icon={<DollarSign size={18} />} label="Salary" value={employee.salary} />
                </div>
              </div>
            </div>
          </div>

          {/* Camera Section */}
          <div className="bg-white rounded-3xl p-8 border border-border shadow-sm overflow-hidden relative">
            <h3 className="text-xl font-bold font-display mb-4">Identity Verification</h3>
            <p className="text-muted-foreground mb-6">Capture a photo to verify employee identity.</p>

            {!isCameraOpen ? (
              <button
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors border-2 border-dashed border-primary/20"
              >
                <Camera size={24} className="text-primary" />
                Open Camera
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={() => setIsCameraOpen(false)}
                    className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-medium hover:bg-white/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCapture}
                    disabled={uploadPhotoMutation.isPending}
                    className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    {uploadPhotoMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
                    )}
                    Capture Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info - Just for visual balance */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-yellow-600 rounded-3xl p-8 text-primary-foreground shadow-xl shadow-primary/20">
            <h3 className="text-lg font-bold font-display mb-2">Performance</h3>
            <div className="text-4xl font-bold mb-1">98%</div>
            <p className="text-primary-foreground/70 text-sm">Attendance Rate</p>

            <div className="mt-8 pt-8 border-t border-primary-foreground/10">
              <h3 className="text-lg font-bold font-display mb-2">Projects</h3>
              <div className="text-4xl font-bold mb-1">12</div>
              <p className="text-primary-foreground/70 text-sm">Completed this year</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
