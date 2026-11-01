"""hermes-lang-ko — Korean language pack for Hermes Desktop.

The pack is text-only. ``provides_locales`` in ``plugin.yaml`` makes the plugin
loader register ``locales/`` before this module is touched, so ``register``
does nothing. The file exists only because Desktop's "Install from Git" check
looks for ``__init__.py`` beside ``plugin.yaml`` and rejects manifest-only
language packs that the backend itself accepts.
"""


def register(ctx):  # noqa: ARG001 - ctx unused by design
    """No-op: the loader registers locales/ from the manifest's provides_locales."""
    return None
