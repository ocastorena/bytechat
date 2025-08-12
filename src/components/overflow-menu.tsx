"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type OverflowMenuProps = {
  /** The post id this menu controls */
  postId: string
  /** Whether the currently signed-in user owns this post */
  isOwnPost: boolean
  /** Called when user confirms delete */
  onDelete?: (postId: string) => void
  /** Optional edit handler (hidden if not provided) */
  onEdit?: (postId: string) => void
  /** Optional: extra items to render at the top of the menu */
  leadingItems?: React.ReactNode
  className?: string
}

/**
 * Overflow (⋯) menu for a post. Renders Delete only for the owner.
 * Includes a built-in confirm dialog for Delete.
 */
export default function OverflowMenu({
  postId,
  isOwnPost,
  onDelete,
  onEdit,
  leadingItems,
  className,
}: OverflowMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className={className} data-testid="overflow-menu">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open post actions"
            data-testid="overflow-trigger">
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} className="w-40">
          {leadingItems}
          {leadingItems ? <DropdownMenuSeparator /> : null}

          {onEdit ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                onEdit?.(postId)
              }}
              data-testid="menu-edit">
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          ) : null}

          {isOwnPost && onDelete ? (
            <>
              {onEdit ? <DropdownMenuSeparator /> : null}
              {/* Use AlertDialog to confirm destructive action */}
              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      // keep menu from closing before AlertDialog opens
                      e.preventDefault()
                      setConfirmOpen(true)
                    }}
                    variant="destructive"
                    data-testid="menu-delete">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The post will be permanently
                      removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete?.(postId)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
