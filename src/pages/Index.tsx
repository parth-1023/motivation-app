import { useState } from "react";
import ReelsFeed from "@/components/ReelsFeed";
import BottomNav from "@/components/BottomNav";
import AddReelModal from "@/components/AddReelModal";
import ManageReelsModal from "@/components/ManageReelsModal";
import { Toaster } from "@/components/ui/toaster";
import { useReels } from "@/hooks/useReels";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { reels, visibleReels, isLoading, isUploading, addReel, deleteReel, toggleReelVisibility, moveReel, shuffleReels } = useReels();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const success = await deleteReel(id);
    if (success) {
      toast({
        title: "Reel deleted",
        description: "The video has been removed from your feed",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete reel",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background overscroll-contain">
      {visibleReels.length > 0 ? (
        <ReelsFeed reels={visibleReels} onDelete={handleDelete} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
          <p className="text-lg text-muted-foreground">No videos yet</p>
          <p className="text-sm text-muted-foreground">
            Tap the + button to upload your first video
          </p>
        </div>
      )}
      
      <BottomNav
        onUploadClick={() => setIsAddModalOpen(true)}
        onManageClick={() => setIsManageModalOpen(true)}
      />
      
      <AddReelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddReel={addReel}
        isUploading={isUploading}
      />
      
      <ManageReelsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        reels={reels}
        onToggleVisibility={toggleReelVisibility}
        onDelete={deleteReel}
        onMoveReel={moveReel}
        onShuffle={shuffleReels}
      />
      
      <Toaster />
    </div>
  );
};

export default Index;
