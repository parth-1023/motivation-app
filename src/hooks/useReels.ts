import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadToCloudinary } from "@/lib/cloudinary";

export interface Reel {
  id: string;
  videoUrl: string;
  name: string | null;
  visible: boolean;
  position: number;
}

export const useReels = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch reels from database
  const fetchReels = async () => {
    const { data, error } = await supabase
      .from("reels")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      console.error("Error fetching reels:", error);
      return;
    }

    setReels(
      data.map((reel) => ({
        id: reel.id,
        videoUrl: reel.video_url,
        name: reel.name,
        visible: reel.visible,
        position: reel.position,
      }))
    );
    setIsLoading(false);
  };

  // Upload video to Cloudinary and save to database
  const addReel = async (file: File, name: string): Promise<boolean> => {
    setIsUploading(true);
    try {
      // Upload to Cloudinary
      const { url, publicId } = await uploadToCloudinary(file);

      // Get max position
      const maxPosition = reels.length > 0 ? Math.max(...reels.map(r => r.position)) : 0;

      // Save to database
      const { error } = await supabase.from("reels").insert({
        video_url: url,
        cloudinary_public_id: publicId,
        name: name || null,
        visible: true,
        position: maxPosition + 1,
      });

      if (error) {
        console.error("Error saving reel:", error);
        return false;
      }

      // Refresh reels list
      await fetchReels();
      return true;
    } catch (error) {
      console.error("Error uploading reel:", error);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete a reel from the database
  const deleteReel = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("reels").delete().eq("id", id);

    if (error) {
      console.error("Error deleting reel:", error);
      return false;
    }

    await fetchReels();
    return true;
  };

  // Toggle reel visibility
  const toggleReelVisibility = async (id: string, visible: boolean): Promise<boolean> => {
    const { error } = await supabase
      .from("reels")
      .update({ visible })
      .eq("id", id);

    if (error) {
      console.error("Error updating reel visibility:", error);
      return false;
    }

    await fetchReels();
    return true;
  };

  // Reorder reels by swapping positions
  const reorderReels = async (reelId: string, direction: 'up' | 'down'): Promise<boolean> => {
    const currentIndex = reels.findIndex(r => r.id === reelId);
    if (currentIndex === -1) return false;
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= reels.length) return false;

    const currentReel = reels[currentIndex];
    const targetReel = reels[targetIndex];

    // Swap positions in database
    const { error: error1 } = await supabase
      .from("reels")
      .update({ position: targetReel.position })
      .eq("id", currentReel.id);

    const { error: error2 } = await supabase
      .from("reels")
      .update({ position: currentReel.position })
      .eq("id", targetReel.id);

    if (error1 || error2) {
      console.error("Error reordering reels:", error1 || error2);
      return false;
    }

    await fetchReels();
    return true;
  };

  // Reorder reels by moving one item to a new position (for drag-and-drop)
  const moveReel = async (activeId: string, overId: string): Promise<boolean> => {
    const oldIndex = reels.findIndex(r => r.id === activeId);
    const newIndex = reels.findIndex(r => r.id === overId);
    
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return false;

    // Create new order
    const newReels = [...reels];
    const [movedReel] = newReels.splice(oldIndex, 1);
    newReels.splice(newIndex, 0, movedReel);

    // Update all positions
    const updates = newReels.map((reel, index) => 
      supabase.from("reels").update({ position: index + 1 }).eq("id", reel.id)
    );

    const results = await Promise.all(updates);
    const hasError = results.some(r => r.error);

    if (hasError) {
      console.error("Error reordering reels");
      return false;
    }

    await fetchReels();
    return true;
  };

  // Shuffle all reels randomly
  const shuffleReels = async (): Promise<boolean> => {
    if (reels.length < 2) return false;

    // Fisher-Yates shuffle
    const shuffled = [...reels];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Update all positions
    const updates = shuffled.map((reel, index) => 
      supabase.from("reels").update({ position: index + 1 }).eq("id", reel.id)
    );

    const results = await Promise.all(updates);
    const hasError = results.some(r => r.error);

    if (hasError) {
      console.error("Error shuffling reels");
      return false;
    }

    await fetchReels();
    return true;
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Get only visible reels for the feed
  const visibleReels = reels.filter((reel) => reel.visible);

  return { reels, visibleReels, isLoading, isUploading, addReel, deleteReel, toggleReelVisibility, reorderReels, moveReel, shuffleReels, fetchReels };
};
