# 🚀 Motivational Reels

A dynamic, TikTok-style motivational video feed designed to keep you inspired. Built with **Lovable**, **React**, **Supabase**, and **Cloudinary**, this app allows you to curate, manage, and interact with a personalized stream of high-energy content.



---

## ✨ Features

* **🎬 Add Reels:** Seamlessly upload motivational videos with custom metadata.
* **🗑️ Smart Management:** Delete reels you no longer need with a safety confirmation dialog.
* **👁️ Toggle Visibility:** Instantly hide reels from your feed without permanent deletion.
* **👋 Drag & Drop:** Intuitive reordering of your video library using `dnd-kit`.
* **🔀 Shuffle Mode:** Randomize your feed with a single click for a fresh perspective.
* **📱 TikTok-Style Feed:** Immerse yourself in a familiar vertical scroll experience.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **Interactions:** [dnd-kit](https://dnd-kit.com/) for Drag & Drop

### Backend & Storage
* **Database & Auth:** [Supabase](https://supabase.com/)
* **Video Hosting:** [Cloudinary](https://cloudinary.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account
- A Cloudinary account

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/motivational-reels.git](https://github.com/your-username/motivational-reels.git)
   cd motivational-reels
   ```
2. **Install dependencies:**
```bash
npm install
```
3. **Environment Variables Create a .env file in the root directory and add your credentials:**  
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

4. **Start the development server:**
```bash
npm run dev
```
