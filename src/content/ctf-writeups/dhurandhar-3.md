Event: sudo$rm CTF 2026

This multi-stage OSINT challenge demonstrates how a small clue can become a justified research hypothesis when each step is testable and documented.

## mission briefing

The details for this operation have been secured in an external high-clearance document. The briefing mentions the "GOAT who completed football in 2022", which points directly to Lionel Messi and his iconic jersey number, `10`. The number serves as the Caesar-shift key for our initial coded fragment.

The transferable technique here is converting a story detail into one specific, reversible test, then checking whether the output is meaningful before continuing.

## build a research trail

The later stages show how a reused public clue can connect context across platforms. In a CTF, corroborate each observation against the challenge scope and record why it supports the next step.

- **Step 1: The Messi Decryption**
  Using a Caesar shift backward by 10 on the cipher `q_d_nrkxecr420` gives us `g_t_dhanush420`. The clue states "SQ" leads to "IG", indicating this handle belongs to an Instagram account.

- **Step 2: Instagram Investigation**
  Navigating to `instagram.com/g_t_dhanush420/` reveals the suspect's profile. Analyzing the profile pic you will find a G-Mail address.

- **Step 3: Google Maps OSINT**
  The challenge subject line hints: *"You can find someone’s Google Maps review with just their Gmail"*. Using tools like GHunt or Google's direct people search, you can locate the account's Google Maps contributions. Finding the review for a specific location (indicated by an Instagram photo) reveals the hidden flag in the text of the review.

Outside CTFs, OSINT must be authorized, proportionate, and respectful of privacy. The skill is connecting public evidence carefully, not collecting everything possible.

## defensive takeaway

- **Digital Footprints** are interconnected across platforms (e.g. IG -> Gmail -> Maps).
- **Handle Re-use** makes it easy to track targets between social and professional accounts.
- **Public Reviews** can accidentally leak operational secrets or locations.
- Review public bios, reviews, photo metadata, and reused usernames.
- Keep personal accounts separated when that separation matters.

## detailed solve path

1. Extract the football clue from the briefing. The player described is Lionel Messi, whose jersey number is `10`.
2. Treat `10` as a Caesar-shift amount and shift `q_d_nrkxecr420` backward by 10 to get `g_t_dhanush420`.
3. Go to Instagram and find the user `g_t_dhanush420`. Extract their Gmail address from their bio or posts.
4. Use GHunt or Google Maps search to find reviews made by that Gmail address.
5. Find the specific review left at the location hinted at by their Instagram photos.
6. The final challenge evidence in the review yields the expected flag.

The recovered flag is:

```
Layer8{DogwOod_LivEs_HeRe_}
```
