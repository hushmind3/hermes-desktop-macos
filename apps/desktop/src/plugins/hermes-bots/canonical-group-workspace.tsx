import { Button, Codicon, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
  ModelCatalogMenu, ModelMenuCloseContext, type ModelMenuController, reasoningEffortLabel } from '@hermes/plugin-sdk'
import { useEffect, useRef, useState } from 'react'

import { type CanonicalDriverActivity, CanonicalGroupRoster, CanonicalGroupWorkingLine, canonicalMemberPhases } from './canonical-group-activity'
import { CanonicalGroupAttachments } from './canonical-group-attachments'
import { CanonicalGroupDeleteButton } from './canonical-group-delete'
import { type CanonicalGroupEvent, CanonicalGroupHistory } from './canonical-group-history'
import { useCanonicalGroupLabels } from './canonical-group-labels'
import { forgetCanonicalGroup } from './canonical-group-registry'
import { prepareCanonicalGroupSend, readCanonicalGroupSend, retireCanonicalGroupSend } from './canonical-group-send'
import type { PreparedCanonicalGroupSend } from './canonical-group-send'
import { actCanonicalGroup, canonicalGroupRequest } from './canonical-groups'
import type { CanonicalGroupBinding, CanonicalPendingAction, CanonicalRoom } from './canonical-groups'
import { GroupMentionInput } from './group-chat-parts'

type RoomEvent = CanonicalGroupEvent
interface Attachment { attachment_id?: string; event_id?: string; kind: string; name: string; mime: string; size?: number }
interface GroupModelValue { model: string; provider: string; effort?: string }
interface RoomModel extends GroupModelValue { revision: string }
interface RoomState { room: CanonicalRoom; model_selection?: RoomModel | null; driver_status?: CanonicalDriverActivity & { pending_actions?: CanonicalPendingAction[] } }

const sameGroupPayload = (payload: Record<string, unknown>, text: string, attachments: Attachment[]) =>
  payload.text === text && JSON.stringify(payload.attachments ?? []) === JSON.stringify(attachments)

/** Same searchable model/thinking menu as the normal composer; only the write target differs. */
function GroupModelMenu({ binding, value, onChange, disabled, label, inheritLabel }: {
  binding: CanonicalGroupBinding; value: GroupModelValue; onChange: (value: GroupModelValue) => void
  disabled: boolean; label: string; inheritLabel: string
}) {
  const [open, setOpen] = useState(false)
  const controller: ModelMenuController = {
    allowSpeed: false,
    current: { model: value.model, provider: value.provider, effort: value.effort ?? '', fast: false },
    presetFor: () => ({}),
    select: (model, provider) => onChange({ ...value, model, provider }),
    applyPreset: (preset, row) => onChange({ ...row, effort: preset.effort ?? value.effort ?? '' }),
    setOptions: (patch, row) => onChange({ model: row.model, provider: row.provider,
      effort: patch.effort ?? value.effort ?? '' }),
  }
  return <DropdownMenu open={open} onOpenChange={setOpen}>
    <DropdownMenuTrigger asChild>
      <Button aria-label={label} className="h-8 min-w-0 shrink gap-1 px-2 text-xs font-normal" disabled={disabled} type="button" variant="ghost">
        <span className="truncate">{value.model || inheritLabel}</span>
        {value.effort && <span className="shrink-0 text-(--ui-text-tertiary)">· {reasoningEffortLabel(value.effort)}</span>}
        <Codicon className="shrink-0" name="chevron-down" size="0.75rem" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" side="top" className="p-0">
      <ModelMenuCloseContext.Provider value={() => setOpen(false)}>
        <ModelCatalogMenu controller={controller} ownerConnectionId={binding.connectionId} profile={binding.profile}
          request={<T,>(method: string, params?: Record<string, unknown>) => canonicalGroupRequest<T>(binding, method, params ?? {})} />
      </ModelMenuCloseContext.Provider>
    </DropdownMenuContent>
  </DropdownMenu>
}

export function CanonicalGroupWorkspace({ binding, visible = true, onBack }: {
  binding: CanonicalGroupBinding; visible?: boolean; onBack?: () => void
}) {
  // Remount on identity changes: old polls and pending confirmations never cross rooms.
  return <CanonicalRoomView binding={binding} key={JSON.stringify([binding.connectionId, binding.profile, binding.roomId])} onBack={onBack} visible={visible} />
}

