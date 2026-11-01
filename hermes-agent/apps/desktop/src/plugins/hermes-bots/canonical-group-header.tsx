import { Button, Codicon, ConfirmDialog, Input } from '@hermes/plugin-sdk'
import { useState } from 'react'

import { CanonicalGroupRoster, type CanonicalMemberPhase } from './canonical-group-activity'
import { useCanonicalGroupLabels } from './canonical-group-labels'
import type { CanonicalRoom } from './canonical-groups'

interface CanonicalGroupHeaderProps {
  busy: boolean
  canStop: boolean
  chatId?: string
  onBack?: () => void
  onDisband: () => Promise<void>
  onRename: (name: string) => void
  onStop: () => void
  phases: Map<string, CanonicalMemberPhase>
  room?: CanonicalRoom
}

export function CanonicalGroupHeader({ busy, canStop, chatId, onBack, onDisband, onRename, onStop, phases, room }: CanonicalGroupHeaderProps) {
  const labels = useCanonicalGroupLabels()
  const [renaming, setRenaming] = useState<string | null>(null)
  const [ending, setEnding] = useState(false)
  const [copied, setCopied] = useState(false)

  const rename = (name: string) => {
    setRenaming(null)

    if (name) {onRename(name)}
  }

  return <>
    <header className="flex items-center gap-2">
      {onBack && <Button onClick={onBack}>{labels.back}</Button>}
      <div className="min-w-0">
        <h2 className="text-sm font-medium">{room?.name || labels.loadingGroup}</h2>
        <CanonicalGroupRoster label={labels.members} labels={labels} members={room?.members} phases={phases} />
      </div>
      <Button disabled={busy || !canStop} onClick={onStop}>{labels.stop}</Button>
      <Button disabled={busy || !room} onClick={() => setRenaming(room?.name ?? '')}>{labels.rename}</Button>
      <Button disabled={busy || !room} onClick={() => setEnding(true)}>{labels.disband}</Button>
      {chatId && <div className="ml-auto flex min-w-0 items-center gap-1 text-[10px] text-(--ui-text-tertiary)">
        <span className="truncate font-mono">Telegram {chatId}</span>
        <Button aria-label={`${labels.copyChatId}: ${chatId}`} onClick={() => {
          void navigator.clipboard.writeText(chatId).then(() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
          }).catch(() => {})
        }} size="icon-xs" type="button" variant="ghost">
          <Codicon name={copied ? 'check' : 'copy'} size="0.65rem" />
        </Button>
      </div>}
    </header>
    {renaming !== null && <form className="flex items-center gap-2" onSubmit={event => { event.preventDefault(); rename(renaming.trim()) }}>
      <Input aria-label={labels.renameLabel} autoFocus onChange={event => setRenaming(event.target.value)} value={renaming} />
      <Button disabled={busy || !renaming.trim()} type="submit">{labels.save}</Button>
      <Button onClick={() => setRenaming(null)} type="button">{labels.cancel}</Button>
    </form>}
    {ending && <ConfirmDialog busyLabel={labels.disbanding} confirmLabel={labels.disband}
      description={<span>{labels.disbandDescPrefix}<span className="font-medium text-foreground">{room?.name}</span>{labels.disbandDescSuffix(room?.members?.length ?? 0)}</span>}
      destructive doneLabel={labels.disbandDone} onClose={() => setEnding(false)} onConfirm={onDisband} open title={labels.disbandTitle} />}
  </>
}
