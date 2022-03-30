# Guitar Center Feed

Super simple script that searches Guitar Center's used gear section for items you're looking for.

## Installing and Running
1. Install dependencies with your preferred package manager
2. Copy `config/example-config.mjs` to a new `config/config.mjs`
3. Modify contents with your preferred search terms and email address
4. Set up environment variables (see below)
5. Run with `yarn start` or `npm start`
6. (Optionally) set up periodic execution with cronjob or equivalent

## Environment variables
You can either use your actual environment or you can set up a .env file in the project root.
```
SMTP_ADDRESS=<Address of SMTP server>
SMTP_FROM_NAME=<Display name for outgoing mail>
SMTP_FROM_ADDRESS=<Address for outgoing mail>
SMTP_USERNAME=<Username for SMTP server>
SMTP_PASSWORD=<Password for SMTP server>
SMTP_PORT_TLS=<SMTP port for TLS connections>
SMTP_PORT_SSL=<SMTP port for SSL connections>
```

## Outgoing Email for Gmail users
If you use Gmail, you can email yourself through Google's SMTP server for free. This link describes the process: https://kinsta.com/blog/gmail-smtp-server/

**Pay attention to the FAQ question regarding 2FA**

For example, mine is set up with:
```
SMTP_ADDRESS='smtp.gmail.com'
SMTP_FROM_NAME='Edward Crouch'
SMTP_FROM_ADDRESS=<My gmail address>
SMTP_USERNAME=<My gmail address>
SMTP_PASSWORD=<My gmail password>
SMTP_PORT_TLS='587'
SMTP_PORT_SSL='465'
```
## Adding Categories
If you don't see the category you're interested in in the categories file (`config/categories.mjs`), feel free to add new ones. Just copy the endpoint for the section from the Guitar Center website and add it to the file like the rest of them. Try to make the category as specific as possible for your given search terms because the broader the category, the longer the runtime.

Feel free to make a pull request with new categories you've added.

## TODO
- [ ] Abstract out query selector logic
- [ ] Add rest of gear sections to `config/categories.mjs`
- [ ] Add more notification types?
- [ ] Lots of optimization
- [ ] Improve search match logic
- [ ] Filtering based on price
