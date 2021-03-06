# issue-tracker

| Maker                                      |
| ------------------------------------------ |
| ๐พ [@edward](https://github.com/bepyan)    |
| ๐ฅ [@ethan](https://github.com/tjdgus3160) |
| ๐ [@lin](https://github.com/scl2589)      |

<br>

[๐ API Documentation](https://documenter.getpostman.com/view/15685287/UVeFPT3d)

<br>

### ์คํ ๋ฐฉ๋ฒ

```
yarn
yarn dev
```

<br>

### Our Jobs

- [ x ] json-server DB ๊ตฌ์ถ
- [ x ] JWT ์ธ์ฆ ๊ตฌ์ถ (+ passport)
- [ x ] Github OAuth

<br>

- [ x ] route User ๊ตฌํ
- [ x ] route Issue ๊ตฌํ
- [ x ] route Comment ๊ตฌํ
- [ x ] route Label ๊ตฌํ
- [ x ] route Milestone ๊ตฌํ

<br>

- [ x ] postman ํ์คํธ
- ~~refresh token~~

<br>
<br>

## GITHUB OAuth

### WorkFlow

1. Client requests github login (`/auth/github`)
2. After login, callback to server (`/github/callback`)
3. After register is processed in server, the page is redirected with accessToken (`/auth/callback?accessToken=`)
4. Client requests userInfo with accessToken (`/auth/account`)
5. If login is successful, redirect to issues page โจ

<br>

### Server Settings

Github OAuth Registration https://github.com/settings/developers

```js
new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:1234/api/auth/github/callback", // ๋ก๊ทธ์ธ ์ฑ๊ณต ์ฝ๋ฒก ๋งํฌ
  }
  //...
);
```

<br>

### .env

```js
JWT_SECRET = JWTP_์ํธํ_ํค;
GITHUB_CLIENT_ID = ๊นํ๋ธ_OAUTH_ID;
GITHUB_CLIENT_SECRET = ๊นํ๋ธ_OAUTH_์ํธํ_ํค;
```
