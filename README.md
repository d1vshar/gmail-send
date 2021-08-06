## gmail-send

REST API to send email through Gmail API.

Does not use any client libraries. Purely through https requests.

### Environment variables

Only two environment variables required:

`CLIENT_ID`

`CLIENT_SECRET`

Both of these are available through Google Auth Console.

### Run

Run using `npm start`


|Endpoint|Description|Parameters|
|-----------------|-----------------|-----------------|
|GET /auth/| Endpoint for initiating authentication. This will forward to a Google consent page.|None|
|GET /auth/callback|Endpoint which google server will redirect to. Does not need to be called manually.|URL params `code` or `error`|
|POST /mail/|Post endpoint for sending mail from an authenticated user.| JSON payload `{ to: string, subject: string, body: string }`|

To use:
- Call GET /auth/ and give consent
- Call POST /mail/ 