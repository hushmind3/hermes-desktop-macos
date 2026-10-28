import { Button, Codicon, ConfirmDialog } from '@hermes/plugin-sdk'
import { useRef, useState } from 'react'

import { useCanonicalGroupLabels } from './canonical-group-labels'
import { canonicalGroupRequest, type CanonicalGroupBinding } from './canonical-groups'

interface CanonicalGroupDeleteButtonProps {
  binding: CanonicalGroupBinding
  disabled?: boolean
  onDeleted: (deleted: CanonicalGroupBinding) => void
}

/** Delete the shared room on its owner, never an individual bot's sessions. */
export function CanonicalGroupDeleteButton({ binding, disabled = false, onDeleted }: CanonicalGroupDeleteButtonProps) {
  const labels = useCanonicalGroupLabels()
  const [target, setTarget] = useState<CanonicalGroupBinding | null>(null)
  const cancelId = useRef('')

  return <>
    <Button aria-label={`${labels.deleteGroup} ${binding.roomName || binding.roomId}`}
      className="shrink-0 gap-1 text-destructive" disabled={disabled} type="button" variant="ghost"
      onClick={() => { cancelId.current = crypto.randomUUID(); setTarget({ ...binding }) }}>
      <Codicon name="trash" size="0.875rem" />
      {labels.deleteGroup}
    </Button>
    <ConfirmDialog open={target !== null} onClose={() => setTarget(null)} destructive
      title={labels.deleteGroupTitle} confirmLabel={labels.deleteGroup} doneLabel={labels.roomDisbanded}
      description={<><strong>{target?.roomName || target?.roomId}</strong><br />{labels.deleteGroupDescription}</>}
      onConfirm={async () => {
        if (!target) {return}
        await canonicalGroupRequest(target, 'groups.disband', { room_id: target.roomId, cancel_id: cancelId.current })
        onDeleted(target)
      }} />
  </>
}
