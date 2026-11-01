/**
 * 모든 봇 모델 일괄 변경 — 한 번의 클릭으로 모든 Hermes 봇 프로필의
 * 기본 모델을 같은 모델로 맞추고, 게이트웨이를 다시 시작해 실행 중인 봇에 반영한다.
 *
 * UI: 사이드바의 "모든 봇 모델" 페이지 + ⌘K 팔레트 명령.
 * 쓰기: profiles.configure (프로필 기본 모델) → host.restartGateway().
 */
import {
  Button,
  PALETTE_AREA,
  ROUTES_AREA,
  SIDEBAR_NAV_AREA,
  host
} from '@hermes/plugin-sdk'
import { jsx, jsxs } from 'react/jsx-runtime'
import { useEffect, useMemo, useState } from 'react'

const ID = 'all-bots-model'
const PATH = '/all-bots-model'
const PRESETS = [
  { model: 'reflection/beam-1.0-501b-a23b:free', provider: 'nous', label: 'Beam 1.0 (추천)' },
  { model: 'stepfun/step-3.7-flash:free', provider: 'nous', label: 'Step 3.7 Flash' },
  { model: 'upstage/solar-mini4:free', provider: 'nous', label: 'Solar Mini4' }
]

const REASONING_LEVELS = [
  { value: '', label: '변경 안 함' },
  { value: 'minimal', label: '최소' },
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
  { value: 'xhigh', label: '매우 높음' },
  { value: 'max', label: '최대' },
  { value: 'ultra', label: '최상' }
]

const card = {
  border: '1px solid var(--ui-stroke-secondary)',
  borderRadius: '12px',
  padding: '16px',
  background: 'var(--ui-bg-elevated)',
  display: 'grid',
  gap: '12px'
}
const row = { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }
const muted = { color: 'var(--ui-text-tertiary)', fontSize: '12px', lineHeight: '1.5' }
const mono = { fontFamily: 'var(--ui-font-mono, ui-monospace, monospace)', fontSize: '12px' }
const field = {
  border: '1px solid var(--ui-stroke-secondary)',
  borderRadius: '8px',
  padding: '8px 10px',
  background: 'transparent',
  color: 'inherit'
}

