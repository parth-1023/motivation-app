import { useState } from "react"; 
import { X, Eye, EyeOff, Trash2, GripVertical, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { Reel } from "@/hooks/useReels";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ManageReelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reels: Reel[];
  onToggleVisibility: (id: string, visible: boolean) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onMoveReel: (activeId: string, overId: string) => Promise<boolean>;
  onShuffle: () => Promise<boolean>;
}

interface SortableReelItemProps {
  reel: Reel;
  onToggle: (id: string, currentVisible: boolean) => void;
  onDelete: (id: string) => void;
}

const SortableReelItem = ({ reel, onToggle, onDelete }: SortableReelItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: reel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 sm:gap-3 p-3 rounded-lg border border-border bg-muted/30 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="touch-none p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Thumbnail */}
      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
        <video
          src={reel.videoUrl}
          className="h-full w-full object-cover"
          muted
          preload="metadata"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-card-foreground truncate text-sm sm:text-base">
          {reel.name || "Untitled"}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {reel.visible ? (
            <>
              <Eye className="h-3 w-3" />
              <span>Visible</span>
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" />
              <span>Hidden</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Switch
          checked={reel.visible}
          onCheckedChange={() => onToggle(reel.id, reel.visible)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
          onClick={() => onDelete(reel.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ManageReelsModal = ({
  isOpen,
  onClose,
  reels,
  onToggleVisibility,
  onDelete,
  onMoveReel,
  onShuffle,
}: ManageReelsModalProps) => {
  const { toast } = useToast();
  const [reelToDelete, setReelToDelete] = useState<Reel | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggle = async (id: string, currentVisible: boolean) => {
    const success = await onToggleVisibility(id, !currentVisible);
    if (success) {
      toast({
        title: currentVisible ? "Reel hidden" : "Reel visible",
        description: currentVisible
          ? "This reel won't show in your feed"
          : "This reel will now show in your feed",
      });
    }
  };

  const confirmDelete = async () => {
    if (!reelToDelete) return;
    const success = await onDelete(reelToDelete.id);
    if (success) {
      toast({
        title: "Reel deleted",
        description: "The reel has been removed",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete reel",
        variant: "destructive",
      });
    }
    setReelToDelete(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      await onMoveReel(active.id as string, over.id as string);
    }
  };

  const handleShuffle = async () => {
    const success = await onShuffle();
    if (success) {
      toast({
        title: "Shuffled!",
        description: "Reels have been randomly reordered",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to shuffle reels",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-[95vw] sm:max-w-md bg-card rounded-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Manage Reels</h2>
            <p className="text-xs text-muted-foreground">Drag to reorder</p>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShuffle}
              disabled={reels.length < 2}
              title="Shuffle"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[60vh]">
          <div className="p-4 space-y-3">
            {reels.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reels yet. Add your first video!
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={reels.map((r) => r.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {reels.map((reel) => (
                      <SortableReelItem
                        key={reel.id}
                        reel={reel}
                        onToggle={handleToggle}
                        onDelete={(id) => setReelToDelete(reels.find(r => r.id === id) || null)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </ScrollArea>

        {/* Delete confirmation dialog */}
        <AlertDialog open={!!reelToDelete} onOpenChange={(open) => !open && setReelToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this reel?</AlertDialogTitle>
              <AlertDialogDescription>
                {reelToDelete?.name 
                  ? `"${reelToDelete.name}" will be permanently removed. This action cannot be undone.`
                  : "This reel will be permanently removed. This action cannot be undone."}
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
      </div>
    </div>
  );
};

export default ManageReelsModal;