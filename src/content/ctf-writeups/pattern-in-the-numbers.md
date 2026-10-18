Event: sudo$rm CTF 2026

This numerical cipher is solved by taking its clue literally. The plaintext became character codes, and each value then received a shift that increases from zero.

## translate the hint into an equation

For position `i`, the challenge's transformation is:

```
encoded[i] = original[i] + i
```

The inverse follows directly:

```
original[i] = encoded[i] - i
```

Apply the subtraction in order and convert the recovered character codes back to text.

## verify instead of assuming

Use the expected `Layer8` prefix to validate the first recovered characters. If the text is not plausible, revisit the indexing: this shift begins at zero, not one.

This is a useful CTF habit. A natural-language hint often describes the transformation precisely enough to implement directly; write it as an equation before reaching for complicated tools.

## defensive takeaway

A predictable arithmetic shift is encoding, not secure encryption. Identify the transformation before deciding data is protected.

## detailed solve path

1. Split the challenge's space-separated numbers into a list.
2. Enumerate the list from position `0`.
3. For every value, subtract its position: `decoded = encoded - index`.
4. Convert each decoded number from its character code to a character.
5. Join the characters and validate the `Layer8{...}` prefix.

For example, the first encoded value is `89`. Its position is `0`, so it remains `89`, which is `Y`. The next value is `112`; subtract position `1` to get `111`, which is `o`. Repeating the operation reveals the full message.

The recovered flag is:

```
Layer8{C0N9R47UL4710N5}
```
