Event: sudo$rm CTF 2026

An unfamiliar string is not automatically encrypted. This challenge demonstrates how to recognize Base64, why it exists, and what it cannot protect.

## recognizing the format

The intercepted value has Base64's standard alphabet and trailing `=` padding. Those clues form a testable hypothesis without needing an image, packet capture, or executable.

Base64 represents binary data with printable characters so it can move through text-oriented systems such as email, JSON, and web APIs.

## encoding versus secrecy

Decode the value once to recover readable text. No key is needed because Base64 is a public format, not a cipher.

That distinction is practical: an unfamiliar string is not automatically secret. Identifying its format is often the safest first step in analysis.

## defensive takeaway

Encoding changes representation; encryption protects content using a key. Use the right term—and the right protection—for the job.

## detailed solve path

1. Inspect the supplied string. Its letters, digits, and trailing `=` match the Base64 format.
2. Use any standard Base64 decoder—there is no password or key to discover.
3. Decode the string once.
4. Confirm that the readable result matches the expected flag format.

The recovered flag is:

```
Layer8{base64_is_not_encryption}
```
