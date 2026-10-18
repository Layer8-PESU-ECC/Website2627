Event: sudo$rm CTF 2026

RSA is only as safe as its construction. In this challenge, the modulus is large, but the public exponent is tiny and almost all of the plaintext is already known.

## what the challenge gives us

We receive a 2048-bit RSA modulus `n`, ciphertext `c`, public exponent `e = 3`, a known flag prefix, and a 200-bit unknown suffix. The plaintext has the form:

```
m = (K << 200) + x
```

`K` is known and only `x` is missing. The modulus is not weak; the problem is that too much message structure is exposed before encryption.

## the key reasoning step

RSA gives `c = m^3 mod n`. Substitute the known message layout and the task becomes:

```
(K + x)^3 - c = 0 mod n
```

We no longer need to factor `n`. We need the small modular root `x`.

Because `x` is small relative to `n`, a lattice-based small-root technique—commonly called Coppersmith's method—can recover it. Rebuild `m` from `K` and `x`, convert the result to bytes, and validate it against the expected flag format.

> A large key does not compensate for predictable plaintext and unsafe parameter choices.

## defensive takeaway

- Use randomized, reviewed padding such as RSA-OAEP.
- Do not design custom RSA message formats.
- Treat a low exponent and heavily structured plaintext as a dangerous combination.

## detailed solve path

1. Read `known_prefix` as an integer `K` and `unknown_bits` as `200`.
2. Model the unknown suffix as a polynomial variable `x` over `Zmod(n)`.
3. Build `f(x) = ((K << 200) + x)^3 - c`.
4. Search for roots bounded by `2^200`. In Sage, `f.small_roots(X=2^200, beta=0.4)` applies the small-root technique.
5. Take the recovered root, reconstruct `m = (K << 200) + x`, and convert the integer to big-endian bytes.
6. Confirm that the bytes form the expected flag.

The recovered flag is:

```
Layer8{if_m4g1c_m4de_1t}
```
