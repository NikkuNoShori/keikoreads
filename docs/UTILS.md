# Utility Functions Documentation

> **Note:** This file is now located in the `docs/` directory.

## formatDate
Formats a date string as `Month Day, Year`.

**Signature:**
```ts
formatDate(dateString: string | undefined): string
```

**Usage:**
```ts
formatDate('2024-06-01') // "June 1, 2024"
```

---

## formatNumber
Formats a number with commas.

**Signature:**
```ts
formatNumber(num: number | undefined): string
```

**Usage:**
```ts
formatNumber(1234567) // "1,234,567"
```

---

## truncateText
Truncates text to a max length, adding ellipsis if needed.

**Signature:**
```ts
truncateText(text: string | undefined, maxLength: number): string
```

**Usage:**
```ts
truncateText('This is a long sentence.', 10) // "This is a ..."
```

---

## formatExternalLink
Ensures a URL has a protocol (adds https:// if missing).

**Signature:**
```ts
formatExternalLink(url: string | undefined): string
```

**Usage:**
```ts
formatExternalLink('google.com') // "https://google.com"
```

---

## isExternalLink
Returns true if a URL is external (not the same origin as the app).

**Signature:**
```ts
isExternalLink(url: string): boolean
```

**Usage:**
```ts
isExternalLink('https://google.com') // true
isExternalLink('/about') // false
``` 