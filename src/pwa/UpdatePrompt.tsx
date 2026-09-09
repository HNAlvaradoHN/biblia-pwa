import { useEffect, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function UpdatePrompt() {
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const [updateServiceWorker, setUpdateServiceWorker] = useState<
    ((reloadPage?: boolean) => Promise<void>) | null
  >(null)

  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedsRefresh(true)
      },
    })

    setUpdateServiceWorker(() => updateSW)
  }, [])

  if (!needsRefresh) {
    return null
  }

  return (
    <aside className="update-banner" role="status" aria-live="polite">
      <div>
        <strong>Nueva versión disponible</strong>
        <span>Actualizá antes de probar los cambios nuevos.</span>
      </div>
      <button
        type="button"
        onClick={() => {
          void updateServiceWorker?.(true)
        }}
      >
        Actualizar ahora
      </button>
    </aside>
  )
}
