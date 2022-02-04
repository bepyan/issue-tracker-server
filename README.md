# issue-tracker

| Maker                                      |
| ------------------------------------------ |
| 👾 [@edward](https://github.com/bepyan)    |
| 🔥 [@ethan](https://github.com/tjdgus3160) |
| 🍒 [@lin](https://github.com/scl2589)      |

<br>

[📚 API Documentation](https://documenter.getpostman.com/view/15685287/UVeFPT3d)

<br>

### 실행 방법

```
yarn
yarn dev
```

<br>

### Our Jobs

- [ x ] json-server DB 구축
- [ x ] JWT 인증 구축 (+ passport)
- [ x ] Github OAuth

<br>

- [ x ] route User 구현
- [ x ] route Issue 구현
- [ x ] route Comment 구현
- [ x ] route Label 구현
- [ x ] route Milestone 구현

<br>

- [ x ] postman 테스트
- ~~refresh token~~

<br>
<br>

## GITHUB OAuth

### WorkFlow

1. Client requests github login (`/auth/github`)
2. After login, callback to server (`/github/callback`)
3. After register is processed in server, the page is redirected with accessToken (`/auth/callback?accessToken=`)
4. Client requests userInfo with accessToken (`/auth/account`)
5. If login is successful, redirect to issues page ✨

<br>

### Server Settings

Github OAuth Registration https://github.com/settings/developers

```js
new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:1234/api/auth/github/callback", // 로그인 성공 콜벡 링크
  }
  //...
);
```

<br>

### .env

```js
JWT_SECRET = JWTP_암호화_키;
GITHUB_CLIENT_ID = 깃허브_OAUTH_ID;
GITHUB_CLIENT_SECRET = 깃허브_OAUTH_암호화_키;
```
