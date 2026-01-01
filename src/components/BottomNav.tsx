import { Plus, Settings } from "lucide-react";

interface BottomNavProps {
  onUploadClick: () => void;
  onManageClick: () => void;
}

const BottomNav = ({ onUploadClick, onManageClick }: BottomNavProps) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-6 py-4 pointer-events-none"
      style={{
        paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <button
        onClick={onUploadClick}
        className="pointer-events-auto transition-transform active:scale-90 hover:scale-105 touch-manipulation"
        title="Add Reel"
      >
        <div className="rounded-full bg-gradient-to-br from-primary to-accent p-3 shadow-lg min-w-[52px] min-h-[52px] flex items-center justify-center">
          <Plus className="h-6 w-6 text-primary-foreground" />
        </div>
      </button>

      <button
        onClick={onManageClick}
        className="pointer-events-auto transition-transform active:scale-90 hover:scale-105 touch-manipulation"
        title="Manage Reels"
      >
        <div className="rounded-full bg-muted/80 backdrop-blur-sm p-3 shadow-lg hover:bg-muted active:bg-muted min-w-[52px] min-h-[52px] flex items-center justify-center">
          <Settings className="h-6 w-6 text-foreground" />
        </div>
      </button>
    </div>
  );
};

export default BottomNav;
