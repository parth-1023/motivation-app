import { useRef, useState, useEffect } from "react";
import ReelCard from "./ReelCard";

interface Reel {
  id: string;
  videoUrl: string;
  name: string | null;
}

interface ReelsFeedProps {
  reels: Reel[];
  onDelete?: (id: string) => void;
}

const ReelsFeed = ({ reels, onDelete }: ReelsFeedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const newIndex = Math.round(scrollTop / height);
      
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reels.length) {
        setActiveIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, reels.length]);

  if (reels.length === 0) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
        <div className="text-center px-8">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <span className="text-3xl">🎬</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">No Reels Yet</h2>
          <p className="text-muted-foreground">
            Add your first motivational reel to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide touch-manipulation overscroll-contain"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {reels.map((reel, index) => (
        <ReelCard
          key={reel.id}
          videoUrl={reel.videoUrl}
          name={reel.name}
          isActive={index === activeIndex}
          onDelete={onDelete ? () => onDelete(reel.id) : undefined}
        />
      ))}
    </div>
  );
};

export default ReelsFeed;