function CanonicalRoomView({ binding: initialBinding, visible, onBack }: {
  binding: CanonicalGroupBinding; visible: boolean; onBack?: () => void
}) {
  const [binding] = useState(() => ({ ...initialBinding }))
  const labels = useCanonicalGroupLabels()
  const [state, setState] = useState<RoomState | null>(null)
  const [events, setEvents] = useState<RoomEvent[]>([])
  const [error, setError] = useState('')
  const [readError, setReadError] = useState('')
  const [draft, setDraft] = useState('')
  const [modelDraft, setModelDraft] = useState<GroupModelValue | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploading, setUploading] = useState(false)
  const [restored, setRestored] = useState(false)
  const [pending, setPending] = useState<PreparedCanonicalGroupSend | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const busyRef = useRef(false)
  const alive = useRef(true)
  const [discard, setDiscard] = useState<CanonicalPendingAction | null>(null)
  const revision = useRef(0)
  // This window's typed draft while it sends the room's one pending intent another window prepared.
  const heldDraft = useRef<{ text: string; attachments: Attachment[] } | null>(null)

  // eslint-disable-next-line no-restricted-syntax -- journal hydration and mounted lifetime, not a reactive store mirror
  useEffect(() => {
    alive.current = true
    let cancelled = false
    void readCanonicalGroupSend(binding).then(entry => {
      if (cancelled) {return}

      if (entry) {
        setPending(entry)
        setDraft(String(entry.params.payload.text ?? ''))
        setAttachments((entry.params.payload.attachments as Attachment[] | undefined) ?? [])
      }

      setRestored(true)
    }).catch(e => { if (!cancelled) {setError(e instanceof Error ? e.message : String(e))} })

    return () => { cancelled = true; alive.current = false; revision.current++ }
  }, [binding])

  const refresh = async () => {
    const version = ++revision.current
    const snapshot = await canonicalGroupRequest<RoomState>(binding, 'groups.state', { room_id: binding.roomId, include_disbanded: true })
    if (snapshot.room.disbanded_at != null) {
      if (alive.current && version === revision.current) {
        forgetCanonicalGroup(binding)
        setDeleted(true)
      }
      return
    }
    const log: RoomEvent[] = []
    let cursor = 0

    for (;;) {
      const page = await canonicalGroupRequest<{ events: RoomEvent[]; has_more?: boolean; next_seq?: number }>(binding, 'groups.log', { room_id: binding.roomId, since_seq: cursor, limit: 100 })
      log.push(...page.events)

      if (!page.has_more) {break}
      const next = page.events.at(-1)?.seq

      if (!next || next <= cursor) {throw new Error(labels.invalidLogCursor)}
      cursor = next
    }

    if (alive.current && version === revision.current) {
      setState(snapshot)
      setEvents(log)
      setReadError('')
    }
  }

  useEffect(() => {
    if (!visible || deleted) {return}
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const poll = async () => {
      try { await refresh() } catch (e) { if (!cancelled) {setReadError(String(e instanceof Error ? e.message : e))} }

      if (!cancelled) {timer = setTimeout(() => void poll(), 2000)}
    }

    void poll()

    return () => { cancelled = true; revision.current++; clearTimeout(timer) }
    // The keyed parent freezes the authority binding for this lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, deleted])

  const mutate = async (operation: () => Promise<unknown>) => {
    if (busyRef.current) {return}
    busyRef.current = true
    setBusy(true)
    setError('')

    try { await operation();

 if (alive.current) {await refresh()} }
    catch (e) { if (alive.current) {setError(e instanceof Error ? e.message : String(e))} }
    finally {
      busyRef.current = false

      if (alive.current) {setBusy(false)}
    }
  }

  const send = () => {
    if (!restored || busyRef.current || uploading || !state?.driver_status || (!pending && !draft.trim() && !attachments.length)) {return}
    void mutate(async () => {
      const exact = pending ?? await prepareCanonicalGroupSend(binding, { text: draft, attachments })

      if (!alive.current) {return}

      // Another window won the room's slot: send its intent first, keep this window's words.
      if (!pending && !sameGroupPayload(exact.params.payload, draft, attachments)) {
        heldDraft.current = { text: draft, attachments }
      }

      setPending(exact)
      setDraft(String(exact.params.payload.text ?? ''))
      setAttachments((exact.params.payload.attachments as Attachment[] | undefined) ?? [])
      await canonicalGroupRequest(exact.binding, 'groups.send', exact.params)
      await retireCanonicalGroupSend(exact.binding, exact.params.event_id)

      if (alive.current) {
        const held = heldDraft.current
        heldDraft.current = null
        setPending(null)
        setDraft(held?.text ?? '')
        setAttachments(held?.attachments ?? [])
      }
    })
  }

  const act = (action: CanonicalPendingAction, choice?: 'once' | 'deny') =>
    mutate(() => actCanonicalGroup(binding, action, choice))

  const composerLocked = !restored || busy || !!pending
  const phases = canonicalMemberPhases(state?.driver_status)
  const modelValue: GroupModelValue = modelDraft ?? state?.model_selection ?? { model: '', provider: '', effort: '' }

  if (deleted) {return <section className="grid gap-2 p-4" role="status">
    <p>{labels.roomDisbanded}</p>
    {onBack && <Button onClick={onBack} variant="ghost">{labels.back}</Button>}
  </section>}

  return <section className="flex h-full min-h-0 flex-col">
    <header className="flex items-center gap-2 border-b border-(--ui-stroke-secondary) px-4 py-3">
      {onBack && <Button variant="ghost" onClick={onBack}>{labels.back}</Button>}
      <div className="min-w-0">
        <h2 className="text-sm font-medium">{state?.room.name || labels.loadingGroup}</h2>
        <CanonicalGroupRoster label={labels.members} labels={labels} members={state?.room.members} phases={phases} />
      </div>
      <Button className="ml-auto shrink-0" variant="ghost" disabled={busy || !state?.driver_status} onClick={() => void mutate(() => canonicalGroupRequest(binding, 'groups.stop', { room_id: binding.roomId, cancel_id: crypto.randomUUID() }))}>{labels.stop}</Button>
      <CanonicalGroupDeleteButton binding={{ ...binding, roomName: state?.room.name || binding.roomName }} disabled={busy}
        onDeleted={target => { forgetCanonicalGroup(target); setDeleted(true) }} />
    </header>
    {readError && <div role="alert">{readError}<Button onClick={() => void refresh().catch(e => setReadError(String(e)))}>{labels.refresh}</Button></div>}
    {error && <div role="alert">{error}</div>}
    {state && !state.driver_status && <p>{labels.driverUnavailable}</p>}
    <div className="min-h-0 flex-1 overflow-auto px-4 py-3" role="log">
      <CanonicalGroupHistory binding={binding} disabled={!visible} events={events} members={state?.room.members} />
      <CanonicalGroupWorkingLine driver={state?.driver_status} labels={labels} members={state?.room.members} phases={phases} />
    </div>
    {(state?.driver_status?.pending_actions || []).map(action => <div className="flex items-center gap-2" key={`${action.kind}:${action.task_id}:${action.execution_generation}`}>
      <span>{action.member_id}</span>
      {action.kind === 'discard' && <Button disabled={busy} onClick={() => setDiscard({ ...action })}>{labels.discard}</Button>}
      {action.kind === 'retry' && <Button disabled={busy} onClick={() => void act({ ...action })}>{labels.retry}</Button>}
      {action.kind === 'approval' && <><Button disabled={busy} onClick={() => void act({ ...action }, 'once')}>{labels.allowOnce}</Button><Button disabled={busy} onClick={() => void act({ ...action }, 'deny')}>{labels.deny}</Button></>}
    </div>)}
    {discard && <div aria-label={labels.discardUnknown} role="alertdialog">
      <p>{labels.discardWarning}</p>
      <Button disabled={busy} onClick={() => { const exact = discard; setDiscard(null); void act(exact) }}>{labels.confirmDiscard}</Button>
      <Button onClick={() => setDiscard(null)}>{labels.cancel}</Button>
    </div>}
    {pending && <p role="status">{labels.restoredPendingSend}</p>}
    <form className="mx-4 mb-4 rounded-xl border border-(--ui-stroke-secondary) bg-(--ui-bg-elevated) shadow-sm" onSubmit={event => { event.preventDefault(); send() }}>
      <div className="px-3 py-2">
        <GroupMentionInput aria-label={labels.groupMessage} className="border-0 bg-transparent shadow-none focus-visible:ring-0" disabled={composerLocked}
          members={(state?.room.members ?? []).map(member => ({ name: member.profile, handle: member.handle,
            display_name: member.display_name, connectionId: binding.connectionId }))}
          onChange={setDraft} onSubmitDraft={send} value={draft} />
      </div>
      <div className="flex min-w-0 items-center gap-1 border-t border-(--ui-stroke-secondary) px-2 py-2">
      <CanonicalGroupAttachments attachments={attachments} binding={binding} disabled={composerLocked} onChange={setAttachments} onUploadingChange={setUploading} />
      <GroupModelMenu binding={binding} disabled={busy} value={modelValue} onChange={setModelDraft} label={labels.groupModel} inheritLabel={labels.inheritedModels} />
      {modelDraft && <Button className="h-8 shrink-0 px-2 text-xs" variant="ghost" disabled={busy || !modelDraft.model.trim()} onClick={() => void mutate(async () => {
        await canonicalGroupRequest(binding, 'groups.model', {
          room_id: binding.roomId, model: modelValue.model, provider: modelValue.provider,
          effort: modelValue.effort ?? '',
          request_id: crypto.randomUUID(),
        })
        if (alive.current) {setModelDraft(null)}
      })}>{labels.applyModel}</Button>}
      <div className="flex-1" />
      <Button className="h-8 w-8 shrink-0 p-0" aria-label={pending ? labels.retry : labels.send} disabled={!restored || busy || uploading || (!pending && !draft.trim() && !attachments.length) || !state?.driver_status} type="submit"><Codicon name={pending ? 'refresh' : 'arrow-up'} size="1rem" /></Button>
      </div>
    </form>
  </section>
}
