受信者ID（recipientId）とメールアドレスは一意に紐づいている

```bash
$ time node index.js
{
  status: 'SUCCESS',
  recipientId: '6720e40f-4c8d-44e8-acb2-8b1aa4976dda',
  email: 'hoge@example.com'
}

real    0m0.844s
user    0m0.277s
sys     0m0.064s
```

作成した受信者IDで単一取得

```bash
$ time node index.js
{
  preferences: {},
  profile: {
    address: {},
    email: 'hoge@example.com',
    airship: { audience: {}, device_types: [] },
    intercom: { to: {} },
    webhook: { authentication: {} }
  }
}

real    0m0.471s
user    0m0.257s
sys     0m0.030s
```