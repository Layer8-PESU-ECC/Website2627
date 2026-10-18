Event: sudo$rm CTF 2026

This challenge contains a text value that has been Base64-encoded three times. It is a short puzzle with a useful real-world lesson: encoding is not encryption.

## what to notice first

The value uses Base64's familiar character set: letters, digits, and optional `=` padding. That is a strong hint that the data is formatted for transport, not protected by a secret key.

The challenge tells us there are three layers. Treat that as a sequence of reversible transformations, not as a password-cracking problem.

## how to solve it cleanly

1. Decode the value once.
2. Inspect the result.
3. If it still has the Base64 pattern, decode it again.
4. Repeat until it becomes readable text in the expected `Layer8{...}` form.

Inspecting every layer matters. It catches a wrong assumption early and leaves a clear, reproducible path for someone else to review.

## defensive takeaway

Base64 provides no confidentiality or integrity. Anyone with the encoded text can reverse it. Sensitive information needs authenticated encryption, not an unfamiliar-looking string.

## detailed solve path

1. Start with the supplied encoded string.
2. Decode it with a Base64 decoder.
3. Check the output. It is another Base64-looking string, so the first pass removed only one layer.
4. Decode the output a second time, inspect it again, and repeat once more.
5. The third decode returns the final readable flag.

The recovered flag is:

```
Layer8{too_slow_defender}
```
