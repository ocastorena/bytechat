"use client"

import { Plus, X } from "lucide-react"
import { useState } from "react"
import { CreatePostForm } from "@/components/create-post-form"

/** Floating action button for mobile compose — opens a bottom sheet */
export function ComposeButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* FAB — visible on mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center active:scale-95"
        aria-label="New post">
        <Plus size={22} strokeWidth={2.5} />
      </button>

      {/* Bottom sheet overlay */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-3xl p-4 pb-8 animate-slide-up-sheet">
            {/* Drag handle */}
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">New post</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <CreatePostForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
