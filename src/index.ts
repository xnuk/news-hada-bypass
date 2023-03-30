export interface Env {
	HADA?: KVNamespace
}

const hada = 'https://news.hada.io/topic?id='

const processHada = (body: string): string | null => {
	let a = body.split("<div class='topictitle link'><a href='")[1]
	if (a == null) return null
	a = a.split("' class='bold ud'><h1>")[0]
	if (a == null) return null

	try {
		return new URL(a, 'https://news.hada.io/').href
	} catch (_) {
		return null
	}
}

const getPostId = (url: string): `${number}` | null => {
	let id: string
	try {
		id = new URL(url).pathname
	} catch {
		return null
	}

	return (
		(id.match(/^\/([0-9]+)\/?$/)?.[1] as `${number}` | null | undefined) ||
		null
	)
}

export interface KeyValue {
	get(key: string): Promise<string | null>
	set(key: string, value: string): Promise<any>
}

const getPost = async (url: string, map: KeyValue | null): Promise<string> => {
	const id = getPostId(url)
	if (id == null) return Promise.reject()

	if (map != null) {
		const cached = await map.get(id)
		if (cached != null) return cached
	}

	const redirect = processHada(
		await fetch(hada + id, {
			headers: { accept: 'text/html;charset=utf-8' },
		}).then(v => v.text()),
	)

	if (redirect == null) return Promise.reject()

	if (map != null) await map.set(id, redirect).catch(() => {})
	return redirect
}

export const keyValue = (kv: KVNamespace | null | undefined): KeyValue => {
	if (kv == null) {
		return {
			get: () => Promise.resolve(null),
			set: () => Promise.resolve(null),
		}
	}

	const set: KeyValue['set'] = (key, value) =>
		kv.put(key, value, { expirationTtl: 2592000 /* 30 days */ })
	const get: KeyValue['get'] = async key => {
		const val = await kv.get(key)
		if (val != null) set(key, val)
		return val
	}

	return { get, set }
}

export const makeResponse = async (
	request: Request,
	kv: KeyValue,
): Promise<Response> => {
	const error = () => new Response(null, { status: 404 })
	if (!['GET', 'HEAD'].includes(request.method)) return error()

	const redirect = await getPost(request.url, kv).catch(() => null)
	if (redirect == null) return error()

	return new Response(null, {
		status: 301,
		headers: { location: redirect, 'referrer-policy': 'no-referrer' },
	})
}

export default {
	async fetch(
		request: Request,
		env: Env,
		_: ExecutionContext,
	): Promise<Response> {
		return makeResponse(request, keyValue(env.HADA))
	},
}
