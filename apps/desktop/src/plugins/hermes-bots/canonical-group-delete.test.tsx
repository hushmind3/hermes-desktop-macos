import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { atom } from 'nanostores'
import type { ComponentProps } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const request = vi.hoisted(() => vi.fn())
vi.mock('@hermes/plugin-sdk', async () => {
  const { pluginSdkMock, createGroupGateway } = await import('./group-test-utils')
  const gateway = createGroupGateway()
  const { en } = await import('@/i18n/en')
  const { CANONICAL_GROUP_LOCALES } = await import('./canonical-group-locales')

  return {
    ...await pluginSdkMock(gateway.host),
    Button: (props: ComponentProps<'button'>) => <button {...props} />,
    useI18n: () => ({ locale: 'en', t: en }),
    usePluginI18n: () => (key: string) => CANONICAL_GROUP_LOCALES.en[key.replace('canonical.', '') as keyof typeof CANONICAL_GROUP_LOCALES.en] ?? key,
    host: { ...gateway.host, requestProfile: request, state: {
      ...(gateway.host.state as Record<string, unknown>), connectionId: atom<string | null>('remote-mac'), profile: atom('albedo')
    } }
  }
})

import { CanonicalGroupDeleteButton } from './canonical-group-delete'
import { $canonicalGroupBindings, CanonicalGroupList, registerCanonicalGroup } from './canonical-group-registry'
import { CanonicalGroupWorkspace } from './canonical-group-workspace'

const binding = { connectionId: 'remote-mac', profile: 'albedo', roomId: 'room-original', roomName: 'Review' }
const room = { room_id: binding.roomId, name: binding.roomName, members: [] }
const originalDesktop = window.hermesDesktop
beforeEach(() => {
  request.mockReset()
  $canonicalGroupBindings.set({})
  window.hermesDesktop = undefined as unknown as typeof window.hermesDesktop
})
afterEach(() => {
  cleanup()
  localStorage.clear()
  window.hermesDesktop = originalDesktop
})

it('names the group and explains the shared deletion before making any request', async () => {
  const onDeleted = vi.fn()
  render(<CanonicalGroupDeleteButton binding={binding} onDeleted={onDeleted} />)
  fireEvent.click(screen.getByRole('button', { name: 'Delete Review' }))
  const dialog = await screen.findByRole('dialog', { name: 'Delete group chat?' })
  expect(within(dialog).getByText('Review')).toBeTruthy()
  expect(dialog.textContent).toContain('every device')
  expect(dialog.textContent).toContain('personal conversations are kept')
  expect(request).not.toHaveBeenCalled()
  fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  expect(request).not.toHaveBeenCalled()
  expect(onDeleted).not.toHaveBeenCalled()
})

it('keeps failures visible and retries the same frozen owner and cancellation id', async () => {
  const onDeleted = vi.fn()
  let complete!: (value: unknown) => void
  request.mockRejectedValueOnce(new Error('Stop not acknowledged'))
    .mockImplementationOnce(() => new Promise(resolve => { complete = resolve }))
  const view = render(<CanonicalGroupDeleteButton binding={binding} onDeleted={onDeleted} />)
  fireEvent.click(screen.getByRole('button', { name: 'Delete Review' }))
  const dialog = await screen.findByRole('dialog')
  view.rerender(<CanonicalGroupDeleteButton binding={{ ...binding, connectionId: 'another-server', roomId: 'other-room' }} onDeleted={onDeleted} />)
  fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }))
  await within(dialog).findByText('Stop not acknowledged')
  expect(onDeleted).not.toHaveBeenCalled()
  const confirm = within(dialog).getByRole('button', { name: 'Delete' })
  fireEvent.click(confirm)
  await waitFor(() => expect((confirm as HTMLButtonElement).disabled).toBe(true))
  fireEvent.click(confirm)
  expect(request).toHaveBeenCalledTimes(2)
  await act(async () => { complete({ tombstone: { room_id: binding.roomId } }) })
  expect(onDeleted).toHaveBeenCalledExactlyOnceWith(binding)
  for (const call of request.mock.calls) {
    expect(call[0]).toMatchObject({ connectionId: binding.connectionId, profile: binding.profile, targetProfile: binding.profile, mode: 'remote' })
    expect(call[1]).toBe('groups.disband')
    expect(call[2]).toEqual({ room_id: binding.roomId, profile: binding.profile, cancel_id: expect.any(String) })
  }
  expect(request.mock.calls[0][2].cancel_id).toBe(request.mock.calls[1][2].cancel_id)
})

it('removes the acknowledged room and its source aliases while preserving other servers', async () => {
  const foreign = registerCanonicalGroup({ connectionId: 'another-server', profile: binding.profile }, room)
  const alias = registerCanonicalGroup({ connectionId: binding.connectionId, profile: 'default' }, room)
  let deleted = false
  request.mockImplementation(async (_route, method) => {
    if (method === 'groups.capabilities') {return { driver: true }}
    if (method === 'groups.list') {return { rooms: deleted ? [] : [room], next_offset: null }}
    if (method === 'groups.disband') {deleted = true; return { tombstone: { room_id: binding.roomId } }}
    throw new Error(`Unexpected RPC: ${method}`)
  })
  const view = render(<CanonicalGroupList onOpen={vi.fn()} />)
  await screen.findByRole('button', { name: 'Review' })
  fireEvent.click(screen.getByRole('button', { name: 'Delete Review' }))
  fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Delete' }))
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Review' })).toBeNull())
  expect($canonicalGroupBindings.get()[alias]).toBeUndefined()
  expect($canonicalGroupBindings.get()[foreign]).toBeTruthy()
  view.unmount()
  render(<CanonicalGroupList onOpen={vi.fn()} />)
  await waitFor(() => expect(request.mock.calls.filter(call => call[1] === 'groups.list').length).toBeGreaterThanOrEqual(2))
  expect(screen.queryByRole('button', { name: 'Review' })).toBeNull()
  expect(request.mock.calls.filter(call => call[1] === 'groups.disband')).toHaveLength(1)
})

it('recognizes a room deleted on the other device without loading or sending more messages', async () => {
  request.mockImplementation(async (_route, method) => {
    if (method === 'groups.state') {return { room: { ...room, disbanded_at: 1 } }}
    throw new Error(`Unexpected RPC: ${method}`)
  })
  render(<CanonicalGroupWorkspace binding={binding} />)
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Group disbanded'))
  expect(screen.queryByRole('textbox')).toBeNull()
  expect(request.mock.calls.every(call => call[1] === 'groups.state')).toBe(true)
  expect(request.mock.calls[0][2]).toEqual({ room_id: binding.roomId, profile: binding.profile, include_disbanded: true })
})
