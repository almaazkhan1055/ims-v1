// Simple wrapper to namespace and JSON-serialize values. Avoid storing secrets.
const NAMESPACE = "imsapp";

function key(k: string) {
	return `${NAMESPACE}:${k}`;
}

export function saveSession(data: unknown) {
	try {
		const serialized = JSON.stringify(data);
		sessionStorage.setItem(key("session"), serialized);
	} catch {}
}

export function readSession<T>(): T | undefined {
	try {
		const raw = sessionStorage.getItem(key("session"));
		return raw ? (JSON.parse(raw) as T) : undefined;
	} catch {
		return undefined;
	}
}

export function clearSession() {
	try {
		sessionStorage.removeItem(key("session"));
	} catch {}
}


