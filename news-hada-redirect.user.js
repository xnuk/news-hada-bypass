// ==UserScript==
// @name     news.hada.io redirect
// @version  1
// @grant    none
// @run-at   document-start
// @include  https://news.hada.io/topic?id=*
// @exclude  https://news.hada.io/topic?id=*&noredirect=true
// ==/UserScript==

if (document.head == null) {
	document.documentElement.appendChild(document.createElement('head'))
}
document.head.innerHTML += `<meta http-equiv="Content-Security-Policy" content="default-src 'none'" />`

const redirect = () => {
	const link = document.querySelector('.topictitle.link > a[href]')
	if (
		link == null ||
		(location.host === link.host && location.pathname === link.pathname)
	) {
		location.search += '&noredirect=true'
	} else {
		location.href = link.href
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', redirect, { once: true })
} else {
	redirect()
}
