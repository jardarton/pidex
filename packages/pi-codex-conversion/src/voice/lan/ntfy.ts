const NTFY_URL_ENV = "PI_CODEX_LAN_VOICE_NTFY_URL";
const NTFY_TOKEN_ENV = "PI_CODEX_LAN_VOICE_NTFY_TOKEN";
const NTFY_TIMEOUT_MS = 5_000;

export interface LanVoiceNtfyOptions {
	endpoint?: string | undefined;
	token?: string | undefined;
	fetch?: typeof globalThis.fetch | undefined;
	signal?: AbortSignal | undefined;
}

export async function notifyLanVoiceStarted(
	urls: string[],
	options: LanVoiceNtfyOptions = {},
): Promise<"disabled" | "sent"> {
	const endpoint = (options.endpoint ?? process.env[NTFY_URL_ENV] ?? "").trim();
	if (!endpoint) return "disabled";
	if (urls.length === 0) throw new Error("LAN voice started without a reachable URL");

	const endpointUrl = new URL(endpoint);
	if (endpointUrl.protocol !== "https:" && endpointUrl.protocol !== "http:") {
		throw new Error(`${NTFY_URL_ENV} must use HTTP or HTTPS`);
	}

	const token = (options.token ?? process.env[NTFY_TOKEN_ENV] ?? "").trim();
	const response = await (options.fetch ?? globalThis.fetch)(endpointUrl, {
		method: "POST",
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"title": "Pi LAN voice server started",
			"click": urls[0]!,
			"tags": "microphone",
			...(token ? { authorization: `Bearer ${token}` } : {}),
		},
		body: `LAN voice is available:\n\n${urls.join("\n")}\n\nAccept the local certificate on first visit.`,
		signal: options.signal ?? AbortSignal.timeout(NTFY_TIMEOUT_MS),
	});
	if (!response.ok) {
		throw new Error(`ntfy returned HTTP ${response.status}`);
	}
	return "sent";
}
