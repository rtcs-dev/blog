"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"
import { useStore, type StoreApi } from "zustand"

import {
  createEditorStore,
  type EditorStore,
} from "@/stores/editor-store"

export const EditorStoreContext = createContext<StoreApi<EditorStore> | null>(
  null
)

export function EditorStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreApi<EditorStore> | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createEditorStore()
  }

  return (
    <EditorStoreContext.Provider value={storeRef.current}>
      {children}
    </EditorStoreContext.Provider>
  )
}

export function useEditorStore<T>(selector: (store: EditorStore) => T): T {
  const context = useContext(EditorStoreContext)
  if (!context) {
    throw new Error("useEditorStore must be used within EditorStoreProvider")
  }
  return useStore(context, selector)
}
