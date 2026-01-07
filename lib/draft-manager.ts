export interface Draft {
  id: string
  name: string
  content: string
  createdAt: number
  updatedAt: number
  isPinned: boolean
}

const DRAFTS_STORAGE_KEY = "markdown-drafts"
const CURRENT_DRAFT_KEY = "current-draft-id"

export function getDrafts(): Draft[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem(DRAFTS_STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

export function getCurrentDraftId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CURRENT_DRAFT_KEY)
}

export function setCurrentDraftId(id: string | null) {
  if (typeof window === "undefined") return
  if (id) {
    localStorage.setItem(CURRENT_DRAFT_KEY, id)
  } else {
    localStorage.removeItem(CURRENT_DRAFT_KEY)
  }
}

export function createDraft(content: string, name?: string): Draft {
  const now = Date.now()
  const draft: Draft = {
    id: now.toString(),
    name: name || `Draft ${new Date(now).toLocaleDateString()}`,
    content,
    createdAt: now,
    updatedAt: now,
    isPinned: false,
  }

  const drafts = getDrafts()
  drafts.push(draft)
  saveDrafts(drafts)
  setCurrentDraftId(draft.id)

  return draft
}

export function updateDraft(id: string, updates: Partial<Draft>) {
  const drafts = getDrafts()
  const index = drafts.findIndex((d) => d.id === id)
  if (index !== -1) {
    drafts[index] = {
      ...drafts[index],
      ...updates,
      updatedAt: Date.now(),
    }
    saveDrafts(drafts)
  }
}

export function deleteDraft(id: string) {
  const drafts = getDrafts().filter((d) => d.id !== id)
  saveDrafts(drafts)

  const currentId = getCurrentDraftId()
  if (currentId === id) {
    setCurrentDraftId(null)
  }
}

export function togglePinDraft(id: string) {
  const drafts = getDrafts()
  const draft = drafts.find((d) => d.id === id)
  if (draft) {
    draft.isPinned = !draft.isPinned
    saveDrafts(drafts)
  }
}

export function renameDraft(id: string, newName: string) {
  updateDraft(id, { name: newName })
}

function saveDrafts(drafts: Draft[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts))
}

export function getDraftById(id: string): Draft | undefined {
  return getDrafts().find((d) => d.id === id)
}

export function getPinnedDrafts(): Draft[] {
  return getDrafts()
    .filter((d) => d.isPinned)
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getAllDraftsSorted(): Draft[] {
  return getDrafts().sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return b.isPinned ? 1 : -1
    }
    return b.updatedAt - a.updatedAt
  })
}
