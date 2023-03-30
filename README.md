# Bypassing GeekNews
[GeekNews]가 SNS 상에서 유행하고 있는 것 같습니다만, 원링크를 보여주는 [Hacker News] 봇과는 달리 GeekNews 페이지가
주로 링크되어 보고 싶지도 않은 댓글들을 봐버리는 것이 흠이라면 흠입니다. 그래서 이건 전부 원링크로 리디렉션 하는
물건입니다. 두 가지 방법 중 아무거나 쓰시면 됩니다.

## A. 유저 스크립트
[Greasemonkey]등의 유저 스크립트 구동기를 설치한 상태에서, 아래 링크를 들어가서 스크립트를 설치하세요.

> https://github.com/xnuk/news-hada-bypass/raw/userscript/news-hada-redirect.user.js

못미덥다면 [userscript 브랜치]에서 소스를 보실 수 있습니다.

## B. [Redirector] + [Cloudflare Workers]
강제로 주소를 리디렉션할 수 있는 확장 기능이 있다면, 다음과 같이 리디렉션 되도록 설정하세요. (정규식)

> `^https://news.hada.io/topic\?id=([0-9]+).*` -> `https://news-hada.xnuk.workers.dev/$1`

[workers 브랜치]에서 소스를 보실 수 있습니다.

[Hacker News]: https://news.ycombinator.com/
[GeekNews]: https://news.hada.io/
[workers 브랜치]: https://github.com/xnuk/news-hada-bypass/tree/workers
[userscript 브랜치]: https://github.com/xnuk/news-hada-bypass/tree/userscript
[Redirector]: https://addons.mozilla.org/en-US/firefox/addon/redirector/
[Cloudflare Workers]: https://workers.cloudflare.com/
[Greasemonkey]: https://addons.mozilla.org/ko/firefox/addon/greasemonkey/
