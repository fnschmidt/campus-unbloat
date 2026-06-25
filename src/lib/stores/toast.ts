import { writable } from 'svelte/store';

import { ToastPayloadClass, type ToastPayload } from '$lib/types';

export type ToastItem = ToastPayload & {
	/** unique id for keyed rendering */
	id: string;
	/** whether the user can close the toast */
	dismissible: boolean;
};

type ToastOptions = {
	/** set to 0 to disable auto-dismiss */
	timeoutMs?: number;
	dismissible?: boolean;
};

function makeId() {
	// `crypto.randomUUID()` is available in modern browsers.
	try {
		return crypto.randomUUID();
	} catch {
		return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}
}

const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const toasts = writable<ToastItem[]>([]);

export function dismissToast(id: string) {
	const t = timers.get(id);
	if (t) {
		clearTimeout(t);
		timers.delete(id);
	}

	toasts.update((items) => items.filter((x) => x.id !== id));
}

export function toast(payload: ToastPayload, options: ToastOptions = {}) {
	const id = makeId();

	const defaultTimeoutMs =
		payload.class === ToastPayloadClass.error
			? 0
			: payload.class === ToastPayloadClass.warn
				? 10000
				: 8000;

	const timeoutMs = options.timeoutMs ?? defaultTimeoutMs;
	const dismissible = options.dismissible ?? true;

	const item: ToastItem = {
		id,
		text: payload.text,
		class: payload.class,
		dismissible
	};

	toasts.update((items) => [...items, item]);

	if (timeoutMs && timeoutMs > 0) {
		const t = setTimeout(() => dismissToast(id), timeoutMs);
		timers.set(id, t);
	}

	return id;
}

export function toastSuccess(text: string, options?: ToastOptions) {
	return toast({ text, class: ToastPayloadClass.success }, options);
}

export function toastWarn(text: string, options?: ToastOptions) {
	return toast({ text, class: ToastPayloadClass.warn }, options);
}

export function toastError(text: string, options?: ToastOptions) {
	// Errors default to non-auto-dismiss (see `toast()`), but are still dismissible.
	return toast({ text, class: ToastPayloadClass.error }, options);
}

export function getAlertClass(c: ToastPayloadClass) {
	switch (c) {
		case ToastPayloadClass.success:
			return 'alert-success';
		case ToastPayloadClass.warn:
			return 'alert-warning';
		case ToastPayloadClass.error:
			return 'alert-error';
		default:
			return 'alert-info';
	}
}
