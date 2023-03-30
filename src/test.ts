import { keyValue, makeResponse } from './index.ts'

const keyValueTest = keyValue(null)

const get = (entry: string) =>
	makeResponse(
		new Request(new URL(entry, 'https://news-hada.xnuk.workers.dev/'), {
			method: 'GET',
		}),
		keyValueTest,
	).then(v => v.headers.get('location'))

const Test = (name: string, func: () => Promise<void>): unknown =>
	func().then(
		() => console.log(name, true),
		e => console.log(name, false, e),
	)

const equal =
	<A, B extends A>(b: B) =>
	(a: A): Promise<void> =>
		a === b ? Promise.resolve() : Promise.reject(`${a} !== ${b}`)

Test('normal redirect', async () => {
	await get('/4189').then(
		equal('https://simonwillison.net/2021/May/2/one-year-of-tils/'),
	)
	await get('/4190').then(equal('https://muhammadraza.me/2021/Oneliners/'))
})

Test('self redirect', async () => {
	await get('/1').then(equal('https://news.hada.io/topic?id=1'))
})
