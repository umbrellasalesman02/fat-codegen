const healthElement = document.querySelector<HTMLParagraphElement>("#health-status")

if (!healthElement) {
  throw new Error("Missing #health-status element")
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3000"

const render = (message: string) => {
  healthElement.textContent = message
}

const run = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/health`)
    if (!response.ok) {
      render(`API health failed (${response.status})`)
      return
    }

    const payload = (await response.json()) as {
      status?: string
      service?: string
      version?: string
    }

    if (payload.status === "ok" && payload.service === "api") {
      render(`API healthy: ${payload.service} ${payload.version ?? ""}`.trim())
      return
    }

    render(`API health returned unexpected payload: ${JSON.stringify(payload)}`)
  } catch (error) {
    render(`API unreachable: ${error instanceof Error ? error.message : String(error)}`)
  }
}

void run()
