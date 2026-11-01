// src/plugin.tsx
import { ROUTES_AREA, SIDEBAR_NAV_AREA, THEMES_AREA, TITLEBAR_AREAS } from "@hermes/plugin-sdk";
import { useEffect as useEffect2 } from "react";

// src/dashboard.tsx
import { Button, host, useValue } from "@hermes/plugin-sdk";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var AVATAR_COLORS = ["#5B6BFF", "#7C4DFF", "#00A86B", "#2ED3A1", "#FF6B6B", "#FF9F43", "#8E5CF7", "#00A6D6"];
function shortModel(value) {
  if (!value) {
    return "\uBAA8\uB378 \uBBF8\uC124\uC815";
  }
  const tail = value.split("/").pop() || value;
  return tail.replace(/:free$/, "").replace(/:.*$/, "").slice(0, 24);
}
function Dashboard() {
  const profile = useValue(host.state.profile) || "default";
  const [profiles, setProfiles] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [model, setModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const [profileResult, roomResult, modelResult] = await Promise.all([
          host.profiles.list(),
          host.request("groups.list", { profile, limit: 100 }).catch(() => ({ rooms: [] })),
          host.request("model.options", { refresh: false, explicit_only: true }).catch(() => null)
        ]);
        if (cancelled) {
          return;
        }
        setProfiles(profileResult?.profiles || []);
        setRooms(roomResult?.rooms || []);
        setModel({ model: modelResult?.model, provider: modelResult?.provider });
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile]);
  const stats = [
    { label: "\uBD07 \uD504\uB85C\uD544", value: profiles.length, hint: "\uC5F0\uACB0\uB41C \uBD07" },
    { label: "\uADF8\uB8F9 \uB300\uD654", value: rooms.length, hint: "\uD65C\uC131 \uBC29" },
    { label: "\uD604\uC7AC \uBAA8\uB378", value: shortModel(model.model), hint: model.provider || "\uAE30\uBCF8\uAC12" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto grid w-full max-w-6xl gap-5 p-8", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Nazarick cockpit" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-bold tracking-tight", children: "\uB300\uC2DC\uBCF4\uB4DC" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          "\uBC31\uC5D4\uB4DC\uB294 \uADF8\uB300\uB85C, \uD654\uBA74\uB9CC \uB0B4 \uCDE8\uD5A5\uC73C\uB85C. \uD604\uC7AC \uD504\uB85C\uD544: ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: profile })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { onClick: () => host.navigate("/hermes-ui-collection"), children: "UI \uD14C\uB9C8" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => host.navigate("/all-bots-model"), children: "\uBAA8\uB4E0 \uBD07 \uBAA8\uB378" })
      ] })
    ] }),
    error ? /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive", children: error }) : null,
    /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: stats.map((stat) => /* @__PURE__ */ jsxs("section", { "data-slot": "card", className: "rounded-2xl border border-border bg-card p-5 shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: stat.label }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 truncate text-2xl font-extrabold tracking-tight", children: stat.value }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: stat.hint })
    ] }, stat.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-[1.15fr_.85fr]", children: [
      /* @__PURE__ */ jsxs("section", { "data-slot": "card", className: "rounded-2xl border border-border bg-card p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold", children: "\uBD07" }),
            /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: "\uD504\uB85C\uD544\uBCC4 \uD604\uC7AC \uBAA8\uB378" })
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => host.navigate("/all-bots-model"), children: "\uC804\uCCB4 \uBCF4\uAE30" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-1", children: [
          loading ? /* @__PURE__ */ jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" }) : null,
          profiles.slice(0, 8).map((row, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "grid h-8 w-8 place-items-center rounded-[10px] text-[11px] font-extrabold text-white",
                style: { background: AVATAR_COLORS[index % AVATAR_COLORS.length] },
                children: (row.display_name || row.name || "?").trim().charAt(0)
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold", children: row.display_name || row.name }),
              /* @__PURE__ */ jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: row.name })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "ml-auto shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground", children: [
              shortModel(row.model),
              row.provider ? ` \xB7 ${row.provider}` : ""
            ] })
          ] }, row.name))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5", children: [
        /* @__PURE__ */ jsxs("section", { "data-slot": "card", className: "rounded-2xl border border-border bg-card p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold", children: "\uADF8\uB8F9 \uB300\uD654" }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: "\uD638\uC2A4\uD2F0\uB4DC \uB8F8" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground", children: rooms.length })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-1", children: [
            rooms.slice(0, 5).map((room) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60", children: [
              /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-primary" }),
              /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate text-sm font-medium", children: room.name }),
              /* @__PURE__ */ jsxs("span", { className: "ml-auto text-[11px] text-muted-foreground", children: [
                room.members?.length || 0,
                "\uBA85"
              ] })
            ] }, room.room_id)),
            !loading && rooms.length === 0 ? /* @__PURE__ */ jsx("p", { className: "py-4 text-sm text-muted-foreground", children: "\uADF8\uB8F9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { "data-slot": "card", className: "rounded-2xl border border-border bg-card p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold", children: "\uBE60\uB978 \uC791\uC5C5" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-2", children: [
            /* @__PURE__ */ jsx(Button, { className: "justify-start", variant: "ghost", onClick: () => host.navigate("/hermes-ui-collection"), children: "\uD14C\uB9C8 \uBC14\uAFB8\uAE30" }),
            /* @__PURE__ */ jsx(Button, { className: "justify-start", variant: "ghost", onClick: () => host.navigate("/all-bots-model"), children: "\uBAA8\uB4E0 \uBD07 \uBAA8\uB378 \uBCC0\uACBD" }),
            /* @__PURE__ */ jsx(Button, { className: "justify-start", variant: "ghost", onClick: () => host.navigate("/kanban"), children: "\uCE78\uBC18 \uC5F4\uAE30" })
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/icons.ts
var ICON_CSS = `
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-home::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%2021v-8a1%201%200%200%200-1-1h-4a1%201%200%200%200-1%201v8%22%20%2F%3E%3Cpath%20d%3D%22M3%2010a2%202%200%200%201%20.709-1.528l7-5.999a2%202%200%200%201%202.582%200l7%205.999A2%202%200%200%201%2021%2010v9a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%2021v-8a1%201%200%200%200-1-1h-4a1%201%200%200%200-1%201v8%22%20%2F%3E%3Cpath%20d%3D%22M3%2010a2%202%200%200%201%20.709-1.528l7-5.999a2%202%200%200%201%202.582%200l7%205.999A2%202%200%200%201%2021%2010v9a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-robot::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%208V4H8%22%20%2F%3E%3Crect%20width%3D%2216%22%20height%3D%2212%22%20x%3D%224%22%20y%3D%228%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M2%2014h2%22%20%2F%3E%3Cpath%20d%3D%22M20%2014h2%22%20%2F%3E%3Cpath%20d%3D%22M15%2013v2%22%20%2F%3E%3Cpath%20d%3D%22M9%2013v2%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%208V4H8%22%20%2F%3E%3Crect%20width%3D%2216%22%20height%3D%2212%22%20x%3D%224%22%20y%3D%228%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M2%2014h2%22%20%2F%3E%3Cpath%20d%3D%22M20%2014h2%22%20%2F%3E%3Cpath%20d%3D%22M15%2013v2%22%20%2F%3E%3Cpath%20d%3D%22M9%2013v2%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-symbol-misc::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8.3%2010a.7.7%200%200%201-.626-1.079L11.4%203a.7.7%200%200%201%201.198-.043L16.3%208.9a.7.7%200%200%201-.572%201.1Z%22%20%2F%3E%3Crect%20x%3D%223%22%20y%3D%2214%22%20width%3D%227%22%20height%3D%227%22%20rx%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2217.5%22%20cy%3D%2217.5%22%20r%3D%223.5%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8.3%2010a.7.7%200%200%201-.626-1.079L11.4%203a.7.7%200%200%201%201.198-.043L16.3%208.9a.7.7%200%200%201-.572%201.1Z%22%20%2F%3E%3Crect%20x%3D%223%22%20y%3D%2214%22%20width%3D%227%22%20height%3D%227%22%20rx%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2217.5%22%20cy%3D%2217.5%22%20r%3D%223.5%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-comment::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2015a2%202%200%200%201-2%202H7l-4%204V5a2%202%200%200%201%202-2h14a2%202%200%200%201%202%202z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2015a2%202%200%200%201-2%202H7l-4%204V5a2%202%200%200%201%202-2h14a2%202%200%200%201%202%202z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-comment-discussion::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14%209a2%202%200%200%201-2%202H6l-4%204V4a2%202%200%200%201%202-2h8a2%202%200%200%201%202%202z%22%20%2F%3E%3Cpath%20d%3D%22M18%209h2a2%202%200%200%201%202%202v11l-4-4h-6a2%202%200%200%201-2-2v-1%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14%209a2%202%200%200%201-2%202H6l-4%204V4a2%202%200%200%201%202-2h8a2%202%200%200%201%202%202z%22%20%2F%3E%3Cpath%20d%3D%22M18%209h2a2%202%200%200%201%202%202v11l-4-4h-6a2%202%200%200%201-2-2v-1%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-files::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%207h-3a2%202%200%200%201-2-2V2%22%20%2F%3E%3Cpath%20d%3D%22M9%2018a2%202%200%200%201-2-2V4a2%202%200%200%201%202-2h7l4%204v10a2%202%200%200%201-2%202Z%22%20%2F%3E%3Cpath%20d%3D%22M3%207.6v12.8A1.6%201.6%200%200%200%204.6%2022h9.8%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%207h-3a2%202%200%200%201-2-2V2%22%20%2F%3E%3Cpath%20d%3D%22M9%2018a2%202%200%200%201-2-2V4a2%202%200%200%201%202-2h7l4%204v10a2%202%200%200%201-2%202Z%22%20%2F%3E%3Cpath%20d%3D%22M3%207.6v12.8A1.6%201.6%200%200%200%204.6%2022h9.8%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-watch::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cline%20x1%3D%2210%22%20x2%3D%2214%22%20y1%3D%222%22%20y2%3D%222%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2215%22%20y1%3D%2214%22%20y2%3D%2211%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2214%22%20r%3D%228%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cline%20x1%3D%2210%22%20x2%3D%2214%22%20y1%3D%222%22%20y2%3D%222%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2215%22%20y1%3D%2214%22%20y2%3D%2211%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2214%22%20r%3D%228%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-dashboard::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%227%22%20height%3D%229%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%225%22%20x%3D%2214%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%229%22%20x%3D%2214%22%20y%3D%2212%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%225%22%20x%3D%223%22%20y%3D%2216%22%20rx%3D%221%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%227%22%20height%3D%229%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%225%22%20x%3D%2214%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%229%22%20x%3D%2214%22%20y%3D%2212%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%225%22%20x%3D%223%22%20y%3D%2216%22%20rx%3D%221%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-symbol-color::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2213.5%22%20cy%3D%226.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%2217.5%22%20cy%3D%2210.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%228.5%22%20cy%3D%227.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%226.5%22%20cy%3D%2212.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Cpath%20d%3D%22M12%202C6.5%202%202%206.5%202%2012s4.5%2010%2010%2010c.926%200%201.648-.746%201.648-1.688%200-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64%201.64%200%200%201%201.668-1.668h1.996c3.051%200%205.555-2.503%205.555-5.554C21.965%206.012%2017.461%202%2012%202z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2213.5%22%20cy%3D%226.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%2217.5%22%20cy%3D%2210.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%228.5%22%20cy%3D%227.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Ccircle%20cx%3D%226.5%22%20cy%3D%2212.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3Cpath%20d%3D%22M12%202C6.5%202%202%206.5%202%2012s4.5%2010%2010%2010c.926%200%201.648-.746%201.648-1.688%200-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64%201.64%200%200%201%201.668-1.668h1.996c3.051%200%205.555-2.503%205.555-5.554C21.965%206.012%2017.461%202%2012%202z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-hubot::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%208V4H8%22%20%2F%3E%3Crect%20width%3D%2216%22%20height%3D%2212%22%20x%3D%224%22%20y%3D%228%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M2%2014h2%22%20%2F%3E%3Cpath%20d%3D%22M20%2014h2%22%20%2F%3E%3Cpath%20d%3D%22M15%2013v2%22%20%2F%3E%3Cpath%20d%3D%22M9%2013v2%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%208V4H8%22%20%2F%3E%3Crect%20width%3D%2216%22%20height%3D%2212%22%20x%3D%224%22%20y%3D%228%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M2%2014h2%22%20%2F%3E%3Cpath%20d%3D%22M20%2014h2%22%20%2F%3E%3Cpath%20d%3D%22M15%2013v2%22%20%2F%3E%3Cpath%20d%3D%22M9%2013v2%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-folder-library::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m6%2014%201.5-2.9A2%202%200%200%201%209.24%2010H20a2%202%200%200%201%201.94%202.5l-1.54%206a2%202%200%200%201-1.95%201.5H4a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h3.9a2%202%200%200%201%201.69.9l.81%201.2a2%202%200%200%200%201.67.9H18a2%202%200%200%201%202%202v2%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m6%2014%201.5-2.9A2%202%200%200%201%209.24%2010H20a2%202%200%200%201%201.94%202.5l-1.54%206a2%202%200%200%201-1.95%201.5H4a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h3.9a2%202%200%200%201%201.69.9l.81%201.2a2%202%200%200%200%201.67.9H18a2%202%200%200%201%202%202v2%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-layers::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.83%202.18a2%202%200%200%200-1.66%200L2.6%206.08a1%201%200%200%200%200%201.83l8.58%203.91a2%202%200%200%200%201.66%200l8.58-3.9a1%201%200%200%200%200-1.83z%22%20%2F%3E%3Cpath%20d%3D%22M2%2012a1%201%200%200%200%20.58.91l8.6%203.91a2%202%200%200%200%201.65%200l8.58-3.9A1%201%200%200%200%2022%2012%22%20%2F%3E%3Cpath%20d%3D%22M2%2017a1%201%200%200%200%20.58.91l8.6%203.91a2%202%200%200%200%201.65%200l8.58-3.9A1%201%200%200%200%2022%2017%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.83%202.18a2%202%200%200%200-1.66%200L2.6%206.08a1%201%200%200%200%200%201.83l8.58%203.91a2%202%200%200%200%201.66%200l8.58-3.9a1%201%200%200%200%200-1.83z%22%20%2F%3E%3Cpath%20d%3D%22M2%2012a1%201%200%200%200%20.58.91l8.6%203.91a2%202%200%200%200%201.65%200l8.58-3.9A1%201%200%200%200%2022%2012%22%20%2F%3E%3Cpath%20d%3D%22M2%2017a1%201%200%200%200%20.58.91l8.6%203.91a2%202%200%200%200%201.65%200l8.58-3.9A1%201%200%200%200%2022%2017%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-add::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%2012h14%22%20%2F%3E%3Cpath%20d%3D%22M12%205v14%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%2012h14%22%20%2F%3E%3Cpath%20d%3D%22M12%205v14%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-close::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M18%206%206%2018%22%20%2F%3E%3Cpath%20d%3D%22m6%206%2012%2012%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M18%206%206%2018%22%20%2F%3E%3Cpath%20d%3D%22m6%206%2012%2012%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-chevron-right::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m9%2018%206-6-6-6%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m9%2018%206-6-6-6%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-chevron-down::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-chevron-up::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m18%2015-6-6-6%206%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m18%2015-6-6-6%206%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-chevron-left::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m15%2018-6-6%206-6%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m15%2018-6-6%206-6%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-kebab-vertical::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%225%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2219%22%20r%3D%221%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%225%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2219%22%20r%3D%221%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-ellipsis::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2219%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%225%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2219%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%225%22%20cy%3D%2212%22%20r%3D%221%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-check::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%206%209%2017l-5-5%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%206%209%2017l-5-5%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-check-all::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M18%206%207%2017l-5-5%22%20%2F%3E%3Cpath%20d%3D%22m22%2010-7.5%207.5L13%2016%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M18%206%207%2017l-5-5%22%20%2F%3E%3Cpath%20d%3D%22m22%2010-7.5%207.5L13%2016%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-list-filter::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%206h18%22%20%2F%3E%3Cpath%20d%3D%22M7%2012h10%22%20%2F%3E%3Cpath%20d%3D%22M10%2018h4%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%206h18%22%20%2F%3E%3Cpath%20d%3D%22M7%2012h10%22%20%2F%3E%3Cpath%20d%3D%22M10%2018h4%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-pin::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%2017v5%22%20%2F%3E%3Cpath%20d%3D%22M9%2010.76a2%202%200%200%201-1.11%201.79l-1.78.9A2%202%200%200%200%205%2015.24V16a1%201%200%200%200%201%201h12a1%201%200%200%200%201-1v-.76a2%202%200%200%200-1.11-1.79l-1.78-.9A2%202%200%200%201%2015%2010.76V7a1%201%200%200%201%201-1%202%202%200%200%200%200-4H8a2%202%200%200%200%200%204%201%201%200%200%201%201%201z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%2017v5%22%20%2F%3E%3Cpath%20d%3D%22M9%2010.76a2%202%200%200%201-1.11%201.79l-1.78.9A2%202%200%200%200%205%2015.24V16a1%201%200%200%200%201%201h12a1%201%200%200%200%201-1v-.76a2%202%200%200%200-1.11-1.79l-1.78-.9A2%202%200%200%201%2015%2010.76V7a1%201%200%200%201%201-1%202%202%200%200%200%200-4H8a2%202%200%200%200%200%204%201%201%200%200%201%201%201z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-search::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2211%22%20cy%3D%2211%22%20r%3D%228%22%20%2F%3E%3Cpath%20d%3D%22m21%2021-4.3-4.3%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2211%22%20cy%3D%2211%22%20r%3D%228%22%20%2F%3E%3Cpath%20d%3D%22m21%2021-4.3-4.3%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-settings-gear::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.22%202h-.44a2%202%200%200%200-2%202v.18a2%202%200%200%201-1%201.73l-.43.25a2%202%200%200%201-2%200l-.15-.08a2%202%200%200%200-2.73.73l-.22.38a2%202%200%200%200%20.73%202.73l.15.1a2%202%200%200%201%201%201.72v.51a2%202%200%200%201-1%201.74l-.15.09a2%202%200%200%200-.73%202.73l.22.38a2%202%200%200%200%202.73.73l.15-.08a2%202%200%200%201%202%200l.43.25a2%202%200%200%201%201%201.73V20a2%202%200%200%200%202%202h.44a2%202%200%200%200%202-2v-.18a2%202%200%200%201%201-1.73l.43-.25a2%202%200%200%201%202%200l.15.08a2%202%200%200%200%202.73-.73l.22-.39a2%202%200%200%200-.73-2.73l-.15-.08a2%202%200%200%201-1-1.74v-.5a2%202%200%200%201%201-1.74l.15-.09a2%202%200%200%200%20.73-2.73l-.22-.38a2%202%200%200%200-2.73-.73l-.15.08a2%202%200%200%201-2%200l-.43-.25a2%202%200%200%201-1-1.73V4a2%202%200%200%200-2-2z%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.22%202h-.44a2%202%200%200%200-2%202v.18a2%202%200%200%201-1%201.73l-.43.25a2%202%200%200%201-2%200l-.15-.08a2%202%200%200%200-2.73.73l-.22.38a2%202%200%200%200%20.73%202.73l.15.1a2%202%200%200%201%201%201.72v.51a2%202%200%200%201-1%201.74l-.15.09a2%202%200%200%200-.73%202.73l.22.38a2%202%200%200%200%202.73.73l.15-.08a2%202%200%200%201%202%200l.43.25a2%202%200%200%201%201%201.73V20a2%202%200%200%200%202%202h.44a2%202%200%200%200%202-2v-.18a2%202%200%200%201%201-1.73l.43-.25a2%202%200%200%201%202%200l.15.08a2%202%200%200%200%202.73-.73l.22-.39a2%202%200%200%200-.73-2.73l-.15-.08a2%202%200%200%201-1-1.74v-.5a2%202%200%200%201%201-1.74l.15-.09a2%202%200%200%200%20.73-2.73l-.22-.38a2%202%200%200%200-2.73-.73l-.15.08a2%202%200%200%201-2%200l-.43-.25a2%202%200%200%201-1-1.73V4a2%202%200%200%200-2-2z%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-gear::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.22%202h-.44a2%202%200%200%200-2%202v.18a2%202%200%200%201-1%201.73l-.43.25a2%202%200%200%201-2%200l-.15-.08a2%202%200%200%200-2.73.73l-.22.38a2%202%200%200%200%20.73%202.73l.15.1a2%202%200%200%201%201%201.72v.51a2%202%200%200%201-1%201.74l-.15.09a2%202%200%200%200-.73%202.73l.22.38a2%202%200%200%200%202.73.73l.15-.08a2%202%200%200%201%202%200l.43.25a2%202%200%200%201%201%201.73V20a2%202%200%200%200%202%202h.44a2%202%200%200%200%202-2v-.18a2%202%200%200%201%201-1.73l.43-.25a2%202%200%200%201%202%200l.15.08a2%202%200%200%200%202.73-.73l.22-.39a2%202%200%200%200-.73-2.73l-.15-.08a2%202%200%200%201-1-1.74v-.5a2%202%200%200%201%201-1.74l.15-.09a2%202%200%200%200%20.73-2.73l-.22-.38a2%202%200%200%200-2.73-.73l-.15.08a2%202%200%200%201-2%200l-.43-.25a2%202%200%200%201-1-1.73V4a2%202%200%200%200-2-2z%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.22%202h-.44a2%202%200%200%200-2%202v.18a2%202%200%200%201-1%201.73l-.43.25a2%202%200%200%201-2%200l-.15-.08a2%202%200%200%200-2.73.73l-.22.38a2%202%200%200%200%20.73%202.73l.15.1a2%202%200%200%201%201%201.72v.51a2%202%200%200%201-1%201.74l-.15.09a2%202%200%200%200-.73%202.73l.22.38a2%202%200%200%200%202.73.73l.15-.08a2%202%200%200%201%202%200l.43.25a2%202%200%200%201%201%201.73V20a2%202%200%200%200%202%202h.44a2%202%200%200%200%202-2v-.18a2%202%200%200%201%201-1.73l.43-.25a2%202%200%200%201%202%200l.15.08a2%202%200%200%200%202.73-.73l.22-.39a2%202%200%200%200-.73-2.73l-.15-.08a2%202%200%200%201-1-1.74v-.5a2%202%200%200%201%201-1.74l.15-.09a2%202%200%200%200%20.73-2.73l-.22-.38a2%202%200%200%200-2.73-.73l-.15.08a2%202%200%200%201-2%200l-.43-.25a2%202%200%200%201-1-1.73V4a2%202%200%200%200-2-2z%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-plug::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%2022v-5%22%20%2F%3E%3Cpath%20d%3D%22M9%208V2%22%20%2F%3E%3Cpath%20d%3D%22M15%208V2%22%20%2F%3E%3Cpath%20d%3D%22M18%208v5a4%204%200%200%201-4%204h-4a4%204%200%200%201-4-4V8Z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%2022v-5%22%20%2F%3E%3Cpath%20d%3D%22M9%208V2%22%20%2F%3E%3Cpath%20d%3D%22M15%208V2%22%20%2F%3E%3Cpath%20d%3D%22M18%208v5a4%204%200%200%201-4%204h-4a4%204%200%200%201-4-4V8Z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-cloud-download::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%2013v8l-4-4%22%20%2F%3E%3Cpath%20d%3D%22m12%2021%204-4%22%20%2F%3E%3Cpath%20d%3D%22M4.393%2015.269A7%207%200%201%201%2015.71%208h1.79a4.5%204.5%200%200%201%202.436%208.284%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%2013v8l-4-4%22%20%2F%3E%3Cpath%20d%3D%22m12%2021%204-4%22%20%2F%3E%3Cpath%20d%3D%22M4.393%2015.269A7%207%200%201%201%2015.71%208h1.79a4.5%204.5%200%200%201%202.436%208.284%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-cloud-upload::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%2013v8%22%20%2F%3E%3Cpath%20d%3D%22M4%2014.899A7%207%200%201%201%2015.71%208h1.79a4.5%204.5%200%200%201%202.5%208.242%22%20%2F%3E%3Cpath%20d%3D%22m8%2017%204-4%204%204%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%2013v8%22%20%2F%3E%3Cpath%20d%3D%22M4%2014.899A7%207%200%201%201%2015.71%208h1.79a4.5%204.5%200%200%201%202.5%208.242%22%20%2F%3E%3Cpath%20d%3D%22m8%2017%204-4%204%204%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-refresh::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%200%201%209-9%209.75%209.75%200%200%201%206.74%202.74L21%208%22%20%2F%3E%3Cpath%20d%3D%22M21%203v5h-5%22%20%2F%3E%3Cpath%20d%3D%22M21%2012a9%209%200%200%201-9%209%209.75%209.75%200%200%201-6.74-2.74L3%2016%22%20%2F%3E%3Cpath%20d%3D%22M8%2016H3v5%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%200%201%209-9%209.75%209.75%200%200%201%206.74%202.74L21%208%22%20%2F%3E%3Cpath%20d%3D%22M21%203v5h-5%22%20%2F%3E%3Cpath%20d%3D%22M21%2012a9%209%200%200%201-9%209%209.75%209.75%200%200%201-6.74-2.74L3%2016%22%20%2F%3E%3Cpath%20d%3D%22M8%2016H3v5%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-sync::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%200%201%209-9%209.75%209.75%200%200%201%206.74%202.74L21%208%22%20%2F%3E%3Cpath%20d%3D%22M21%203v5h-5%22%20%2F%3E%3Cpath%20d%3D%22M21%2012a9%209%200%200%201-9%209%209.75%209.75%200%200%201-6.74-2.74L3%2016%22%20%2F%3E%3Cpath%20d%3D%22M8%2016H3v5%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%200%201%209-9%209.75%209.75%200%200%201%206.74%202.74L21%208%22%20%2F%3E%3Cpath%20d%3D%22M21%203v5h-5%22%20%2F%3E%3Cpath%20d%3D%22M21%2012a9%209%200%200%201-9%209%209.75%209.75%200%200%201-6.74-2.74L3%2016%22%20%2F%3E%3Cpath%20d%3D%22M8%2016H3v5%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-layout::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%227%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%223%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%2214%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%227%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%223%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3Crect%20width%3D%227%22%20height%3D%227%22%20x%3D%2214%22%20y%3D%2214%22%20rx%3D%221%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-layout-sidebar-left::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M9%203v18%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M9%203v18%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-layout-sidebar-right::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M15%203v18%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M15%203v18%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-arrow-swap::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8%203%204%207l4%204%22%20%2F%3E%3Cpath%20d%3D%22M4%207h16%22%20%2F%3E%3Cpath%20d%3D%22m16%2021%204-4-4-4%22%20%2F%3E%3Cpath%20d%3D%22M20%2017H4%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8%203%204%207l4%204%22%20%2F%3E%3Cpath%20d%3D%22M4%207h16%22%20%2F%3E%3Cpath%20d%3D%22m16%2021%204-4-4-4%22%20%2F%3E%3Cpath%20d%3D%22M20%2017H4%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-arrow-up::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m5%2012%207-7%207%207%22%20%2F%3E%3Cpath%20d%3D%22M12%2019V5%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m5%2012%207-7%207%207%22%20%2F%3E%3Cpath%20d%3D%22M12%2019V5%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-arrow-down::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%205v14%22%20%2F%3E%3Cpath%20d%3D%22m19%2012-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%205v14%22%20%2F%3E%3Cpath%20d%3D%22m19%2012-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-arrow-left::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m12%2019-7-7%207-7%22%20%2F%3E%3Cpath%20d%3D%22M19%2012H5%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m12%2019-7-7%207-7%22%20%2F%3E%3Cpath%20d%3D%22M19%2012H5%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-arrow-right::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%2012h14%22%20%2F%3E%3Cpath%20d%3D%22m12%205%207%207-7%207%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M5%2012h14%22%20%2F%3E%3Cpath%20d%3D%22m12%205%207%207-7%207%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-device-desktop::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2220%22%20height%3D%2214%22%20x%3D%222%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cline%20x1%3D%228%22%20x2%3D%2216%22%20y1%3D%2221%22%20y2%3D%2221%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%2217%22%20y2%3D%2221%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2220%22%20height%3D%2214%22%20x%3D%222%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cline%20x1%3D%228%22%20x2%3D%2216%22%20y1%3D%2221%22%20y2%3D%2221%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%2217%22%20y2%3D%2221%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-zap::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4%2014a1%201%200%200%201-.78-1.63l9.9-10.2a.5.5%200%200%201%20.86.46l-1.92%206.02A1%201%200%200%200%2013%2010h7a1%201%200%200%201%20.78%201.63l-9.9%2010.2a.5.5%200%200%201-.86-.46l1.92-6.02A1%201%200%200%200%2011%2014z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4%2014a1%201%200%200%201-.78-1.63l9.9-10.2a.5.5%200%200%201%20.86.46l-1.92%206.02A1%201%200%200%200%2013%2010h7a1%201%200%200%201%20.78%201.63l-9.9%2010.2a.5.5%200%200%201-.86-.46l1.92-6.02A1%201%200%200%200%2011%2014z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-loading::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2012a9%209%200%201%201-6.219-8.56%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2012a9%209%200%201%201-6.219-8.56%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-history::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%201%200%209-9%209.75%209.75%200%200%200-6.74%202.74L3%208%22%20%2F%3E%3Cpath%20d%3D%22M3%203v5h5%22%20%2F%3E%3Cpath%20d%3D%22M12%207v5l4%202%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012a9%209%200%201%200%209-9%209.75%209.75%200%200%200-6.74%202.74L3%208%22%20%2F%3E%3Cpath%20d%3D%22M3%203v5h5%22%20%2F%3E%3Cpath%20d%3D%22M12%207v5l4%202%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-account::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2210%22%20r%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M7%2020.662V19a2%202%200%200%201%202-2h6a2%202%200%200%201%202%202v1.662%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2210%22%20r%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M7%2020.662V19a2%202%200%200%201%202-2h6a2%202%200%200%201%202%202v1.662%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-person::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M19%2021v-2a4%204%200%200%200-4-4H9a4%204%200%200%200-4%204v2%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%227%22%20r%3D%224%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M19%2021v-2a4%204%200%200%200-4-4H9a4%204%200%200%200-4%204v2%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%227%22%20r%3D%224%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-error::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%228%22%20y2%3D%2212%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212.01%22%20y1%3D%2216%22%20y2%3D%2216%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%228%22%20y2%3D%2212%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212.01%22%20y1%3D%2216%22%20y2%3D%2216%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-warning::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m21.73%2018-8-14a2%202%200%200%200-3.48%200l-8%2014A2%202%200%200%200%204%2021h16a2%202%200%200%200%201.73-3%22%20%2F%3E%3Cpath%20d%3D%22M12%209v4%22%20%2F%3E%3Cpath%20d%3D%22M12%2017h.01%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m21.73%2018-8-14a2%202%200%200%200-3.48%200l-8%2014A2%202%200%200%200%204%2021h16a2%202%200%200%200%201.73-3%22%20%2F%3E%3Cpath%20d%3D%22M12%209v4%22%20%2F%3E%3Cpath%20d%3D%22M12%2017h.01%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-info::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpath%20d%3D%22M12%2016v-4%22%20%2F%3E%3Cpath%20d%3D%22M12%208h.01%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpath%20d%3D%22M12%2016v-4%22%20%2F%3E%3Cpath%20d%3D%22M12%208h.01%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-copy::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2214%22%20height%3D%2214%22%20x%3D%228%22%20y%3D%228%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M4%2016c-1.1%200-2-.9-2-2V4c0-1.1.9-2%202-2h10c1.1%200%202%20.9%202%202%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2214%22%20height%3D%2214%22%20x%3D%228%22%20y%3D%228%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M4%2016c-1.1%200-2-.9-2-2V4c0-1.1.9-2%202-2h10c1.1%200%202%20.9%202%202%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-trash::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%206h18%22%20%2F%3E%3Cpath%20d%3D%22M19%206v14c0%201-1%202-2%202H7c-1%200-2-1-2-2V6%22%20%2F%3E%3Cpath%20d%3D%22M8%206V4c0-1%201-2%202-2h4c1%200%202%201%202%202v2%22%20%2F%3E%3Cline%20x1%3D%2210%22%20x2%3D%2210%22%20y1%3D%2211%22%20y2%3D%2217%22%20%2F%3E%3Cline%20x1%3D%2214%22%20x2%3D%2214%22%20y1%3D%2211%22%20y2%3D%2217%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%206h18%22%20%2F%3E%3Cpath%20d%3D%22M19%206v14c0%201-1%202-2%202H7c-1%200-2-1-2-2V6%22%20%2F%3E%3Cpath%20d%3D%22M8%206V4c0-1%201-2%202-2h4c1%200%202%201%202%202v2%22%20%2F%3E%3Cline%20x1%3D%2210%22%20x2%3D%2210%22%20y1%3D%2211%22%20y2%3D%2217%22%20%2F%3E%3Cline%20x1%3D%2214%22%20x2%3D%2214%22%20y1%3D%2211%22%20y2%3D%2217%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-edit::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21.174%206.812a1%201%200%200%200-3.986-3.987L3.842%2016.174a2%202%200%200%200-.5.83l-1.321%204.352a.5.5%200%200%200%20.623.622l4.353-1.32a2%202%200%200%200%20.83-.497z%22%20%2F%3E%3Cpath%20d%3D%22m15%205%204%204%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21.174%206.812a1%201%200%200%200-3.986-3.987L3.842%2016.174a2%202%200%200%200-.5.83l-1.321%204.352a.5.5%200%200%200%20.623.622l4.353-1.32a2%202%200%200%200%20.83-.497z%22%20%2F%3E%3Cpath%20d%3D%22m15%205%204%204%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-play::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpolygon%20points%3D%226%203%2020%2012%206%2021%206%203%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpolygon%20points%3D%226%203%2020%2012%206%2021%206%203%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-stop::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-send::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14.536%2021.686a.5.5%200%200%200%20.937-.024l6.5-19a.496.496%200%200%200-.635-.635l-19%206.5a.5.5%200%200%200-.024.937l7.93%203.18a2%202%200%200%201%201.112%201.11z%22%20%2F%3E%3Cpath%20d%3D%22m21.854%202.147-10.94%2010.939%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14.536%2021.686a.5.5%200%200%200%20.937-.024l6.5-19a.496.496%200%200%200-.635-.635l-19%206.5a.5.5%200%200%200-.024.937l7.93%203.18a2%202%200%200%201%201.112%201.11z%22%20%2F%3E%3Cpath%20d%3D%22m21.854%202.147-10.94%2010.939%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-attach::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M13.234%2020.252%2021%2012.3%22%20%2F%3E%3Cpath%20d%3D%22m16%206-8.414%208.586a2%202%200%200%200%200%202.828%202%202%200%200%200%202.828%200l8.414-8.586a4%204%200%200%200%200-5.656%204%204%200%200%200-5.656%200l-8.415%208.585a6%206%200%201%200%208.486%208.486%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M13.234%2020.252%2021%2012.3%22%20%2F%3E%3Cpath%20d%3D%22m16%206-8.414%208.586a2%202%200%200%200%200%202.828%202%202%200%200%200%202.828%200l8.414-8.586a4%204%200%200%200%200-5.656%204%204%200%200%200-5.656%200l-8.415%208.585a6%206%200%201%200%208.486%208.486%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-image::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%229%22%20r%3D%222%22%20%2F%3E%3Cpath%20d%3D%22m21%2015-3.086-3.086a2%202%200%200%200-2.828%200L6%2021%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%229%22%20r%3D%222%22%20%2F%3E%3Cpath%20d%3D%22m21%2015-3.086-3.086a2%202%200%200%200-2.828%200L6%2021%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-link::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10%2013a5%205%200%200%200%207.54.54l3-3a5%205%200%200%200-7.07-7.07l-1.72%201.71%22%20%2F%3E%3Cpath%20d%3D%22M14%2011a5%205%200%200%200-7.54-.54l-3%203a5%205%200%200%200%207.07%207.07l1.71-1.71%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10%2013a5%205%200%200%200%207.54.54l3-3a5%205%200%200%200-7.07-7.07l-1.72%201.71%22%20%2F%3E%3Cpath%20d%3D%22M14%2011a5%205%200%200%200-7.54-.54l-3%203a5%205%200%200%200%207.07%207.07l1.71-1.71%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-lock::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2211%22%20x%3D%223%22%20y%3D%2211%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M7%2011V7a5%205%200%200%201%2010%200v4%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2211%22%20x%3D%223%22%20y%3D%2211%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M7%2011V7a5%205%200%200%201%2010%200v4%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-globe::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpath%20d%3D%22M12%202a14.5%2014.5%200%200%200%200%2020%2014.5%2014.5%200%200%200%200-20%22%20%2F%3E%3Cpath%20d%3D%22M2%2012h20%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpath%20d%3D%22M12%202a14.5%2014.5%200%200%200%200%2020%2014.5%2014.5%200%200%200%200-20%22%20%2F%3E%3Cpath%20d%3D%22M2%2012h20%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-terminal::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpolyline%20points%3D%224%2017%2010%2011%204%205%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2220%22%20y1%3D%2219%22%20y2%3D%2219%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpolyline%20points%3D%224%2017%2010%2011%204%205%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2220%22%20y1%3D%2219%22%20y2%3D%2219%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-code::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpolyline%20points%3D%2216%2018%2022%2012%2016%206%22%20%2F%3E%3Cpolyline%20points%3D%228%206%202%2012%208%2018%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpolyline%20points%3D%2216%2018%2022%2012%2016%206%22%20%2F%3E%3Cpolyline%20points%3D%228%206%202%2012%208%2018%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-git-branch::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cline%20x1%3D%226%22%20x2%3D%226%22%20y1%3D%223%22%20y2%3D%2215%22%20%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%226%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%2218%22%20r%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M18%209a9%209%200%200%201-9%209%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cline%20x1%3D%226%22%20x2%3D%226%22%20y1%3D%223%22%20y2%3D%2215%22%20%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%226%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%2218%22%20r%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M18%209a9%209%200%200%201-9%209%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-folder-opened::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m6%2014%201.5-2.9A2%202%200%200%201%209.24%2010H20a2%202%200%200%201%201.94%202.5l-1.54%206a2%202%200%200%201-1.95%201.5H4a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h3.9a2%202%200%200%201%201.69.9l.81%201.2a2%202%200%200%200%201.67.9H18a2%202%200%200%201%202%202v2%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m6%2014%201.5-2.9A2%202%200%200%201%209.24%2010H20a2%202%200%200%201%201.94%202.5l-1.54%206a2%202%200%200%201-1.95%201.5H4a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h3.9a2%202%200%200%201%201.69.9l.81%201.2a2%202%200%200%200%201.67.9H18a2%202%200%200%201%202%202v2%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-folder::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%2020a2%202%200%200%200%202-2V8a2%202%200%200%200-2-2h-7.9a2%202%200%200%201-1.69-.9L9.6%203.9A2%202%200%200%200%207.93%203H4a2%202%200%200%200-2%202v13a2%202%200%200%200%202%202Z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%2020a2%202%200%200%200%202-2V8a2%202%200%200%200-2-2h-7.9a2%202%200%200%201-1.69-.9L9.6%203.9A2%202%200%200%200%207.93%203H4a2%202%200%200%200-2%202v13a2%202%200%200%200%202%202Z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-file::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%202H6a2%202%200%200%200-2%202v16a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V7Z%22%20%2F%3E%3Cpath%20d%3D%22M14%202v4a2%202%200%200%200%202%202h4%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%202H6a2%202%200%200%200-2%202v16a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V7Z%22%20%2F%3E%3Cpath%20d%3D%22M14%202v4a2%202%200%200%200%202%202h4%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-new-file::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%202H6a2%202%200%200%200-2%202v16a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V7Z%22%20%2F%3E%3Cpath%20d%3D%22M14%202v4a2%202%200%200%200%202%202h4%22%20%2F%3E%3Cpath%20d%3D%22M9%2015h6%22%20%2F%3E%3Cpath%20d%3D%22M12%2018v-6%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%202H6a2%202%200%200%200-2%202v16a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V7Z%22%20%2F%3E%3Cpath%20d%3D%22M14%202v4a2%202%200%200%200%202%202h4%22%20%2F%3E%3Cpath%20d%3D%22M9%2015h6%22%20%2F%3E%3Cpath%20d%3D%22M12%2018v-6%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-save::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15.2%203a2%202%200%200%201%201.4.6l3.8%203.8a2%202%200%200%201%20.6%201.4V19a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2z%22%20%2F%3E%3Cpath%20d%3D%22M17%2021v-7a1%201%200%200%200-1-1H8a1%201%200%200%200-1%201v7%22%20%2F%3E%3Cpath%20d%3D%22M7%203v4a1%201%200%200%200%201%201h7%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15.2%203a2%202%200%200%201%201.4.6l3.8%203.8a2%202%200%200%201%20.6%201.4V19a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2z%22%20%2F%3E%3Cpath%20d%3D%22M17%2021v-7a1%201%200%200%200-1-1H8a1%201%200%200%200-1%201v7%22%20%2F%3E%3Cpath%20d%3D%22M7%203v4a1%201%200%200%200%201%201h7%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-calendar::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8%202v4%22%20%2F%3E%3Cpath%20d%3D%22M16%202v4%22%20%2F%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%224%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M3%2010h18%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8%202v4%22%20%2F%3E%3Cpath%20d%3D%22M16%202v4%22%20%2F%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%224%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M3%2010h18%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-clock::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpolyline%20points%3D%2212%206%2012%2012%2016%2014%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3Cpolyline%20points%3D%2212%206%2012%2012%2016%2014%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-mail::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2220%22%20height%3D%2216%22%20x%3D%222%22%20y%3D%224%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22m22%207-8.97%205.7a1.94%201.94%200%200%201-2.06%200L2%207%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2220%22%20height%3D%2216%22%20x%3D%222%22%20y%3D%224%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22m22%207-8.97%205.7a1.94%201.94%200%200%201-2.06%200L2%207%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-bell::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10.268%2021a2%202%200%200%200%203.464%200%22%20%2F%3E%3Cpath%20d%3D%22M3.262%2015.326A1%201%200%200%200%204%2017h16a1%201%200%200%200%20.74-1.673C19.41%2013.956%2018%2012.499%2018%208A6%206%200%200%200%206%208c0%204.499-1.411%205.956-2.738%207.326%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10.268%2021a2%202%200%200%200%203.464%200%22%20%2F%3E%3Cpath%20d%3D%22M3.262%2015.326A1%201%200%200%200%204%2017h16a1%201%200%200%200%20.74-1.673C19.41%2013.956%2018%2012.499%2018%208A6%206%200%200%200%206%208c0%204.499-1.411%205.956-2.738%207.326%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-star::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M11.525%202.295a.53.53%200%200%201%20.95%200l2.31%204.679a2.123%202.123%200%200%200%201.595%201.16l5.166.756a.53.53%200%200%201%20.294.904l-3.736%203.638a2.123%202.123%200%200%200-.611%201.878l.882%205.14a.53.53%200%200%201-.771.56l-4.618-2.428a2.122%202.122%200%200%200-1.973%200L6.396%2021.01a.53.53%200%200%201-.77-.56l.881-5.139a2.122%202.122%200%200%200-.611-1.879L2.16%209.795a.53.53%200%200%201%20.294-.906l5.165-.755a2.122%202.122%200%200%200%201.597-1.16z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M11.525%202.295a.53.53%200%200%201%20.95%200l2.31%204.679a2.123%202.123%200%200%200%201.595%201.16l5.166.756a.53.53%200%200%201%20.294.904l-3.736%203.638a2.123%202.123%200%200%200-.611%201.878l.882%205.14a.53.53%200%200%201-.771.56l-4.618-2.428a2.122%202.122%200%200%200-1.973%200L6.396%2021.01a.53.53%200%200%201-.77-.56l.881-5.139a2.122%202.122%200%200%200-.611-1.879L2.16%209.795a.53.53%200%200%201%20.294-.906l5.165-.755a2.122%202.122%200%200%200%201.597-1.16z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-star-empty::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M11.525%202.295a.53.53%200%200%201%20.95%200l2.31%204.679a2.123%202.123%200%200%200%201.595%201.16l5.166.756a.53.53%200%200%201%20.294.904l-3.736%203.638a2.123%202.123%200%200%200-.611%201.878l.882%205.14a.53.53%200%200%201-.771.56l-4.618-2.428a2.122%202.122%200%200%200-1.973%200L6.396%2021.01a.53.53%200%200%201-.77-.56l.881-5.139a2.122%202.122%200%200%200-.611-1.879L2.16%209.795a.53.53%200%200%201%20.294-.906l5.165-.755a2.122%202.122%200%200%200%201.597-1.16z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M11.525%202.295a.53.53%200%200%201%20.95%200l2.31%204.679a2.123%202.123%200%200%200%201.595%201.16l5.166.756a.53.53%200%200%201%20.294.904l-3.736%203.638a2.123%202.123%200%200%200-.611%201.878l.882%205.14a.53.53%200%200%201-.771.56l-4.618-2.428a2.122%202.122%200%200%200-1.973%200L6.396%2021.01a.53.53%200%200%201-.77-.56l.881-5.139a2.122%202.122%200%200%200-.611-1.879L2.16%209.795a.53.53%200%200%201%20.294-.906l5.165-.755a2.122%202.122%200%200%200%201.597-1.16z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-heart::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M19%2014c1.49-1.46%203-3.21%203-5.5A5.5%205.5%200%200%200%2016.5%203c-1.76%200-3%20.5-4.5%202-1.5-1.5-2.74-2-4.5-2A5.5%205.5%200%200%200%202%208.5c0%202.3%201.5%204.05%203%205.5l7%207Z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M19%2014c1.49-1.46%203-3.21%203-5.5A5.5%205.5%200%200%200%2016.5%203c-1.76%200-3%20.5-4.5%202-1.5-1.5-2.74-2-4.5-2A5.5%205.5%200%200%200%202%208.5c0%202.3%201.5%204.05%203%205.5l7%207Z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-eye::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M2.062%2012.348a1%201%200%200%201%200-.696%2010.75%2010.75%200%200%201%2019.876%200%201%201%200%200%201%200%20.696%2010.75%2010.75%200%200%201-19.876%200%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M2.062%2012.348a1%201%200%200%201%200-.696%2010.75%2010.75%200%200%201%2019.876%200%201%201%200%200%201%200%20.696%2010.75%2010.75%200%200%201-19.876%200%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-eye-closed::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10.733%205.076a10.744%2010.744%200%200%201%2011.205%206.575%201%201%200%200%201%200%20.696%2010.747%2010.747%200%200%201-1.444%202.49%22%20%2F%3E%3Cpath%20d%3D%22M14.084%2014.158a3%203%200%200%201-4.242-4.242%22%20%2F%3E%3Cpath%20d%3D%22M17.479%2017.499a10.75%2010.75%200%200%201-15.417-5.151%201%201%200%200%201%200-.696%2010.75%2010.75%200%200%201%204.446-5.143%22%20%2F%3E%3Cpath%20d%3D%22m2%202%2020%2020%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10.733%205.076a10.744%2010.744%200%200%201%2011.205%206.575%201%201%200%200%201%200%20.696%2010.747%2010.747%200%200%201-1.444%202.49%22%20%2F%3E%3Cpath%20d%3D%22M14.084%2014.158a3%203%200%200%201-4.242-4.242%22%20%2F%3E%3Cpath%20d%3D%22M17.479%2017.499a10.75%2010.75%200%200%201-15.417-5.151%201%201%200%200%201%200-.696%2010.75%2010.75%200%200%201%204.446-5.143%22%20%2F%3E%3Cpath%20d%3D%22m2%202%2020%2020%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-key::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m15.5%207.5%202.3%202.3a1%201%200%200%200%201.4%200l2.1-2.1a1%201%200%200%200%200-1.4L19%204%22%20%2F%3E%3Cpath%20d%3D%22m21%202-9.6%209.6%22%20%2F%3E%3Ccircle%20cx%3D%227.5%22%20cy%3D%2215.5%22%20r%3D%225.5%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m15.5%207.5%202.3%202.3a1%201%200%200%200%201.4%200l2.1-2.1a1%201%200%200%200%200-1.4L19%204%22%20%2F%3E%3Cpath%20d%3D%22m21%202-9.6%209.6%22%20%2F%3E%3Ccircle%20cx%3D%227.5%22%20cy%3D%2215.5%22%20r%3D%225.5%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-shield::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%2013c0%205-3.5%207.5-7.66%208.95a1%201%200%200%201-.67-.01C7.5%2020.5%204%2018%204%2013V6a1%201%200%200%201%201-1c2%200%204.5-1.2%206.24-2.72a1.17%201.17%200%200%201%201.52%200C14.51%203.81%2017%205%2019%205a1%201%200%200%201%201%201z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%2013c0%205-3.5%207.5-7.66%208.95a1%201%200%200%201-.67-.01C7.5%2020.5%204%2018%204%2013V6a1%201%200%200%201%201-1c2%200%204.5-1.2%206.24-2.72a1.17%201.17%200%200%201%201.52%200C14.51%203.81%2017%205%2019%205a1%201%200%200%201%201%201z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-rocket::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4.5%2016.5c-1.5%201.26-2%205-2%205s3.74-.5%205-2c.71-.84.7-2.13-.09-2.91a2.18%202.18%200%200%200-2.91-.09z%22%20%2F%3E%3Cpath%20d%3D%22m12%2015-3-3a22%2022%200%200%201%202-3.95A12.88%2012.88%200%200%201%2022%202c0%202.72-.78%207.5-6%2011a22.35%2022.35%200%200%201-4%202z%22%20%2F%3E%3Cpath%20d%3D%22M9%2012H4s.55-3.03%202-4c1.62-1.08%205%200%205%200%22%20%2F%3E%3Cpath%20d%3D%22M12%2015v5s3.03-.55%204-2c1.08-1.62%200-5%200-5%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4.5%2016.5c-1.5%201.26-2%205-2%205s3.74-.5%205-2c.71-.84.7-2.13-.09-2.91a2.18%202.18%200%200%200-2.91-.09z%22%20%2F%3E%3Cpath%20d%3D%22m12%2015-3-3a22%2022%200%200%201%202-3.95A12.88%2012.88%200%200%201%2022%202c0%202.72-.78%207.5-6%2011a22.35%2022.35%200%200%201-4%202z%22%20%2F%3E%3Cpath%20d%3D%22M9%2012H4s.55-3.03%202-4c1.62-1.08%205%200%205%200%22%20%2F%3E%3Cpath%20d%3D%22M12%2015v5s3.03-.55%204-2c1.08-1.62%200-5%200-5%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-sparkle::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9.937%2015.5A2%202%200%200%200%208.5%2014.063l-6.135-1.582a.5.5%200%200%201%200-.962L8.5%209.936A2%202%200%200%200%209.937%208.5l1.582-6.135a.5.5%200%200%201%20.963%200L14.063%208.5A2%202%200%200%200%2015.5%209.937l6.135%201.581a.5.5%200%200%201%200%20.964L15.5%2014.063a2%202%200%200%200-1.437%201.437l-1.582%206.135a.5.5%200%200%201-.963%200z%22%20%2F%3E%3Cpath%20d%3D%22M20%203v4%22%20%2F%3E%3Cpath%20d%3D%22M22%205h-4%22%20%2F%3E%3Cpath%20d%3D%22M4%2017v2%22%20%2F%3E%3Cpath%20d%3D%22M5%2018H3%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9.937%2015.5A2%202%200%200%200%208.5%2014.063l-6.135-1.582a.5.5%200%200%201%200-.962L8.5%209.936A2%202%200%200%200%209.937%208.5l1.582-6.135a.5.5%200%200%201%20.963%200L14.063%208.5A2%202%200%200%200%2015.5%209.937l6.135%201.581a.5.5%200%200%201%200%20.964L15.5%2014.063a2%202%200%200%200-1.437%201.437l-1.582%206.135a.5.5%200%200%201-.963%200z%22%20%2F%3E%3Cpath%20d%3D%22M20%203v4%22%20%2F%3E%3Cpath%20d%3D%22M22%205h-4%22%20%2F%3E%3Cpath%20d%3D%22M4%2017v2%22%20%2F%3E%3Cpath%20d%3D%22M5%2018H3%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-mic::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%202a3%203%200%200%200-3%203v7a3%203%200%200%200%206%200V5a3%203%200%200%200-3-3Z%22%20%2F%3E%3Cpath%20d%3D%22M19%2010v2a7%207%200%200%201-14%200v-2%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%2219%22%20y2%3D%2222%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%202a3%203%200%200%200-3%203v7a3%203%200%200%200%206%200V5a3%203%200%200%200-3-3Z%22%20%2F%3E%3Cpath%20d%3D%22M19%2010v2a7%207%200%200%201-14%200v-2%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%2219%22%20y2%3D%2222%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-mute::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M11%204.702a.705.705%200%200%200-1.203-.498L6.413%207.587A1.4%201.4%200%200%201%205.416%208H3a1%201%200%200%200-1%201v6a1%201%200%200%200%201%201h2.416a1.4%201.4%200%200%201%20.997.413l3.383%203.384A.705.705%200%200%200%2011%2019.298z%22%20%2F%3E%3Cline%20x1%3D%2222%22%20x2%3D%2216%22%20y1%3D%229%22%20y2%3D%2215%22%20%2F%3E%3Cline%20x1%3D%2216%22%20x2%3D%2222%22%20y1%3D%229%22%20y2%3D%2215%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M11%204.702a.705.705%200%200%200-1.203-.498L6.413%207.587A1.4%201.4%200%200%201%205.416%208H3a1%201%200%200%200-1%201v6a1%201%200%200%200%201%201h2.416a1.4%201.4%200%200%201%20.997.413l3.383%203.384A.705.705%200%200%200%2011%2019.298z%22%20%2F%3E%3Cline%20x1%3D%2222%22%20x2%3D%2216%22%20y1%3D%229%22%20y2%3D%2215%22%20%2F%3E%3Cline%20x1%3D%2216%22%20x2%3D%2222%22%20y1%3D%229%22%20y2%3D%2215%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-download::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2015v4a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2v-4%22%20%2F%3E%3Cpolyline%20points%3D%227%2010%2012%2015%2017%2010%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%2215%22%20y2%3D%223%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2015v4a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2v-4%22%20%2F%3E%3Cpolyline%20points%3D%227%2010%2012%2015%2017%2010%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%2215%22%20y2%3D%223%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-upload::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2015v4a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2v-4%22%20%2F%3E%3Cpolyline%20points%3D%2217%208%2012%203%207%208%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%223%22%20y2%3D%2215%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M21%2015v4a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2v-4%22%20%2F%3E%3Cpolyline%20points%3D%2217%208%2012%203%207%208%22%20%2F%3E%3Cline%20x1%3D%2212%22%20x2%3D%2212%22%20y1%3D%223%22%20y2%3D%2215%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-book::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%207v14%22%20%2F%3E%3Cpath%20d%3D%22M3%2018a1%201%200%200%201-1-1V4a1%201%200%200%201%201-1h5a4%204%200%200%201%204%204%204%204%200%200%201%204-4h5a1%201%200%200%201%201%201v13a1%201%200%200%201-1%201h-6a3%203%200%200%200-3%203%203%203%200%200%200-3-3z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12%207v14%22%20%2F%3E%3Cpath%20d%3D%22M3%2018a1%201%200%200%201-1-1V4a1%201%200%200%201%201-1h5a4%204%200%200%201%204%204%204%204%200%200%201%204-4h5a1%201%200%200%201%201%201v13a1%201%200%200%201-1%201h-6a3%203%200%200%200-3%203%203%203%200%200%200-3-3z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-map::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14.106%205.553a2%202%200%200%200%201.788%200l3.659-1.83A1%201%200%200%201%2021%204.619v12.764a1%201%200%200%201-.553.894l-4.553%202.277a2%202%200%200%201-1.788%200l-4.212-2.106a2%202%200%200%200-1.788%200l-3.659%201.83A1%201%200%200%201%203%2019.381V6.618a1%201%200%200%201%20.553-.894l4.553-2.277a2%202%200%200%201%201.788%200z%22%20%2F%3E%3Cpath%20d%3D%22M15%205.764v15%22%20%2F%3E%3Cpath%20d%3D%22M9%203.236v15%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14.106%205.553a2%202%200%200%200%201.788%200l3.659-1.83A1%201%200%200%201%2021%204.619v12.764a1%201%200%200%201-.553.894l-4.553%202.277a2%202%200%200%201-1.788%200l-4.212-2.106a2%202%200%200%200-1.788%200l-3.659%201.83A1%201%200%200%201%203%2019.381V6.618a1%201%200%200%201%20.553-.894l4.553-2.277a2%202%200%200%201%201.788%200z%22%20%2F%3E%3Cpath%20d%3D%22M15%205.764v15%22%20%2F%3E%3Cpath%20d%3D%22M9%203.236v15%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-compass::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m16.24%207.76-1.804%205.411a2%202%200%200%201-1.265%201.265L7.76%2016.24l1.804-5.411a2%202%200%200%201%201.265-1.265z%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m16.24%207.76-1.804%205.411a2%202%200%200%201-1.265%201.265L7.76%2016.24l1.804-5.411a2%202%200%200%201%201.265-1.265z%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-cpu::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2216%22%20height%3D%2216%22%20x%3D%224%22%20y%3D%224%22%20rx%3D%222%22%20%2F%3E%3Crect%20width%3D%226%22%20height%3D%226%22%20x%3D%229%22%20y%3D%229%22%20rx%3D%221%22%20%2F%3E%3Cpath%20d%3D%22M15%202v2%22%20%2F%3E%3Cpath%20d%3D%22M15%2020v2%22%20%2F%3E%3Cpath%20d%3D%22M2%2015h2%22%20%2F%3E%3Cpath%20d%3D%22M2%209h2%22%20%2F%3E%3Cpath%20d%3D%22M20%2015h2%22%20%2F%3E%3Cpath%20d%3D%22M20%209h2%22%20%2F%3E%3Cpath%20d%3D%22M9%202v2%22%20%2F%3E%3Cpath%20d%3D%22M9%2020v2%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2216%22%20height%3D%2216%22%20x%3D%224%22%20y%3D%224%22%20rx%3D%222%22%20%2F%3E%3Crect%20width%3D%226%22%20height%3D%226%22%20x%3D%229%22%20y%3D%229%22%20rx%3D%221%22%20%2F%3E%3Cpath%20d%3D%22M15%202v2%22%20%2F%3E%3Cpath%20d%3D%22M15%2020v2%22%20%2F%3E%3Cpath%20d%3D%22M2%2015h2%22%20%2F%3E%3Cpath%20d%3D%22M2%209h2%22%20%2F%3E%3Cpath%20d%3D%22M20%2015h2%22%20%2F%3E%3Cpath%20d%3D%22M20%209h2%22%20%2F%3E%3Cpath%20d%3D%22M9%202v2%22%20%2F%3E%3Cpath%20d%3D%22M9%2020v2%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-package::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M11%2021.73a2%202%200%200%200%202%200l7-4A2%202%200%200%200%2021%2016V8a2%202%200%200%200-1-1.73l-7-4a2%202%200%200%200-2%200l-7%204A2%202%200%200%200%203%208v8a2%202%200%200%200%201%201.73z%22%20%2F%3E%3Cpath%20d%3D%22M12%2022V12%22%20%2F%3E%3Cpath%20d%3D%22m3.3%207%207.703%204.734a2%202%200%200%200%201.994%200L20.7%207%22%20%2F%3E%3Cpath%20d%3D%22m7.5%204.27%209%205.15%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M11%2021.73a2%202%200%200%200%202%200l7-4A2%202%200%200%200%2021%2016V8a2%202%200%200%200-1-1.73l-7-4a2%202%200%200%200-2%200l-7%204A2%202%200%200%200%203%208v8a2%202%200%200%200%201%201.73z%22%20%2F%3E%3Cpath%20d%3D%22M12%2022V12%22%20%2F%3E%3Cpath%20d%3D%22m3.3%207%207.703%204.734a2%202%200%200%200%201.994%200L20.7%207%22%20%2F%3E%3Cpath%20d%3D%22m7.5%204.27%209%205.15%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-cloud::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M17.5%2019H9a7%207%200%201%201%206.71-9h1.79a4.5%204.5%200%201%201%200%209Z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M17.5%2019H9a7%207%200%201%201%206.71-9h1.79a4.5%204.5%200%201%201%200%209Z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-server::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2220%22%20height%3D%228%22%20x%3D%222%22%20y%3D%222%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Crect%20width%3D%2220%22%20height%3D%228%22%20x%3D%222%22%20y%3D%2214%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cline%20x1%3D%226%22%20x2%3D%226.01%22%20y1%3D%226%22%20y2%3D%226%22%20%2F%3E%3Cline%20x1%3D%226%22%20x2%3D%226.01%22%20y1%3D%2218%22%20y2%3D%2218%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2220%22%20height%3D%228%22%20x%3D%222%22%20y%3D%222%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Crect%20width%3D%2220%22%20height%3D%228%22%20x%3D%222%22%20y%3D%2214%22%20rx%3D%222%22%20ry%3D%222%22%20%2F%3E%3Cline%20x1%3D%226%22%20x2%3D%226.01%22%20y1%3D%226%22%20y2%3D%226%22%20%2F%3E%3Cline%20x1%3D%226%22%20x2%3D%226.01%22%20y1%3D%2218%22%20y2%3D%2218%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-database::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cellipse%20cx%3D%2212%22%20cy%3D%225%22%20rx%3D%229%22%20ry%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M3%205V19A9%203%200%200%200%2021%2019V5%22%20%2F%3E%3Cpath%20d%3D%22M3%2012A9%203%200%200%200%2021%2012%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cellipse%20cx%3D%2212%22%20cy%3D%225%22%20rx%3D%229%22%20ry%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M3%205V19A9%203%200%200%200%2021%2019V5%22%20%2F%3E%3Cpath%20d%3D%22M3%2012A9%203%200%200%200%2021%2012%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-graph::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%203v16a2%202%200%200%200%202%202h16%22%20%2F%3E%3Cpath%20d%3D%22m19%209-5%205-4-4-3%203%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%203v16a2%202%200%200%200%202%202h16%22%20%2F%3E%3Cpath%20d%3D%22m19%209-5%205-4-4-3%203%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-pulse::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M22%2012h-2.48a2%202%200%200%200-1.93%201.46l-2.35%208.36a.25.25%200%200%201-.48%200L9.24%202.18a.25.25%200%200%200-.48%200l-2.35%208.36A2%202%200%200%201%204.49%2012H2%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M22%2012h-2.48a2%202%200%200%200-1.93%201.46l-2.35%208.36a.25.25%200%200%201-.48%200L9.24%202.18a.25.25%200%200%200-.48%200l-2.35%208.36A2%202%200%200%201%204.49%2012H2%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-beaker::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14%202v6a2%202%200%200%200%20.245.96l5.51%2010.08A2%202%200%200%201%2018%2022H6a2%202%200%200%201-1.755-2.96l5.51-10.08A2%202%200%200%200%2010%208V2%22%20%2F%3E%3Cpath%20d%3D%22M6.453%2015h11.094%22%20%2F%3E%3Cpath%20d%3D%22M8.5%202h7%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14%202v6a2%202%200%200%200%20.245.96l5.51%2010.08A2%202%200%200%201%2018%2022H6a2%202%200%200%201-1.755-2.96l5.51-10.08A2%202%200%200%200%2010%208V2%22%20%2F%3E%3Cpath%20d%3D%22M6.453%2015h11.094%22%20%2F%3E%3Cpath%20d%3D%22M8.5%202h7%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-tools::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14.7%206.3a1%201%200%200%200%200%201.4l1.6%201.6a1%201%200%200%200%201.4%200l3.77-3.77a6%206%200%200%201-7.94%207.94l-6.91%206.91a2.12%202.12%200%200%201-3-3l6.91-6.91a6%206%200%200%201%207.94-7.94l-3.76%203.76z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M14.7%206.3a1%201%200%200%200%200%201.4l1.6%201.6a1%201%200%200%200%201.4%200l3.77-3.77a6%206%200%200%201-7.94%207.94l-6.91%206.91a2.12%202.12%200%200%201-3-3l6.91-6.91a6%206%200%200%201%207.94-7.94l-3.76%203.76z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-bug::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m8%202%201.88%201.88%22%20%2F%3E%3Cpath%20d%3D%22M14.12%203.88%2016%202%22%20%2F%3E%3Cpath%20d%3D%22M9%207.13v-1a3.003%203.003%200%201%201%206%200v1%22%20%2F%3E%3Cpath%20d%3D%22M12%2020c-3.3%200-6-2.7-6-6v-3a4%204%200%200%201%204-4h4a4%204%200%200%201%204%204v3c0%203.3-2.7%206-6%206%22%20%2F%3E%3Cpath%20d%3D%22M12%2020v-9%22%20%2F%3E%3Cpath%20d%3D%22M6.53%209C4.6%208.8%203%207.1%203%205%22%20%2F%3E%3Cpath%20d%3D%22M6%2013H2%22%20%2F%3E%3Cpath%20d%3D%22M3%2021c0-2.1%201.7-3.9%203.8-4%22%20%2F%3E%3Cpath%20d%3D%22M20.97%205c0%202.1-1.6%203.8-3.5%204%22%20%2F%3E%3Cpath%20d%3D%22M22%2013h-4%22%20%2F%3E%3Cpath%20d%3D%22M17.2%2017c2.1.1%203.8%201.9%203.8%204%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m8%202%201.88%201.88%22%20%2F%3E%3Cpath%20d%3D%22M14.12%203.88%2016%202%22%20%2F%3E%3Cpath%20d%3D%22M9%207.13v-1a3.003%203.003%200%201%201%206%200v1%22%20%2F%3E%3Cpath%20d%3D%22M12%2020c-3.3%200-6-2.7-6-6v-3a4%204%200%200%201%204-4h4a4%204%200%200%201%204%204v3c0%203.3-2.7%206-6%206%22%20%2F%3E%3Cpath%20d%3D%22M12%2020v-9%22%20%2F%3E%3Cpath%20d%3D%22M6.53%209C4.6%208.8%203%207.1%203%205%22%20%2F%3E%3Cpath%20d%3D%22M6%2013H2%22%20%2F%3E%3Cpath%20d%3D%22M3%2021c0-2.1%201.7-3.9%203.8-4%22%20%2F%3E%3Cpath%20d%3D%22M20.97%205c0%202.1-1.6%203.8-3.5%204%22%20%2F%3E%3Cpath%20d%3D%22M22%2013h-4%22%20%2F%3E%3Cpath%20d%3D%22M17.2%2017c2.1.1%203.8%201.9%203.8%204%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-lightbulb::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%2014c.2-1%20.7-1.7%201.5-2.5%201-.9%201.5-2.2%201.5-3.5A6%206%200%200%200%206%208c0%201%20.2%202.2%201.5%203.5.7.7%201.3%201.5%201.5%202.5%22%20%2F%3E%3Cpath%20d%3D%22M9%2018h6%22%20%2F%3E%3Cpath%20d%3D%22M10%2022h4%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%2014c.2-1%20.7-1.7%201.5-2.5%201-.9%201.5-2.2%201.5-3.5A6%206%200%200%200%206%208c0%201%20.2%202.2%201.5%203.5.7.7%201.3%201.5%201.5%202.5%22%20%2F%3E%3Cpath%20d%3D%22M9%2018h6%22%20%2F%3E%3Cpath%20d%3D%22M10%2022h4%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-list-ordered::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10%2012h11%22%20%2F%3E%3Cpath%20d%3D%22M10%2018h11%22%20%2F%3E%3Cpath%20d%3D%22M10%206h11%22%20%2F%3E%3Cpath%20d%3D%22M4%2010h2%22%20%2F%3E%3Cpath%20d%3D%22M4%206h1v4%22%20%2F%3E%3Cpath%20d%3D%22M6%2018H4c0-1%202-2%202-3s-1-1.5-2-1%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M10%2012h11%22%20%2F%3E%3Cpath%20d%3D%22M10%2018h11%22%20%2F%3E%3Cpath%20d%3D%22M10%206h11%22%20%2F%3E%3Cpath%20d%3D%22M4%2010h2%22%20%2F%3E%3Cpath%20d%3D%22M4%206h1v4%22%20%2F%3E%3Cpath%20d%3D%22M6%2018H4c0-1%202-2%202-3s-1-1.5-2-1%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-list-unordered::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012h.01%22%20%2F%3E%3Cpath%20d%3D%22M3%2018h.01%22%20%2F%3E%3Cpath%20d%3D%22M3%206h.01%22%20%2F%3E%3Cpath%20d%3D%22M8%2012h13%22%20%2F%3E%3Cpath%20d%3D%22M8%2018h13%22%20%2F%3E%3Cpath%20d%3D%22M8%206h13%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3%2012h.01%22%20%2F%3E%3Cpath%20d%3D%22M3%2018h.01%22%20%2F%3E%3Cpath%20d%3D%22M3%206h.01%22%20%2F%3E%3Cpath%20d%3D%22M8%2012h13%22%20%2F%3E%3Cpath%20d%3D%22M8%2018h13%22%20%2F%3E%3Cpath%20d%3D%22M8%206h13%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-tasklist::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m3%2017%202%202%204-4%22%20%2F%3E%3Cpath%20d%3D%22m3%207%202%202%204-4%22%20%2F%3E%3Cpath%20d%3D%22M13%206h8%22%20%2F%3E%3Cpath%20d%3D%22M13%2012h8%22%20%2F%3E%3Cpath%20d%3D%22M13%2018h8%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m3%2017%202%202%204-4%22%20%2F%3E%3Cpath%20d%3D%22m3%207%202%202%204-4%22%20%2F%3E%3Cpath%20d%3D%22M13%206h8%22%20%2F%3E%3Cpath%20d%3D%22M13%2012h8%22%20%2F%3E%3Cpath%20d%3D%22M13%2018h8%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-split-horizontal::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M12%203v18%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M12%203v18%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-split-vertical::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M3%2012h18%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20width%3D%2218%22%20height%3D%2218%22%20x%3D%223%22%20y%3D%223%22%20rx%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M3%2012h18%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-screen-full::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8%203H5a2%202%200%200%200-2%202v3%22%20%2F%3E%3Cpath%20d%3D%22M21%208V5a2%202%200%200%200-2-2h-3%22%20%2F%3E%3Cpath%20d%3D%22M3%2016v3a2%202%200%200%200%202%202h3%22%20%2F%3E%3Cpath%20d%3D%22M16%2021h3a2%202%200%200%200%202-2v-3%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8%203H5a2%202%200%200%200-2%202v3%22%20%2F%3E%3Cpath%20d%3D%22M21%208V5a2%202%200%200%200-2-2h-3%22%20%2F%3E%3Cpath%20d%3D%22M3%2016v3a2%202%200%200%200%202%202h3%22%20%2F%3E%3Cpath%20d%3D%22M16%2021h3a2%202%200%200%200%202-2v-3%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-diff::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%226%22%20r%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M13%206h3a2%202%200%200%201%202%202v7%22%20%2F%3E%3Cpath%20d%3D%22M11%2018H8a2%202%200%200%201-2-2V9%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%226%22%20cy%3D%226%22%20r%3D%223%22%20%2F%3E%3Cpath%20d%3D%22M13%206h3a2%202%200%200%201%202%202v7%22%20%2F%3E%3Cpath%20d%3D%22M11%2018H8a2%202%200%200%201-2-2V9%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-repo::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9%2020H4a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h3.9a2%202%200%200%201%201.69.9l.81%201.2a2%202%200%200%200%201.67.9H20a2%202%200%200%201%202%202v5%22%20%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2212%22%20r%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M18%2019c-2.8%200-5-2.2-5-5v8%22%20%2F%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2219%22%20r%3D%222%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9%2020H4a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h3.9a2%202%200%200%201%201.69.9l.81%201.2a2%202%200%200%200%201.67.9H20a2%202%200%200%201%202%202v5%22%20%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2212%22%20r%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M18%2019c-2.8%200-5-2.2-5-5v8%22%20%2F%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2219%22%20r%3D%222%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-sign-out::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9%2021H5a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h4%22%20%2F%3E%3Cpolyline%20points%3D%2216%2017%2021%2012%2016%207%22%20%2F%3E%3Cline%20x1%3D%2221%22%20x2%3D%229%22%20y1%3D%2212%22%20y2%3D%2212%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M9%2021H5a2%202%200%200%201-2-2V5a2%202%200%200%201%202-2h4%22%20%2F%3E%3Cpolyline%20points%3D%2216%2017%2021%2012%2016%207%22%20%2F%3E%3Cline%20x1%3D%2221%22%20x2%3D%229%22%20y1%3D%2212%22%20y2%3D%2212%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-sign-in::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%203h4a2%202%200%200%201%202%202v14a2%202%200%200%201-2%202h-4%22%20%2F%3E%3Cpolyline%20points%3D%2210%2017%2015%2012%2010%207%22%20%2F%3E%3Cline%20x1%3D%2215%22%20x2%3D%223%22%20y1%3D%2212%22%20y2%3D%2212%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M15%203h4a2%202%200%200%201%202%202v14a2%202%200%200%201-2%202h-4%22%20%2F%3E%3Cpolyline%20points%3D%2210%2017%2015%2012%2010%207%22%20%2F%3E%3Cline%20x1%3D%2215%22%20x2%3D%223%22%20y1%3D%2212%22%20y2%3D%2212%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-tag::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.586%202.586A2%202%200%200%200%2011.172%202H4a2%202%200%200%200-2%202v7.172a2%202%200%200%200%20.586%201.414l8.704%208.704a2.426%202.426%200%200%200%203.42%200l6.58-6.58a2.426%202.426%200%200%200%200-3.42z%22%20%2F%3E%3Ccircle%20cx%3D%227.5%22%20cy%3D%227.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M12.586%202.586A2%202%200%200%200%2011.172%202H4a2%202%200%200%200-2%202v7.172a2%202%200%200%200%20.586%201.414l8.704%208.704a2.426%202.426%200%200%200%203.42%200l6.58-6.58a2.426%202.426%200%200%200%200-3.42z%22%20%2F%3E%3Ccircle%20cx%3D%227.5%22%20cy%3D%227.5%22%20r%3D%22.5%22%20fill%3D%22currentColor%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-verified::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3.85%208.62a4%204%200%200%201%204.78-4.77%204%204%200%200%201%206.74%200%204%204%200%200%201%204.78%204.78%204%204%200%200%201%200%206.74%204%204%200%200%201-4.77%204.78%204%204%200%200%201-6.75%200%204%204%200%200%201-4.78-4.77%204%204%200%200%201%200-6.76Z%22%20%2F%3E%3Cpath%20d%3D%22m9%2012%202%202%204-4%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M3.85%208.62a4%204%200%200%201%204.78-4.77%204%204%200%200%201%206.74%200%204%204%200%200%201%204.78%204.78%204%204%200%200%201%200%206.74%204%204%200%200%201-4.77%204.78%204%204%200%200%201-6.75%200%204%204%200%200%201-4.78-4.77%204%204%200%200%201%200-6.76Z%22%20%2F%3E%3Cpath%20d%3D%22m9%2012%202%202%204-4%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-unverified::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%2013c0%205-3.5%207.5-7.66%208.95a1%201%200%200%201-.67-.01C7.5%2020.5%204%2018%204%2013V6a1%201%200%200%201%201-1c2%200%204.5-1.2%206.24-2.72a1.17%201.17%200%200%201%201.52%200C14.51%203.81%2017%205%2019%205a1%201%200%200%201%201%201z%22%20%2F%3E%3Cpath%20d%3D%22M12%208v4%22%20%2F%3E%3Cpath%20d%3D%22M12%2016h.01%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M20%2013c0%205-3.5%207.5-7.66%208.95a1%201%200%200%201-.67-.01C7.5%2020.5%204%2018%204%2013V6a1%201%200%200%201%201-1c2%200%204.5-1.2%206.24-2.72a1.17%201.17%200%200%201%201.52%200C14.51%203.81%2017%205%2019%205a1%201%200%200%201%201%201z%22%20%2F%3E%3Cpath%20d%3D%22M12%208v4%22%20%2F%3E%3Cpath%20d%3D%22M12%2016h.01%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-megaphone::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m3%2011%2018-5v12L3%2014v-3z%22%20%2F%3E%3Cpath%20d%3D%22M11.6%2016.8a3%203%200%201%201-5.8-1.6%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22m3%2011%2018-5v12L3%2014v-3z%22%20%2F%3E%3Cpath%20d%3D%22M11.6%2016.8a3%203%200%201%201-5.8-1.6%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-gift::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20x%3D%223%22%20y%3D%228%22%20width%3D%2218%22%20height%3D%224%22%20rx%3D%221%22%20%2F%3E%3Cpath%20d%3D%22M12%208v13%22%20%2F%3E%3Cpath%20d%3D%22M19%2012v7a2%202%200%200%201-2%202H7a2%202%200%200%201-2-2v-7%22%20%2F%3E%3Cpath%20d%3D%22M7.5%208a2.5%202.5%200%200%201%200-5A4.8%208%200%200%201%2012%208a4.8%208%200%200%201%204.5-5%202.5%202.5%200%200%201%200%205%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Crect%20x%3D%223%22%20y%3D%228%22%20width%3D%2218%22%20height%3D%224%22%20rx%3D%221%22%20%2F%3E%3Cpath%20d%3D%22M12%208v13%22%20%2F%3E%3Cpath%20d%3D%22M19%2012v7a2%202%200%200%201-2%202H7a2%202%200%200%201-2-2v-7%22%20%2F%3E%3Cpath%20d%3D%22M7.5%208a2.5%202.5%200%200%201%200-5A4.8%208%200%200%201%2012%208a4.8%208%200%200%201%204.5-5%202.5%202.5%200%200%201%200%205%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-flame::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8.5%2014.5A2.5%202.5%200%200%200%2011%2012c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054%202-6%20.5%202.5%202%204.9%204%206.5%202%201.6%203%203.5%203%205.5a7%207%200%201%201-14%200c0-1.153.433-2.294%201-3a2.5%202.5%200%200%200%202.5%202.5z%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8.5%2014.5A2.5%202.5%200%200%200%2011%2012c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054%202-6%20.5%202.5%202%204.9%204%206.5%202%201.6%203%203.5%203%205.5a7%207%200%201%201-14%200c0-1.153.433-2.294%201-3a2.5%202.5%200%200%200%202.5%202.5z%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-mirror::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8%203H5a2%202%200%200%200-2%202v14c0%201.1.9%202%202%202h3%22%20%2F%3E%3Cpath%20d%3D%22M16%203h3a2%202%200%200%201%202%202v14a2%202%200%200%201-2%202h-3%22%20%2F%3E%3Cpath%20d%3D%22M12%2020v2%22%20%2F%3E%3Cpath%20d%3D%22M12%2014v2%22%20%2F%3E%3Cpath%20d%3D%22M12%208v2%22%20%2F%3E%3Cpath%20d%3D%22M12%202v2%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M8%203H5a2%202%200%200%200-2%202v14c0%201.1.9%202%202%202h3%22%20%2F%3E%3Cpath%20d%3D%22M16%203h3a2%202%200%200%201%202%202v14a2%202%200%200%201-2%202h-3%22%20%2F%3E%3Cpath%20d%3D%22M12%2020v2%22%20%2F%3E%3Cpath%20d%3D%22M12%2014v2%22%20%2F%3E%3Cpath%20d%3D%22M12%208v2%22%20%2F%3E%3Cpath%20d%3D%22M12%202v2%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-remote::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4.9%2019.1C1%2015.2%201%208.8%204.9%204.9%22%20%2F%3E%3Cpath%20d%3D%22M7.8%2016.2c-2.3-2.3-2.3-6.1%200-8.5%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M16.2%207.8c2.3%202.3%202.3%206.1%200%208.5%22%20%2F%3E%3Cpath%20d%3D%22M19.1%204.9C23%208.8%2023%2015.1%2019.1%2019%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpath%20d%3D%22M4.9%2019.1C1%2015.2%201%208.8%204.9%204.9%22%20%2F%3E%3Cpath%20d%3D%22M7.8%2016.2c-2.3-2.3-2.3-6.1%200-8.5%22%20%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222%22%20%2F%3E%3Cpath%20d%3D%22M16.2%207.8c2.3%202.3%202.3%206.1%200%208.5%22%20%2F%3E%3Cpath%20d%3D%22M19.1%204.9C23%208.8%2023%2015.1%2019.1%2019%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
:root:is([data-hermes-theme^="tide"],[data-hermes-theme^="mint"],[data-hermes-theme^="frost"]) .codicon.codicon-run::before { content:"" !important; display:block !important; width:1em; height:1em; background-color:currentColor; -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpolygon%20points%3D%226%203%2020%2012%206%2021%206%203%22%20%2F%3E%3C%2Fsvg%3E"); mask-image:url("data:image/svg+xml,%3Csvg%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20viewBox%3D%220%200%2024%2024%22%20%20%20fill%3D%22none%22%20%20%20stroke%3D%22currentColor%22%20%20%20stroke-width%3D%222%22%20%20%20stroke-linecap%3D%22round%22%20%20%20stroke-linejoin%3D%22round%22%20%3E%3Cpolygon%20points%3D%226%203%2020%2012%206%2021%206%203%22%20%2F%3E%3C%2Fsvg%3E"); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; -webkit-mask-position:center; mask-position:center; -webkit-mask-size:contain; mask-size:contain; }
`;

// src/theme-gallery.tsx
import { Button as Button2, useTheme } from "@hermes/plugin-sdk";

// src/chrome.ts
var lightTokens = (t) => `
  --t-accent: ${t.accent};
  --t-accent-deep: ${t.accentDeep};
  --t-accent-soft: ${t.accentSoft};
  --t-page: ${t.page};
  --t-side: ${t.side};
  --t-line: ${t.line};
  --t-ink: ${t.ink};
  --t-text-2: ${t.text2};
  --t-text-3: ${t.text3};
  --t-hover: ${t.hover};
  --t-chip: ${t.chip};
  --t-active-bg: ${t.activeBg};
  --t-active-ink: ${t.activeInk};
  --t-active-shadow: ${t.activeShadow};
  --t-tab-bg: ${t.tabActiveBg};
  --t-tab-ink: ${t.tabActiveInk};
  --t-tab-shadow: ${t.tabShadow};
  --t-tabstrip: ${t.tabStrip};
  --t-item-radius: ${t.itemRadius}px;
  --t-card-radius: ${t.cardRadius}px;
  --t-btn-radius: ${t.btnRadius}px;
  --t-input-radius: ${t.inputRadius}px;
  --t-composer-radius: ${t.composerRadius}px;
  --t-composer-shadow: ${t.composerShadow};
  --t-glow: ${t.glow};
  --radius: ${t.cardRadius}px;`;
var darkTokens = (d) => `
  --t-accent: ${d.accent};
  --t-accent-deep: ${d.accentDeep};
  --t-accent-soft: ${d.accentSoft};
  --t-page: ${d.page};
  --t-side: ${d.side};
  --t-line: ${d.line};
  --t-ink: ${d.ink};
  --t-text-2: ${d.text2};
  --t-text-3: ${d.text3};
  --t-hover: ${d.hover};
  --t-chip: ${d.chip};
  --t-active-bg: ${d.activeBg};
  --t-active-ink: ${d.activeInk};
  --t-active-shadow: ${d.activeShadow};
  --t-tab-bg: ${d.tabActiveBg};
  --t-tab-ink: ${d.tabActiveInk};
  --t-tab-shadow: ${d.tabShadow};
  --t-tabstrip: ${d.tabStrip};
  --t-composer-shadow: ${d.composerShadow};
  --t-glow: ${d.glow};`;
var uiLight = (t) => `
  --ui-bg-chrome: ${t.page};
  --ui-bg-sidebar: ${t.side};
  --ui-bg-editor: ${t.page};
  --ui-bg-elevated: #FFFFFF;
  --ui-bg-card: #FFFFFF;
  --ui-bg-input: #FFFFFF;
  --ui-bg-primary: #FFFFFF;
  --ui-bg-secondary: ${t.hover};
  --ui-bg-tertiary: color-mix(in srgb, ${t.hover} 78%, ${t.line});
  --ui-bg-quaternary: color-mix(in srgb, ${t.hover} 60%, ${t.line});
  --ui-bg-quinary: color-mix(in srgb, ${t.hover} 46%, ${t.line});
  --ui-text-primary: ${t.ink};
  --ui-text-secondary: ${t.text2};
  --ui-text-tertiary: ${t.text3};
  --ui-text-quaternary: color-mix(in srgb, ${t.text3} 68%, transparent);
  --ui-stroke-primary: ${t.line};
  --ui-stroke-secondary: color-mix(in srgb, ${t.line} 78%, transparent);
  --ui-stroke-tertiary: color-mix(in srgb, ${t.line} 58%, transparent);
  --ui-stroke-quaternary: color-mix(in srgb, ${t.line} 40%, transparent);
  --ui-accent: ${t.accent};
  --ui-success: ${t.accent};
  --ui-row-hover-background: ${t.hover};
  --ui-control-hover-background: ${t.hover};
  --ui-control-active-background: color-mix(in srgb, ${t.accent} 14%, ${t.hover});
  --chrome-action-hover: ${t.hover};
  --sidebar-edge-border: ${t.line};`;
function buildChrome(t, d) {
  const R = `:root[data-hermes-theme^="${t.name}"]`;
  return `${R} {${lightTokens(t)} }
${R}[data-hermes-mode="light"] {${uiLight(t)} }
${R}[data-hermes-mode="dark"] {${darkTokens(d)} }

/* \u2500\u2500 Window chrome \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${R} [data-panel-header] {
  background: var(--t-side) !important;
  border-bottom: 1px solid var(--t-line) !important;
}
${R} [data-window-drag-handle] { background: transparent !important; }
${R} [data-titlebar-cluster] button { border-radius: 8px !important; }
${R} [data-titlebar-cluster] button:hover { background: var(--t-hover) !important; }
${R} [data-titlebar-cluster] .codicon { color: var(--t-text-2) !important; }
${R} [data-titlebar-cluster] button:hover .codicon { color: var(--t-ink) !important; }
${R} [data-tree-group]:not(:has([data-slot="sidebar"])) {
  background-color: var(--t-page) !important;
  background-image: radial-gradient(110% 70% at 50% 0%, var(--t-glow) 0%, transparent 62%) !important;
  background-repeat: no-repeat !important;
}

/* \u2500\u2500 Sidebar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${R} [data-slot="sidebar"] {
  background: var(--t-side) !important;
  border-right: 1px solid var(--t-line) !important;
}
${R} [data-slot="sidebar"] [data-slot="sidebar-content"] { background: transparent !important; }
${R} [data-slot="sidebar-menu-item"] > button {
  height: 30px !important;
  border-radius: var(--t-item-radius) !important;
  font-weight: 600 !important;
  color: var(--t-text-2) !important;
}
${R} [data-slot="sidebar-menu-item"] > button:hover {
  background: var(--t-hover) !important;
  color: var(--t-ink) !important;
}
/* The current page is painted with a Tailwind utility that swaps the class
   name (no data attribute), so both that marker and data-active are honoured. */
${R} [data-slot="sidebar-menu-item"] > button[data-active="true"],
${R} [data-slot="sidebar-menu-item"] > button[class*="bg-(--ui-control-active-background)"] {
  background: var(--t-active-bg) !important;
  color: var(--t-active-ink) !important;
  border-color: transparent !important;
  box-shadow: var(--t-active-shadow) !important;
}
${R} [data-slot="sidebar-menu-item"] > button[data-active="true"]:hover,
${R} [data-slot="sidebar-menu-item"] > button[class*="bg-(--ui-control-active-background)"]:hover {
  background: var(--t-active-bg) !important;
  color: var(--t-active-ink) !important;
}

/* Icons get a tinted tile, so the rail reads as a designed icon set rather
   than a row of bare glyphs. The tile is the size of the row, not the glyph. */
${R} [data-slot="sidebar-menu-item"] > button > .codicon {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex: none !important;
  width: 20px !important;
  height: 20px !important;
  border-radius: calc(var(--t-item-radius) * 0.7) !important;
  background: var(--t-chip) !important;
  color: var(--t-accent) !important;
  font-size: 14px !important;
}
${R} [data-slot="sidebar-menu-item"] > button[data-active="true"] > .codicon,
${R} [data-slot="sidebar-menu-item"] > button[class*="bg-(--ui-control-active-background)"] > .codicon {
  background: color-mix(in srgb, var(--t-active-ink) 20%, transparent) !important;
  color: var(--t-active-ink) !important;
}

${R} [data-slot="sidebar-input"],
${R} [data-slot="sidebar"] input[type="search"] {
  border-radius: calc(var(--t-item-radius) + 2px) !important;
  background: color-mix(in srgb, var(--t-hover) 70%, transparent) !important;
  border: 1px solid transparent !important;
  box-shadow: none !important;
}
${R} [data-slot="sidebar-input"]:focus-within,
${R} [data-slot="sidebar"] input[type="search"]:focus {
  border-color: var(--t-accent) !important;
  background: var(--t-side) !important;
}

/* \u2500\u2500 Tabs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${R} [data-zone-tabstrip] {
  background: var(--t-tabstrip) !important;
  border-bottom: 0 !important;
}
${R} [data-slot="pane-tab"] {
  height: 22px !important;
  margin: 3px 1px !important;
  padding-inline: 9px !important;
  border: 0 !important;
  border-radius: 7px !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--t-text-3) !important;
  font-weight: 600 !important;
}
${R} [data-slot="pane-tab"]::after { display: none !important; }
${R} [data-slot="pane-tab"][data-active="true"] {
  background: var(--t-tab-bg) !important;
  color: var(--t-tab-ink) !important;
  box-shadow: var(--t-tab-shadow) !important;
}

/* \u2500\u2500 Buttons, chips, fields \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${R} [data-slot="button"] {
  border-radius: var(--t-btn-radius) !important;
  font-weight: 600 !important;
  transition: transform .16s ease, box-shadow .16s ease, filter .16s ease, background-color .16s ease !important;
}
${R} [data-slot="button"]:active { transform: translateY(1px) scale(.995); }
${R} [data-slot="kbd"] {
  border-radius: calc(var(--t-btn-radius) * .55) !important;
  border: 1px solid var(--t-line) !important;
  background: var(--t-side) !important;
  color: var(--t-text-2) !important;
  box-shadow: 0 1px 0 var(--t-line);
}
${R} [data-slot="badge"] {
  border-radius: 999px !important;
  border-color: transparent !important;
  background: var(--t-accent-soft) !important;
  color: var(--t-accent-deep) !important;
}
${R} input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
${R} textarea,
${R} select {
  border-radius: var(--t-input-radius) !important;
}
${R} input:focus,
${R} textarea:focus {
  outline-color: var(--t-accent) !important;
}

/* \u2500\u2500 Composer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${R} [data-slot="composer-root"] {
  --composer-fill: ${t.page};
}
${R} [data-slot="composer-surface"] {
  border-radius: var(--t-composer-radius) !important;
  border: 1px solid var(--t-line) !important;
  background: transparent !important;
  box-shadow: var(--t-composer-shadow) !important;
  transition: border-color .18s ease, box-shadow .18s ease !important;
}
${R} [data-slot="composer-root"]:focus-within [data-slot="composer-surface"] {
  border-color: var(--t-accent) !important;
  box-shadow: 0 0 0 4px var(--t-accent-soft), var(--t-composer-shadow) !important;
}
${R} [data-slot="composer-surface"] button {
  border-radius: calc(var(--t-composer-radius) * .55) !important;
}

/* \u2500\u2500 Hermes Bots rooms \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
/* The bots plugin draws its room with plain markup (a <section> holding a
   <header>, a role=log and a <form>). Those three hooks are stable enough to
   dress the whole room without touching the plugin. #root carries enough
   specificity to beat the mode-scoped button rules below. */

/* Gateway group switcher at the top of the BOTS pane. */
${R} div.grid.gap-1.px-2:has(> button[data-variant="ghost"]) {
  padding: 8px 8px 6px !important;
  gap: 2px !important;
  border-bottom: 1px solid var(--t-line) !important;
}
${R} div.grid.gap-1.px-2:has(> button[data-variant="ghost"]) > button {
  width: 100% !important;
  min-height: 30px !important;
  justify-content: flex-start !important;
  padding: 0 10px !important;
  border-radius: calc(var(--t-item-radius) * .9) !important;
  color: var(--t-text-2) !important;
  font-weight: 600 !important;
  text-align: left !important;
}
${R} div.grid.gap-1.px-2:has(> button[data-variant="ghost"]) > button:first-child {
  color: var(--t-accent) !important;
}
${R} div.grid.gap-1.px-2:has(> button[data-variant="ghost"]) > button:hover {
  background: var(--t-hover) !important;
  color: var(--t-ink) !important;
}

${R} #root section:has(> [role="log"]) {
  background: var(--t-page) !important;
  padding: 14px 18px 16px !important;
  gap: 12px !important;
}
${R} #root section:has(> [role="log"]) > header {
  background: var(--t-side) !important;
  border: 1px solid var(--t-line) !important;
  border-radius: var(--t-card-radius) !important;
  padding: 10px 12px !important;
  box-shadow: 0 1px 2px rgba(16, 30, 50, .05) !important;
}
${R} #root section:has(> [role="log"]) > header [data-slot="button"] {
  border-radius: 999px !important;
  border: 1px solid var(--t-line) !important;
  background: var(--t-card) !important;
  background-image: none !important;
  color: var(--t-text-2) !important;
  box-shadow: none !important;
}
${R} #root section:has(> [role="log"]) > header [data-slot="button"]:hover {
  background: var(--t-hover) !important;
  color: var(--t-ink) !important;
}
${R} #root section:has(> [role="log"]) > [role="log"] {
  padding: 0 2px !important;
}
${R} #root section:has(> [role="log"]) > [role="log"] > div {
  border: 1px solid var(--t-line) !important;
  border-radius: calc(var(--t-card-radius) * .7) !important;
  background: var(--t-side) !important;
  padding: 10px 12px !important;
}
${R} #root section:has(> [role="log"]) > [role="log"] > div:hover {
  border-color: color-mix(in srgb, var(--t-accent) 38%, var(--t-line)) !important;
}
${R} #root section:has(> [role="log"]) > form {
  align-items: center !important;
  background: var(--t-side) !important;
  border: 1px solid var(--t-line) !important;
  border-radius: var(--t-composer-radius) !important;
  padding: 8px !important;
  box-shadow: var(--t-composer-shadow) !important;
}
${R} #root section:has(> [role="log"]) > form textarea {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  min-height: 34px !important;
  padding: 8px 10px !important;
}
${R} #root section:has(> [role="log"]) > form button[data-slot="button"] {
  border-radius: 999px !important;
}
${R} #root section:has(> [role="log"]) > form > div > button[data-slot="button"] {
  background: transparent !important;
  background-image: none !important;
  border: 1px dashed var(--t-line) !important;
  color: var(--t-text-2) !important;
  box-shadow: none !important;
}
${R} #root section:has(> [role="log"]) > form > button[data-slot="button"] {
  background: var(--t-accent) !important;
  background-image: none !important;
  border: 0 !important;
  color: #fff !important;
  box-shadow: 0 4px 14px -6px color-mix(in srgb, var(--t-accent) 70%, transparent) !important;
}

/* \u2500\u2500 Transcript \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${R} [data-role="user"] [class*="composer-human-message"] {
  border-radius: calc(var(--t-card-radius) * .8) !important;
  border-color: color-mix(in srgb, var(--t-accent) 24%, var(--t-line)) !important;
  background: color-mix(in srgb, var(--t-accent) 9%, var(--t-page)) !important;
  box-shadow: 0 1px 2px rgba(16, 30, 50, .05) !important;
}
${R} [data-role="assistant"] a {
  color: var(--t-accent-deep) !important;
  text-underline-offset: 2px;
  text-decoration-color: color-mix(in srgb, var(--t-accent) 45%, transparent) !important;
}
${R} [data-role="assistant"] :not(pre) > code {
  border-radius: 5px !important;
  background: var(--t-accent-soft) !important;
  color: var(--t-accent-deep) !important;
  padding: 1px 4px !important;
}
${R} [data-role="assistant"] pre {
  border-radius: calc(var(--t-card-radius) * .6) !important;
  border: 1px solid var(--t-line) !important;
  background: color-mix(in srgb, var(--t-page) 72%, var(--t-ink) 3%) !important;
}

/* \u2500\u2500 Empty chat: the wordmark is the loudest thing on screen \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${R} [data-slot="aui_intro"] .wordmark {
  font-family: '${t.displayFamily}', var(--font-sans) !important;
  font-weight: ${t.displayWeight} !important;
  letter-spacing: ${t.displayTracking} !important;
  mix-blend-mode: normal !important;
  filter: drop-shadow(${t.wordmarkShadow});
}
/* The app's fit-text trick sizes the visible span from a container query. A
   different display face changes the advance widths it was tuned for, which
   clipped the last letter; size the line from the container instead. */
${R} [data-slot="aui_intro"] .wordmark > span:not([aria-hidden]) > span {
  display: inline-block !important;
  inline-size: auto !important;
  font-size: clamp(var(--fit-min), 9.6cqi, 220px) !important;
  line-height: .92 !important;
  color: transparent !important;
  background: ${t.wordmarkGradient} !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
}
${R} [data-slot="aui_intro"] p:not(.wordmark) {
  font-family: var(--font-sans) !important;
  font-size: .8125rem !important;
  line-height: 1.7 !important;
  letter-spacing: .005em !important;
  color: var(--t-text-2) !important;
  max-width: 46ch !important;
  margin-inline: auto !important;
}

/* \u2500\u2500 Status bar, scrollbars, selection \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${R} [data-slot="statusbar"] {
  background: var(--t-side) !important;
  border-top: 1px solid var(--t-line) !important;
  color: var(--t-text-3) !important;
  font-size: 10px !important;
  letter-spacing: .03em !important;
}
${R} [data-slot="statusbar"] button:hover {
  background: var(--t-hover) !important;
  color: var(--t-ink) !important;
}
${R} ::-webkit-scrollbar { width: 8px; height: 8px; }
${R} ::-webkit-scrollbar-track { background: transparent; }
${R} ::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--t-accent) 26%, var(--t-line));
  background-clip: content-box;
  border: 2px solid transparent;
  border-radius: 999px;
}
${R} ::-webkit-scrollbar-thumb:hover { background-color: var(--t-accent); }
${R} ::selection { background: color-mix(in srgb, var(--t-accent) 24%, transparent); }

/* \u2500\u2500 Per-theme shape language \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

${t.extra(R)}
${t.lightExtra(R)}
${t.darkExtra(R)}
`;
}

// src/themes.ts
var tideTypography = {
  fontSans: '"SUIT Variable", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif',
  fontUrl: "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css",
  fontMono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  baseSize: "14px",
  lineHeight: "1.5",
  letterSpacing: "-0.01em"
};
var mintTypography = {
  fontSans: '"IBM Plex Sans KR", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", sans-serif',
  fontUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap",
  fontMono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  baseSize: "14px",
  lineHeight: "1.5",
  letterSpacing: "0em"
};
var frostTypography = {
  fontSans: '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif',
  fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Inter+Tight:wght@200;300;800&display=swap",
  fontMono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  baseSize: "14px",
  lineHeight: "1.5",
  letterSpacing: "0.002em"
};
var tideChrome = buildChrome(
  {
    name: "tide",
    accent: "#3182F6",
    accentDeep: "#1B64DA",
    accentSoft: "#E8F2FF",
    page: "#F7F8FA",
    side: "#FFFFFF",
    line: "#E7EAEE",
    ink: "#191F28",
    text2: "#4E5968",
    text3: "#8B95A1",
    hover: "#F2F4F6",
    chip: "#EDF2F7",
    activeBg: "#3182F6",
    activeInk: "#FFFFFF",
    activeShadow: "0 4px 14px -3px rgba(49, 130, 246, .55)",
    tabActiveBg: "#FFFFFF",
    tabActiveInk: "#1B64DA",
    tabShadow: "0 1px 2px rgba(20, 50, 90, .14), 0 0 0 1px rgba(20, 50, 90, .04)",
    tabStrip: "#F2F4F6",
    itemRadius: 9,
    cardRadius: 20,
    btnRadius: 12,
    inputRadius: 12,
    composerRadius: 24,
    composerShadow: "0 8px 24px -14px rgba(20, 50, 90, .20), 0 1px 2px rgba(20, 50, 90, .05)",
    glow: "rgba(49, 130, 246, .04)",
    displayFamily: "SUIT Variable",
    displayWeight: 800,
    displayTracking: "-0.04em",
    wordmarkGradient: "linear-gradient(112deg, #1B64DA 0%, #4C9BFF 45%, #0A2A66 100%)",
    wordmarkShadow: "0 14px 34px rgba(49, 130, 246, .28)",
    extra: (R) => `
${R} [data-slot="pane-tab"] { letter-spacing: -0.01em !important; }
`,
    lightExtra: (R) => `
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="default"] {
  border-radius: 999px !important;
  background-image: linear-gradient(180deg, #5AA2FF 0%, #3182F6 58%, #2272EB 100%) !important;
  color: #fff !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .36), 0 6px 18px -5px rgba(49, 130, 246, .60) !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="default"]:hover {
  background-image: linear-gradient(180deg, #6DAEFF 0%, #3B8CF8 58%, #2A7AEF 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .44), 0 12px 28px -6px rgba(49, 130, 246, .66) !important;
  transform: translateY(-1px);
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="outline"],
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="secondary"] {
  background: #fff !important;
  border: 1px solid var(--t-line) !important;
  box-shadow: 0 1px 2px rgba(20, 50, 90, .06) !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="outline"]:hover,
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="secondary"]:hover {
  border-color: #BFD4F2 !important;
  background: #F7FAFF !important;
}
`,
    darkExtra: (R) => `
${R}[data-hermes-mode="dark"] [data-slot="button"][data-variant="default"] {
  border-radius: 999px !important;
  background-image: linear-gradient(180deg, #5FA9FF 0%, #3182F6 100%) !important;
  color: #06101E !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .28), 0 6px 20px -6px rgba(49, 130, 246, .70) !important;
}
${R}[data-hermes-mode="dark"] [data-slot="button"][data-variant="default"]:hover {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .36), 0 12px 30px -8px rgba(49, 130, 246, .80) !important;
  transform: translateY(-1px);
}
`
  },
  {
    accent: "#4C9BFF",
    accentDeep: "#8CC2FF",
    accentSoft: "rgba(76, 155, 255, .16)",
    page: "#0F1115",
    side: "#151A22",
    line: "#262E3A",
    ink: "#F2F4F6",
    text2: "#B6BEC9",
    text3: "#8A94A2",
    hover: "#1D2430",
    chip: "#1B2532",
    activeBg: "#2E6FD6",
    activeInk: "#FFFFFF",
    activeShadow: "0 4px 16px -4px rgba(49, 130, 246, .55)",
    tabActiveBg: "#1D2530",
    tabActiveInk: "#7FB4FF",
    tabShadow: "inset 0 0 0 1px #2A3542",
    tabStrip: "#12161C",
    composerShadow: "0 18px 50px -16px rgba(0, 0, 0, .75), 0 1px 2px rgba(0, 0, 0, .5)",
    glow: "rgba(49, 130, 246, .12)"
  }
);
var TIDE = {
  name: "tide",
  label: "Tide",
  description: "\uAE68\uB057\uD55C \uD654\uC774\uD2B8\uC640 \uCF54\uBC1C\uD2B8 \uBE14\uB8E8. \uC0AC\uC774\uB4DC\uBC14\xB7\uD0ED\xB7\uCE74\uB4DC\uAC00 \uB610\uB837\uD55C \uAE30\uBCF8 \uD14C\uB9C8.",
  colors: {
    background: "#F7F8FA",
    foreground: "#191F28",
    card: "#FFFFFF",
    cardForeground: "#191F28",
    muted: "#F2F4F6",
    mutedForeground: "#4E5968",
    popover: "#FFFFFF",
    popoverForeground: "#191F28",
    primary: "#3182F6",
    primaryForeground: "#FFFFFF",
    secondary: "#E8F3FF",
    secondaryForeground: "#1B64DA",
    accent: "#E8F3FF",
    accentForeground: "#1B64DA",
    border: "#E7EAEE",
    input: "#E7EAEE",
    ring: "#3182F6",
    midground: "#2272EB",
    destructive: "#F04452",
    destructiveForeground: "#FFFFFF",
    sidebarBackground: "#FFFFFF",
    sidebarBorder: "#E7EAEE",
    userBubble: "#E8F3FF",
    userBubbleBorder: "#D6E7FF"
  },
  darkColors: {
    background: "#101114",
    foreground: "#F2F4F6",
    card: "#191A1E",
    cardForeground: "#F2F4F6",
    muted: "#22242A",
    mutedForeground: "#9AA1AC",
    popover: "#191A1E",
    popoverForeground: "#F2F4F6",
    primary: "#4C9BFF",
    primaryForeground: "#0B1220",
    secondary: "#1E2A3A",
    secondaryForeground: "#BBD8FF",
    accent: "#1E2A3A",
    accentForeground: "#BBD8FF",
    border: "#2A2D34",
    input: "#2A2D34",
    ring: "#4C9BFF",
    midground: "#4C9BFF",
    destructive: "#FF6B6B",
    destructiveForeground: "#1A0B0B",
    sidebarBackground: "#151A22",
    sidebarBorder: "#262E3A",
    userBubble: "#1E2A3A",
    userBubbleBorder: "#2E4360"
  },
  typography: tideTypography,
  customCSS: tideChrome
};
var mintChrome = buildChrome(
  {
    name: "mint",
    accent: "#03C75A",
    accentDeep: "#04783B",
    accentSoft: "#E4F8ED",
    page: "#FBFDFC",
    side: "#F3FAF6",
    line: "#DCEFE3",
    ink: "#15231A",
    text2: "#4B5A50",
    text3: "#85938A",
    hover: "#EAF7EF",
    chip: "#E3F5EA",
    activeBg: "#FFFFFF",
    activeInk: "#04783B",
    activeShadow: "inset 3px 0 0 #03C75A, 0 1px 3px rgba(4, 80, 32, .12)",
    tabActiveBg: "transparent",
    tabActiveInk: "#03A94D",
    tabShadow: "inset 0 -2px 0 #03C75A",
    tabStrip: "transparent",
    itemRadius: 6,
    cardRadius: 12,
    btnRadius: 7,
    inputRadius: 6,
    composerRadius: 10,
    composerShadow: "0 1px 0 rgba(255, 255, 255, .6) inset, 0 8px 24px -14px rgba(4, 100, 50, .35)",
    glow: "rgba(3, 199, 90, .05)",
    displayFamily: "Manrope",
    displayWeight: 800,
    displayTracking: "-0.03em",
    wordmarkGradient: "linear-gradient(112deg, #04783B 0%, #03C75A 50%, #0A5C34 100%)",
    wordmarkShadow: "0 14px 34px rgba(3, 199, 90, .24)",
    extra: (R) => `
${R} [data-slot="pane-tab"] {
  height: 28px !important;
  margin: 0 2px !important;
  padding-inline: 8px !important;
  border-radius: 0 !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: .12em !important;
  text-transform: uppercase !important;
}
${R} [data-slot="pane-tab"][data-active="true"] {
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: inset 0 -2px 0 var(--t-accent) !important;
}
${R} [data-slot="pane-tab"][data-active="false"] { color: var(--t-text-3) !important; }
${R} [data-slot="sidebar-menu-item"] > button > .codicon { border-radius: 4px !important; }
`,
    lightExtra: (R) => `
${R}[data-hermes-mode="light"] [data-tree-group]:not(:has([data-slot="sidebar"])) {
  background-image: radial-gradient(90% 55% at 50% 0%, rgba(3, 199, 90, .06), transparent 62%) !important;
  background-repeat: no-repeat !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="default"] {
  background-image: none !important;
  background-color: #03C75A !important;
  color: #fff !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .26), 0 2px 0 #039F48 !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="default"]:hover {
  background-color: #05B553 !important;
  transform: translateY(-1px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .3), 0 3px 0 #039F48, 0 8px 18px -6px rgba(3, 199, 90, .45) !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="default"]:active {
  transform: translateY(1px);
  box-shadow: inset 0 1px 2px rgba(0, 60, 25, .25) !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="outline"],
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="secondary"] {
  background: #F3FBF6 !important;
  border: 1px solid #BCE6CC !important;
  color: #04783B !important;
  box-shadow: none !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="outline"]:hover,
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="secondary"]:hover {
  background: #E4F8ED !important;
  border-color: #8EDBAE !important;
}
${R}[data-hermes-mode="light"] [data-slot="composer-surface"] {
  box-shadow: 0 0 0 1px rgba(3, 199, 90, .10), 0 10px 30px -18px rgba(4, 100, 50, .45) !important;
}
`,
    darkExtra: (R) => `
${R}[data-hermes-mode="dark"] [data-slot="button"][data-variant="default"] {
  background-image: none !important;
  background-color: #03C75A !important;
  color: #04140B !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .24), 0 2px 0 #029B46 !important;
}
${R}[data-hermes-mode="dark"] [data-slot="button"][data-variant="default"]:hover {
  background-color: #0BD468 !important;
  transform: translateY(-1px);
}
`
  },
  {
    accent: "#2BD97A",
    accentDeep: "#7BE8AC",
    accentSoft: "rgba(3, 199, 90, .16)",
    page: "#0E1411",
    side: "#141C17",
    line: "#26352C",
    ink: "#EDF7F0",
    text2: "#AFC2B5",
    text3: "#7F9387",
    hover: "#1B2820",
    chip: "#1A2C21",
    activeBg: "#1B2C21",
    activeInk: "#6EE7A8",
    activeShadow: "inset 3px 0 0 #03C75A, 0 1px 0 rgba(255, 255, 255, .04)",
    tabActiveBg: "transparent",
    tabActiveInk: "#4ADE80",
    tabShadow: "inset 0 -2px 0 #03C75A",
    tabStrip: "transparent",
    composerShadow: "0 1px 0 rgba(255, 255, 255, .04) inset, 0 14px 36px -18px rgba(0, 0, 0, .8)",
    glow: "rgba(3, 199, 90, .10)"
  }
);
var MINT = {
  name: "mint",
  label: "Mint",
  description: "\uD654\uC774\uD2B8 \uBC14\uD0D5\uC5D0 \uBBFC\uD2B8 \uADF8\uB9B0 \uD3EC\uC778\uD2B8. \uCC28\uBD84\uD558\uACE0 \uC815\uBCF4 \uC911\uC2EC\uC778 \uD14C\uB9C8.",
  colors: {
    background: "#FBFDFC",
    foreground: "#15231A",
    card: "#FFFFFF",
    cardForeground: "#15231A",
    muted: "#F4FAF6",
    mutedForeground: "#4B5A50",
    popover: "#FFFFFF",
    popoverForeground: "#15231A",
    primary: "#03C75A",
    primaryForeground: "#FFFFFF",
    secondary: "#E6F9EE",
    secondaryForeground: "#04783B",
    accent: "#E6F9EE",
    accentForeground: "#04783B",
    border: "#DCEFE3",
    input: "#DCEFE3",
    ring: "#03C75A",
    midground: "#03C75A",
    destructive: "#F04452",
    destructiveForeground: "#FFFFFF",
    sidebarBackground: "#F3FAF6",
    sidebarBorder: "#DCEFE3",
    userBubble: "#E4F8ED",
    userBubbleBorder: "#BFE9CF"
  },
  darkColors: {
    background: "#111312",
    foreground: "#F2F4F6",
    card: "#181B19",
    cardForeground: "#F2F4F6",
    muted: "#202522",
    mutedForeground: "#9AA1AC",
    popover: "#181B19",
    popoverForeground: "#F2F4F6",
    primary: "#03C75A",
    primaryForeground: "#06110B",
    secondary: "#163024",
    secondaryForeground: "#A8EDC7",
    accent: "#163024",
    accentForeground: "#A8EDC7",
    border: "#29312C",
    input: "#29312C",
    ring: "#03C75A",
    midground: "#03C75A",
    destructive: "#FF6B6B",
    destructiveForeground: "#1A0B0B",
    sidebarBackground: "#141C17",
    sidebarBorder: "#26352C",
    userBubble: "#163024",
    userBubbleBorder: "#24513A"
  },
  typography: mintTypography,
  customCSS: mintChrome
};
var frostChrome = buildChrome(
  {
    name: "frost",
    accent: "#0071E3",
    accentDeep: "#0058B3",
    accentSoft: "#E6F0FF",
    page: "#F5F6F9",
    side: "#F4F6FA",
    line: "#DFE3EA",
    ink: "#1D1D1F",
    text2: "#5F5F66",
    text3: "#8E8E93",
    hover: "rgba(255, 255, 255, .8)",
    chip: "#E9EDF5",
    activeBg: "#FFFFFF",
    activeInk: "#0071E3",
    activeShadow: "0 2px 10px -2px rgba(20, 40, 80, .16), inset 0 0 0 1px rgba(255, 255, 255, .9)",
    tabActiveBg: "rgba(255, 255, 255, .92)",
    tabActiveInk: "#1D1D1F",
    tabShadow: "0 1px 4px rgba(20, 40, 80, .14)",
    tabStrip: "transparent",
    itemRadius: 12,
    cardRadius: 24,
    btnRadius: 12,
    inputRadius: 14,
    composerRadius: 26,
    composerShadow: "0 18px 50px -18px rgba(20, 40, 80, .28), 0 1px 2px rgba(20, 40, 80, .06)",
    glow: "rgba(0, 113, 227, .06)",
    displayFamily: "Inter Tight",
    displayWeight: 200,
    displayTracking: "0.035em",
    wordmarkGradient: "linear-gradient(104deg, #0A84FF 0%, #74B9FF 42%, #1D1D1F 100%)",
    wordmarkShadow: "0 16px 40px rgba(0, 113, 227, .22)",
    extra: (R) => `
${R} [data-slot="pane-tab"] { border-radius: 999px !important; }
${R} [data-slot="pane-tab"][data-active="true"] { border-radius: 999px !important; }
${R} [data-slot="sidebar"] { backdrop-filter: blur(26px) saturate(1.25); }
${R} [data-slot="composer-surface"] { backdrop-filter: blur(26px) saturate(1.35); }
`,
    lightExtra: (R) => `
${R}[data-hermes-mode="light"] [data-slot="composer-root"] {
  --composer-fill: rgba(255, 255, 255, .72) !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="default"] {
  border-radius: 999px !important;
  background-image: linear-gradient(180deg, #3395FF 0%, #0071E3 100%) !important;
  color: #fff !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .40), 0 8px 24px -8px rgba(0, 113, 227, .60) !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="default"]:hover {
  background-image: linear-gradient(180deg, #4AA4FF 0%, #0A7DF0 100%) !important;
  transform: translateY(-1px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .5), 0 14px 32px -8px rgba(0, 113, 227, .66) !important;
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="outline"],
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="secondary"] {
  background: rgba(255, 255, 255, .66) !important;
  border: 1px solid rgba(255, 255, 255, .92) !important;
  box-shadow: 0 1px 3px rgba(20, 40, 80, .08) !important;
  backdrop-filter: blur(10px);
}
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="outline"]:hover,
${R}[data-hermes-mode="light"] [data-slot="button"][data-variant="secondary"]:hover {
  background: rgba(255, 255, 255, .92) !important;
}
`,
    darkExtra: (R) => `
${R}[data-hermes-mode="dark"] [data-slot="composer-root"] {
  --composer-fill: rgba(26, 30, 39, .72) !important;
}
${R}[data-hermes-mode="dark"] [data-slot="button"][data-variant="default"] {
  border-radius: 999px !important;
  background-image: linear-gradient(180deg, #3395FF 0%, #0071E3 100%) !important;
  color: #fff !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .30), 0 8px 26px -8px rgba(0, 113, 227, .70) !important;
}
${R}[data-hermes-mode="dark"] [data-slot="button"][data-variant="default"]:hover {
  transform: translateY(-1px);
}
`
  },
  {
    accent: "#4DA3FF",
    accentDeep: "#9CCBFF",
    accentSoft: "rgba(10, 132, 255, .18)",
    page: "#0D0F14",
    side: "#14171D",
    line: "#272B34",
    ink: "#F5F5F7",
    text2: "#B9BEC8",
    text3: "#8B919C",
    hover: "#1B1F27",
    chip: "#1D222B",
    activeBg: "#232936",
    activeInk: "#7DB8FF",
    activeShadow: "0 2px 12px rgba(0, 0, 0, .40), inset 0 1px 0 rgba(255, 255, 255, .08)",
    tabActiveBg: "#232936",
    tabActiveInk: "#F5F5F7",
    tabShadow: "0 2px 8px rgba(0, 0, 0, .35)",
    tabStrip: "transparent",
    composerShadow: "0 24px 70px -20px rgba(0, 0, 0, .85), 0 1px 2px rgba(0, 0, 0, .6)",
    glow: "rgba(0, 113, 227, .14)"
  }
);
var FROST = {
  name: "frost",
  label: "Frost",
  description: "\uBC18\uD22C\uBA85 \uC720\uB9AC \uD45C\uBA74\uACFC \uAC00\uBCBC\uC6B4 \uC11C\uCCB4. \uBD80\uB4DC\uB7FD\uACE0 \uC870\uC6A9\uD55C \uD14C\uB9C8.",
  colors: {
    background: "#F5F6F9",
    foreground: "#1D1D1F",
    card: "#FFFFFF",
    cardForeground: "#1D1D1F",
    muted: "#F5F6F9",
    mutedForeground: "#6E6E73",
    popover: "#FFFFFF",
    popoverForeground: "#1D1D1F",
    primary: "#0071E3",
    primaryForeground: "#FFFFFF",
    secondary: "#E8E8ED",
    secondaryForeground: "#1D1D1F",
    accent: "#E8E8ED",
    accentForeground: "#1D1D1F",
    border: "#DFE3EA",
    input: "#DFE3EA",
    ring: "#0071E3",
    midground: "#0071E3",
    destructive: "#FF3B30",
    destructiveForeground: "#FFFFFF",
    sidebarBackground: "#F4F6FA",
    sidebarBorder: "#DFE3EA",
    userBubble: "#E6F0FF",
    userBubbleBorder: "#CFE1FF"
  },
  darkColors: {
    background: "#101114",
    foreground: "#F5F5F7",
    card: "#1A1D24",
    cardForeground: "#F5F5F7",
    muted: "#1D2027",
    mutedForeground: "#A1A6B0",
    popover: "#1A1D24",
    popoverForeground: "#F5F5F7",
    primary: "#0A84FF",
    primaryForeground: "#FFFFFF",
    secondary: "#232833",
    secondaryForeground: "#CFE1FF",
    accent: "#232833",
    accentForeground: "#CFE1FF",
    border: "#2A2F3A",
    input: "#2A2F3A",
    ring: "#0A84FF",
    midground: "#0A84FF",
    destructive: "#FF453A",
    destructiveForeground: "#1A0B0B",
    sidebarBackground: "#14171D",
    sidebarBorder: "#272B34",
    userBubble: "#17263F",
    userBubbleBorder: "#24406B"
  },
  typography: frostTypography,
  customCSS: frostChrome
};
var OUR_THEMES = [TIDE, MINT, FROST];

// src/theme-gallery.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var SWATCH_KEYS = ["background", "primary", "card", "foreground"];
function Swatches({ theme }) {
  return /* @__PURE__ */ jsx2("div", { className: "flex items-center gap-2", children: SWATCH_KEYS.map((key) => /* @__PURE__ */ jsx2(
    "span",
    {
      title: key,
      className: "inline-block h-7 w-7 rounded-[9px] border border-black/10 shadow-sm",
      style: { background: theme.colors[key] }
    },
    key
  )) });
}
function ThemeGallery() {
  const { themeName, setTheme } = useTheme();
  const themes = OUR_THEMES;
  return /* @__PURE__ */ jsxs2("div", { className: "mx-auto grid w-full max-w-5xl gap-6 p-8", children: [
    /* @__PURE__ */ jsxs2("header", { children: [
      /* @__PURE__ */ jsx2("h1", { className: "text-2xl font-bold tracking-tight", children: "UI \uD14C\uB9C8" }),
      /* @__PURE__ */ jsx2("p", { className: "mt-1 text-sm text-muted-foreground", children: "\uBC31\uC5D4\uB4DC\uB294 \uADF8\uB300\uB85C \uB450\uACE0 \uD654\uBA74 \uC2A4\uD0C0\uC77C\uB9CC \uBC14\uAFC9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uBAA8\uC591\uC5D0\uC11C\uB3C4 \uACE0\uB97C \uC218 \uC788\uC2B5\uB2C8\uB2E4." })
    ] }),
    /* @__PURE__ */ jsx2("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: themes.map((theme) => /* @__PURE__ */ jsxs2("section", { "data-slot": "card", className: "rounded-2xl border border-border bg-card p-5 shadow-sm", children: [
      /* @__PURE__ */ jsx2(Swatches, { theme }),
      /* @__PURE__ */ jsx2("h2", { className: "mt-4 text-base font-semibold", children: theme.label }),
      /* @__PURE__ */ jsx2("p", { className: "mt-1 min-h-10 text-sm text-muted-foreground", children: theme.description }),
      /* @__PURE__ */ jsx2(
        Button2,
        {
          className: "mt-4 w-full",
          disabled: themeName === theme.name,
          onClick: () => setTheme(theme.name),
          children: themeName === theme.name ? "\uC0AC\uC6A9 \uC911" : "\uC774 \uD14C\uB9C8 \uC801\uC6A9"
        }
      )
    ] }, theme.name)) }),
    /* @__PURE__ */ jsx2("p", { className: "text-xs text-muted-foreground", children: "\uD14C\uB9C8\uB97C \uBC14\uAFB8\uBA74 \uC0AC\uC774\uB4DC\uBC14, \uD0ED, \uBC84\uD2BC, \uC785\uB825\uCC3D, \uAE00\uAF34\uACFC \uC544\uC774\uCF58\uAE4C\uC9C0 \uD568\uAED8 \uBC14\uB01D\uB2C8\uB2E4. \uC571\uC744 \uB2E4\uC2DC \uC2DC\uC791\uD560 \uD544\uC694\uB294 \uC5C6\uC2B5\uB2C8\uB2E4." })
  ] });
}

