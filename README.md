# Type-aware lint hangs on a Kysely query with many joins (2.5.13+)

`nursery/noFloatingPromises` takes exponentially longer as the number of joins in a
[Kysely](https://kysely.dev) query builder chain grows. The same file lints instantly on 2.5.12.

## Reproduce

```sh
npm install
./run.sh
```

or manually:

```sh
npm install --no-save @biomejs/biome@2.5.12 && npx biome lint src/consumer.ts   # ~0.2s
npm install --no-save @biomejs/biome@2.5.13 && npx biome lint src/consumer.ts   # does not finish in 60s
```

`src/list.ts` contains one query with 8 joins and a trivial `select`. `src/consumer.ts` only
`await`s it. There is no floating promise in the project, so the rule has nothing to report: the
time is spent in type inference for the awaited call.

## Timings (Apple M3, macOS 26.6, Node 24.20, `biome lint src/consumer.ts`, one file)

Join count in `src/list.ts` (remove joins from the bottom of the chain to vary it):

| joins | 2.5.12 | 2.5.13 | 2.5.15 |
|------:|-------:|-------:|-------:|
| 6 | 0.2s | 42s | 0.8s |
| 7 | 0.1s | >60s | 3.4s |
| 8 | 0.1s | >60s | 24s |
| 9 | 0.1s | >60s | >60s |

2.5.14 behaves like 2.5.13 (>120s with 8 joins). `./run.sh` output on the same machine:

```
biome 2.5.12: 2s
biome 2.5.13: TIMEOUT (>60s)
biome 2.5.14: TIMEOUT (>60s)
biome 2.5.15: 26s
```

(`run.sh` includes `npx` start-up, hence 2s rather than 0.2s for 2.5.12.)

So there are two things: a regression between 2.5.12 and 2.5.13, and 2.5.15 improves it but the
growth in the number of joins is still exponential.

Only `nursery/noFloatingPromises` is enabled in `biome.json`.
