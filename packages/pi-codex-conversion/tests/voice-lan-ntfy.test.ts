import assert from "node:assert/strict";
import test from "node:test";
import { notifyLanVoiceStarted } from "../src/voice/lan/ntfy.ts";

test("LAN voice ntfy notification is disabled without a topic URL", async () => {
	let requested = false;
	const result = await notifyLanVoiceStarted(["https://pi.local:31415"], {
		endpoint: "",
		fetch: async () => {
			requested = true;
			return new Response();
		},
	});
	assert.equal(result, "disabled");
	assert.equal(requested, false);
});

test("LAN voice ntfy notification includes its URLs and optional token", async () => {
	let request: { url: string; init?: RequestInit | undefined } | undefined;
	const result = await notifyLanVoiceStarted(
		["https://pi.local:31415", "https://192.168.1.20:31415"],
		{
			endpoint: "https://ntfy.example.test/pi-voice",
			token: "secret-token",
			signal: AbortSignal.abort(),
			fetch: async (input, init) => {
				request = { url: String(input), init };
				return new Response(null, { status: 200 });
			},
		},
	);

	assert.equal(result, "sent");
	assert.equal(request?.url, "https://ntfy.example.test/pi-voice");
	const headers = new Headers(request?.init?.headers);
	assert.equal(headers.get("title"), "Pi LAN voice server started");
	assert.equal(headers.get("click"), "https://pi.local:31415");
	assert.equal(headers.get("tags"), "microphone");
	assert.equal(headers.get("authorization"), "Bearer secret-token");
	assert.equal(
		request?.init?.body,
		"LAN voice is available:\n\nhttps://pi.local:31415\nhttps://192.168.1.20:31415\n\nAccept the local certificate on first visit.",
	);
});

test("LAN voice ntfy notification reports rejected requests", async () => {
	await assert.rejects(
		notifyLanVoiceStarted(["https://pi.local:31415"], {
			endpoint: "https://ntfy.example.test/pi-voice",
			fetch: async () => new Response(null, { status: 403 }),
		}),
		/ntfy returned HTTP 403/,
	);
});