// src/plugin.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var ID = "hermes-ui-collection";
var PATH = "/hermes-ui-collection";
var DASHBOARD_PATH = "/hermes-ui-dashboard";
function GlobalSkin() {
  useEffect2(() => {
    const style = document.createElement("style");
    style.dataset.hermesUiIcons = "";
    style.textContent = ICON_CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  return null;
}
var plugin_default = {
  id: ID,
  name: "Hermes UI Collection",
  description: "Tide / Mint / Frost \uD14C\uB9C8\uB85C \uC571 \uC804\uCCB4 UI\uB97C \uBC14\uAFB8\uB294 \uB370\uC2A4\uD06C\uD1B1 \uD50C\uB7EC\uADF8\uC778.",
  defaultEnabled: true,
  register(ctx) {
    return ctx.registerMany([
      ...OUR_THEMES.map((theme) => ({
        id: `theme-${theme.name}`,
        area: THEMES_AREA,
        data: theme
      })),
      {
        id: "icons",
        area: TITLEBAR_AREAS.right,
        order: -100,
        render: () => /* @__PURE__ */ jsx3(GlobalSkin, {})
      },
      {
        id: "dashboard",
        area: ROUTES_AREA,
        data: { path: DASHBOARD_PATH },
        render: () => /* @__PURE__ */ jsx3(Dashboard, {})
      },
      {
        id: "gallery",
        area: ROUTES_AREA,
        data: { path: PATH },
        render: () => /* @__PURE__ */ jsx3(ThemeGallery, {})
      },
      {
        id: "dashboard-nav",
        area: SIDEBAR_NAV_AREA,
        order: 63,
        data: { path: DASHBOARD_PATH, label: "\uB300\uC2DC\uBCF4\uB4DC", codicon: "dashboard" }
      },
      {
        id: "nav",
        area: SIDEBAR_NAV_AREA,
        order: 64,
        data: { path: PATH, label: "UI \uD14C\uB9C8", codicon: "symbol-color" }
      }
    ]);
  }
};
export {
  plugin_default as default
};
