"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableListProps {
  /** Array of unique string ids in display order */
  ids: string[];
  /** Called when the user drops an item. `from` and `to` are indices. */
  onReorder: (from: number, to: number) => void;
  children: ReactNode;
}

/**
 * Generic sortable wrapper for admin lists. Wraps children in a DnD context
 * with vertical sorting strategy. Each child must be wrapped in a
 * `<SortableItem id={...}>` to participate.
 *
 * Phase 6.5 full — replaces the ↑/↓ button-only reorder with drag-and-drop.
 * ↑/↓ buttons are kept as a keyboard-accessible fallback.
 */
export function SortableList({ ids, onReorder, children }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) {
      onReorder(from, to);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

/**
 * Wraps a single draggable item. Provides a drag handle via the
 * `DragHandle` child component.
 */
export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : "auto" as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <DragHandleContext.Provider value={listeners}>
        {children}
      </DragHandleContext.Provider>
    </div>
  );
}

/**
 * A grab handle that activates dragging. Place this inside a SortableItem.
 */
export function DragHandle({ className }: { className?: string }) {
  const listeners = useDragHandleContext();

  return (
    <button
      type="button"
      {...listeners}
      aria-label="Drag to reorder"
      className={`cursor-grab touch-none active:cursor-grabbing ${className ?? ""}`}
    >
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" className="text-[color:var(--surface-graphite)]">
        <circle cx="3" cy="3" r="1.5" />
        <circle cx="9" cy="3" r="1.5" />
        <circle cx="3" cy="8" r="1.5" />
        <circle cx="9" cy="8" r="1.5" />
        <circle cx="3" cy="13" r="1.5" />
        <circle cx="9" cy="13" r="1.5" />
      </svg>
    </button>
  );
}

/* ---------- Context for passing drag listeners to DragHandle ---------- */

import { createContext, useContext } from "react";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const DragHandleContext = createContext<SyntheticListenerMap | undefined>(
  undefined,
);

function useDragHandleContext() {
  return useContext(DragHandleContext);
}
