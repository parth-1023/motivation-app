import { useRef, useEffect, useState } from "react";
import { Volume2, VolumeX, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReelCardProps {
  videoUrl: string;
  name: string | null;
  isActive: boolean;
  onDelete?: () => void;
}

const ReelCard = ({ videoUrl, name, isActive, onDelete }: ReelCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 800);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  return (
    <div 
      className="relative h-[100dvh] w-full flex-shrink-0 snap-start snap-always bg-background flex items-center justify-center touch-manipulation overscroll-contain"
      onClick={togglePlay}
    >
      {/* Video container - full width on mobile, 9:16 on desktop */}
      <div className="relative h-full w-full sm:w-auto sm:aspect-[9/16]">
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover rounded-lg"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />
        
        {/* Play icon overlay */}
        <div 
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
            showPlayIcon ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="rounded-full bg-background/30 p-6 backdrop-blur-sm">
            <Play className="h-16 w-16 fill-foreground text-foreground" />
          </div>
        </div>

        {/* Delete button - top left with safe area */}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 rounded-full bg-muted/50 min-w-[44px] min-h-[44px] backdrop-blur-sm hover:bg-destructive/50 active:bg-destructive/50 text-foreground hover:text-destructive-foreground active:scale-95 transition-transform top-[calc(1rem+env(safe-area-inset-top))]"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}

        {/* Delete confirmation dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this reel?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The video will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Name overlay */}
        {name && (
          <div className="absolute bottom-4 left-4 right-16 pointer-events-none">
            <p className="text-foreground font-semibold text-lg drop-shadow-lg bg-background/30 backdrop-blur-sm px-3 py-1 rounded-lg inline-block">
              {name}
            </p>
          </div>
        )}

        {/* Mute button - top right with safe area */}
        <button
          onClick={toggleMute}
          className="absolute right-4 rounded-full bg-muted/50 min-w-[44px] min-h-[44px] flex items-center justify-center backdrop-blur-sm hover:bg-muted active:bg-muted active:scale-95 transition-all top-[calc(1rem+env(safe-area-inset-top))]"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-foreground" />
          ) : (
            <Volume2 className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ReelCard;
