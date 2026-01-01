import { useState, useRef } from "react";
import { X, Upload, Video, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReel: (file: File, name: string) => Promise<boolean>;
  isUploading: boolean;
}

const AddReelModal = ({ isOpen, onClose, onAddReel, isUploading }: AddReelModalProps) => {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [reelName, setReelName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (selectedVideo) {
      const success = await onAddReel(selectedVideo, reelName.trim());
      if (success) {
        toast({
          title: "Success!",
          description: "Video uploaded successfully",
        });
        resetForm();
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to upload video",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setSelectedVideo(null);
    setVideoPreview("");
    setReelName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-[95vw] sm:max-w-sm bg-card rounded-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">Add Video</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isUploading}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Name input */}
          <div className="space-y-2">
            <Label htmlFor="reel-name">Reel Name</Label>
            <Input
              id="reel-name"
              placeholder="Enter a name for this reel"
              value={reelName}
              onChange={(e) => setReelName(e.target.value)}
              disabled={isUploading}
            />
          </div>

          {/* Video upload area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative aspect-[9/16] w-full cursor-pointer rounded-lg border-2 border-dashed transition-all overflow-hidden ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          >
            {videoPreview ? (
              <video
                src={videoPreview}
                className="h-full w-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="rounded-full bg-muted p-4">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-card-foreground">
                    Drop your video here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedVideo || isUploading}
            className="w-full min-h-[44px] active:scale-[0.98] transition-transform touch-manipulation"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddReelModal;