function AllBotsModelPage() {
  const [profiles, setProfiles] = useState([])
  const [models, setModels] = useState([])
  const [provider, setProvider] = useState('nous')
  const [model, setModel] = useState(PRESETS[0].model)
  const [query, setQuery] = useState('')
  const [providerFilter, setProviderFilter] = useState('')
  const [selected, setSelected] = useState({})
  const [restartAfter, setRestartAfter] = useState(false)
  const [thinking, setThinking] = useState(true)
  const [reasoning, setReasoning] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const options = useMemo(() => {
    const out = []
    const seen = new Set()

    for (const p of models) {
      for (const m of p.models || []) {
        const key = `${p.slug}|${m}`

        if (!seen.has(key)) {
          seen.add(key)
          out.push({ key, provider: p.slug, providerName: p.name || p.slug, model: m })
        }
      }
    }

    return out.sort((a, b) => a.key.localeCompare(b.key))
  }, [models])

  const providerRows = useMemo(() => {
    const rows = new Map()

    for (const option of options) {
      const row = rows.get(option.provider) || {
        slug: option.provider,
        name: option.providerName || option.provider,
        count: 0
      }
      row.count += 1
      rows.set(option.provider, row)
    }

    return [...rows.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [options])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return options.filter(option => {
      if (providerFilter && option.provider !== providerFilter) {
        return false
      }

      return !q || `${option.provider} ${option.providerName || ''} ${option.model}`.toLowerCase().includes(q)
    })
  }, [options, query, providerFilter])

  const selectedNames = profiles
    .map(profile => profile.name)
    .filter(name => name && selected[name] !== false)
  const selectedCount = selectedNames.length

  const load = async (refresh = false) => {
    setLoading(true)
    setError('')

    try {
      const [profileResult, modelResult] = await Promise.all([
        host.profiles.list(),
        host.request('model.options', { refresh }).catch(() => null)
      ])
      const baseProfiles = profileResult?.profiles || []

      // ``profiles.list`` can report an empty model for named profiles even when
      // their config is pinned (the roster cache is profile-scoped), so refresh
      // each row through ``profiles.describe`` for an accurate display.
      const profiles = await Promise.all(
        baseProfiles.map(async profile => {
          try {
            const detail = await host.request('profiles.describe', { name: profile.name })
            return {
              ...profile,
              model: detail?.model?.default || profile.model,
              provider: detail?.model?.provider || profile.provider
            }
          } catch {
            return profile
          }
        })
      )
      setProfiles(profiles)
      setSelected(prev => {
        const next = { ...prev }
        for (const profile of profiles) {
          if (profile.name && !(profile.name in next)) {
            next[profile.name] = true
          }
        }
        return next
      })

      // Seed the bulk picker from the default bot profile, not from whichever
      // session model the composer happens to be using.
      const seed = profiles.find(profile => !profile.is_default) || profiles[0]
      if (seed?.model) {
        setModel(seed.model)
      }
      if (seed?.provider) {
        setProvider(seed.provider)
      }

      if (modelResult?.providers) {
        setModels(modelResult.providers)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)

      if (/gateway_not_ready|\b503\b/.test(msg)) {
        setTimeout(() => void load(refresh), 2500)
        return
      }

      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const apply = async () => {
    if (!model.trim() || !provider.trim() || busy) {
      return
    }

    setBusy(true)
    setError('')
    setMessage('')

    const next = {}
    const names = selectedNames

    try {
      // Profiles are independent config files; fan out instead of waiting a
      // round-trip per bot (ten bots used to take twenty seconds).
      await Promise.all(
        names.map(async name => {
          next[name] = '…'
          setStatus({ ...next })

          try {
            const effort = thinking ? reasoning : 'none'
            const payload = {
              name,
              model: model.trim(),
              provider: provider.trim()
            }

            if (effort) {
              payload.reasoning_effort = effort
            }

            let result = await host.request('profiles.configure', payload)

            if (result?.confirm_required) {
              result = await host.request('profiles.configure', {
                ...payload,
                confirm_expensive_model: true
              })
            }

            next[name] = result?.ok === false ? '실패' : '완료'
          } catch (e) {
            next[name] = `실패: ${e instanceof Error ? e.message : String(e)}`
          }

          setStatus({ ...next })
        })
      )

      const okCount = names.filter(name => next[name] === '완료').length
      const failed = names.length - okCount

      // Refresh the rows first so the new model is on screen before the gateway
      // drops the RPC connection for the restart.
      await load()

      const base =
        `봇 ${okCount}개에 ${model.trim()} 적용 완료.` +
        (failed ? ` ${failed}개는 실패했습니다.` : '')

      if (restartAfter) {
        setMessage(`${base} 게이트웨이를 다시 시작하는 중…`)
        // The restart drops the renderer's RPC socket, so awaiting it can hang.
        // Fire it, release the button, and settle the copy on a timer.
        setBusy(false)
        Promise.race([
          host.restartGateway().catch(() => null),
          new Promise(resolve => setTimeout(resolve, 8000))
        ]).then(() => {
          setMessage(`${base} 게이트웨이가 다시 시작되었습니다.`)
        })
        return
      }

      setMessage(`${base} 게이트웨이를 다시 시작하면 실행 중인 봇에도 반영됩니다.`)
    } finally {
      setBusy(false)
    }
  }

  const restart = async () => {
    if (busy) {
      return
    }

    setBusy(true)
    setError('')

    try {
      setMessage('게이트웨이를 다시 시작하는 중…')
      setBusy(false)
      await Promise.race([
        host.restartGateway().catch(() => null),
        new Promise(resolve => setTimeout(resolve, 8000))
      ])
      setMessage('게이트웨이를 다시 시작했습니다. 봇들이 새 모델로 준비됩니다.')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return jsxs('div', {
    style: { padding: '28px', maxWidth: '860px', display: 'grid', gap: '18px' },
    children: [
      jsxs('div', {
        children: [
          jsx('h1', { style: { fontSize: '20px', fontWeight: 600, margin: 0 }, children: '모든 봇 모델 일괄 변경' }),
          jsx('p', {
            style: { ...muted, marginTop: '6px' },
            children:
              '모델 하나를 고르면 선택한 봇 프로필의 기본 모델을 바꿉니다. 아래에서 적용할 봇만 고를 수 있습니다.'
          })
        ]
      }),
      jsxs('div', {
        style: card,
        children: [
          jsx('div', { style: { fontWeight: 600 }, children: '모델' }),
          jsx('div', {
            style: row,
            children: PRESETS.map(preset =>
              jsx(
                Button,
                {
                  type: 'button',
                  variant:
                    model === preset.model && provider === preset.provider ? 'default' : 'ghost',
                  onClick: () => {
                    setModel(preset.model)
                    setProvider(preset.provider)
                  },
                  children: preset.label
                },
                preset.model
              )
            )
          }),
          jsxs('div', {
            style: { display: 'grid', gap: '8px' },
            children: [
              jsxs('div', {
                style: { display: 'grid', gridTemplateColumns: 'minmax(180px, 220px) 1fr', gap: '8px' },
                children: [
                  jsx('select', {
                    'aria-label': '제공업체 필터',
                    value: providerFilter,
                    onChange: event => setProviderFilter(event.target.value),
                    style: field,
                    children: [
                      jsx('option', { value: '', children: `전체 제공업체 (${options.length})` }),
                      ...providerRows.map(row =>
                        jsx(
                          'option',
                          { value: row.slug, children: `${row.name} (${row.count})` },
                          row.slug
                        )
                      )
                    ]
                  }),
                  jsx('input', {
                    'aria-label': '모델 검색',
                    value: query,
                    onChange: event => setQuery(event.target.value),
                    placeholder: '모델 검색 — 제공업체 또는 모델명',
                    style: field
                  })
                ]
              }),
              jsx('div', {
                style: {
                  maxHeight: '240px',
                  overflow: 'auto',
                  border: '1px solid var(--ui-stroke-secondary)',
                  borderRadius: '10px',
                  display: 'grid'
                },
                children: filtered.length
                  ? filtered.map(option =>
                      jsx(
                        'button',
                        {
                          type: 'button',
                          onClick: () => {
                            setProvider(option.provider)
                            setModel(option.model)
                          },
                          style: {
                            display: 'grid',
                            gap: '2px',
                            textAlign: 'left',
                            padding: '8px 10px',
                            border: 0,
                            borderBottom: '1px solid var(--ui-stroke-secondary)',
                            background:
                              option.provider === provider && option.model === model
                                ? 'var(--ui-bg-secondary)'
                                : 'transparent',
                            boxShadow:
                              option.provider === provider && option.model === model
                                ? 'inset 2px 0 0 var(--ui-accent)'
                                : 'none',
                            color: 'inherit',
                            cursor: 'pointer'
                          },
                          children: [
                            jsx('span', { style: mono, children: option.model }),
                            jsx('span', {
                              style: { ...muted, fontSize: '11px' },
                              children: option.providerName || option.provider
                            })
                          ]
                        },
                        option.key
                      )
                    )
                  : jsx('div', {
                      style: { ...muted, padding: '12px' },
                      children: options.length ? '검색 결과가 없습니다.' : '카탈로그를 불러오는 중…'
                    })
              }),
              jsxs('div', {
                style: { ...row, justifyContent: 'space-between' },
                children: [
                  jsx('span', { style: mono, children: `${provider} / ${model}` }),
                  jsx('span', {
                    style: muted,
                    children: `카탈로그 ${options.length}개 모델`
                  })
                ]
              }),
              jsxs('div', {
                style: { display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' },
                children: [
                  jsx('input', {
                    'aria-label': '제공업체 직접 입력',
                    value: provider,
                    onChange: event => setProvider(event.target.value),
                    placeholder: 'provider',
                    style: field
                  }),
                  jsx('input', {
                    'aria-label': '모델 ID 직접 입력',
                    value: model,
                    onChange: event => setModel(event.target.value),
                    placeholder: '모델 ID 직접 입력',
                    style: field
                  })
                ]
              }),
              jsxs('div', {
                style: { display: 'grid', gridTemplateColumns: 'auto 90px 1fr', gap: '8px', alignItems: 'center' },
                children: [
                  jsxs('label', {
                    style: { ...row, ...muted },
                    children: [
                      jsx('input', {
                        type: 'checkbox',
                        checked: thinking,
                        onChange: event => setThinking(event.target.checked)
                      }),
                      '생각'
                    ]
                  }),
                  jsx('span', { style: muted, children: '추론 수준' }),
                  jsx('select', {
                    'aria-label': '추론 수준',
                    value: reasoning,
                    disabled: !thinking,
                    onChange: event => setReasoning(event.target.value),
                    style: field,
                    children: REASONING_LEVELS.map(level =>
                      jsx('option', { value: level.value, children: level.label }, level.value || 'keep')
                    )
                  })
                ]
              })
            ]
          }),
          jsxs('label', {
            style: { ...row, ...muted },
            children: [
              jsx('input', {
                type: 'checkbox',
                checked: restartAfter,
                onChange: event => setRestartAfter(event.target.checked)
              }),
              '적용 후 게이트웨이 자동 재시작 (연결이 잠시 끊김)'
            ]
          }),
          jsxs('div', {
            style: row,
            children: [
              jsx(Button, {
                type: 'button',
                disabled: busy || loading || !model.trim() || !provider.trim() || selectedCount === 0,
                onClick: () => void apply(),
                children:
                  busy
                    ? '적용 중…'
                    : selectedCount === profiles.length
                      ? '모든 봇에 적용'
                      : `선택한 ${selectedCount}개 봇에 적용`
              }),
              jsx(Button, {
                type: 'button',
                variant: 'ghost',
                disabled: busy || loading,
                onClick: () => void load(true),
                children: '새로고침'
              }),
              jsx(Button, {
                type: 'button',
                variant: 'ghost',
                disabled: busy,
                onClick: () => void restart(),
                children: '게이트웨이 다시 시작'
              })
            ]
          }),
          message ? jsx('p', { role: 'status', style: { ...muted, color: 'var(--ui-text-success, inherit)' }, children: message }) : null,
          error ? jsx('p', { role: 'alert', style: { ...muted, color: 'var(--ui-text-danger, inherit)' }, children: error }) : null
        ]
      }),
      jsxs('div', {
        style: card,
        children: [
          jsxs('div', {
            style: { ...row, justifyContent: 'space-between' },
            children: [
              jsx('div', { style: { fontWeight: 600 }, children: '봇 프로필' }),
              jsxs('div', {
                style: { ...row, gap: '6px' },
                children: [
                  jsx('button', {
                    type: 'button',
                    onClick: () =>
                      setSelected(Object.fromEntries(profiles.map(p => [p.name, true]))),
                    style: { ...muted, background: 'transparent', border: 0, cursor: 'pointer', padding: '2px 4px' },
                    children: '전체 선택'
                  }),
                  jsx('button', {
                    type: 'button',
                    onClick: () =>
                      setSelected(Object.fromEntries(profiles.map(p => [p.name, false]))),
                    style: { ...muted, background: 'transparent', border: 0, cursor: 'pointer', padding: '2px 4px' },
                    children: '전체 해제'
                  }),
                  jsx('span', { style: muted, children: `${profiles.length}개` })
                ]
              })
            ]
          }),
          loading
            ? jsx('p', { style: muted, children: '불러오는 중…' })
            : jsx('div', {
                style: { display: 'grid', gap: '6px' },
                children: profiles.map(profile =>
                  jsxs(
                    'div',
                    {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto auto',
                        gap: '10px',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderTop: '1px solid var(--ui-stroke-secondary)'
                      },
                      children: [
                        jsx('input', {
                          type: 'checkbox',
                          'aria-label': `${profile.name} 적용`,
                          checked: selected[profile.name] !== false,
                          onChange: event =>
                            setSelected(prev => ({ ...prev, [profile.name]: event.target.checked }))
                        }),
                        jsxs('div', {
                          style: { display: 'grid', gap: '2px' },
                          children: [
                            jsxs('div', {
                              style: { display: 'flex', gap: '6px', alignItems: 'baseline' },
                              children: [
                                jsx('span', { style: { fontWeight: 500 }, children: profile.display_name || profile.name }),
                                jsx('span', { style: mono, children: profile.name }),
                                profile.is_default ? jsx('span', { style: muted, children: '기본' }) : null
                              ]
                            }),
                            jsx('span', { style: mono, children: profile.model || '(모델 미설정)' })
                          ]
                        }),
                        jsx('span', { style: muted, children: status[profile.name] || '' }),
                        jsx('span', {
                          style: { ...muted, fontSize: '11px' },
                          children: profile.provider || ''
                        })
                      ]
                    },
                    profile.name
                  )
                )
              })
        ]
      }),
      jsx('p', {
        style: muted,
        children:
          '모델은 선택한 봇 프로필의 config에 저장됩니다. 재시작 옵션을 켜면 적용 직후 게이트웨이를 다시 시작해 실행 중인 봇까지 같은 모델로 맞춥니다.'
      })
    ]
  })
}

export default {
  id: ID,
  name: '모든 봇 모델',
  description: '선택한 봇 프로필의 기본 모델을 바꾸고 실행 중인 봇에 반영하는 페이지.',
  defaultEnabled: true,

  register(ctx) {
    return ctx.registerMany([
      {
        id: 'page',
        area: ROUTES_AREA,
        data: { path: PATH },
        render: () => jsx(AllBotsModelPage, {})
      },
      {
        id: 'nav',
        area: SIDEBAR_NAV_AREA,
        order: 65,
        data: { path: PATH, label: '모든 봇 모델', codicon: 'hubot' }
      },
      {
        id: 'open',
        area: PALETTE_AREA,
        data: {
          id: `${ID}.open`,
          label: '모든 봇 모델: 열기',
          keywords: ['model', 'all', 'bots', '모델', '봇', '일괄'],
          run: () => host.navigate(PATH)
        }
      }
    ])
  }
}
