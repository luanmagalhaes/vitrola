import { describe, expect, it } from "vitest";
import { allTracks, nationalTracks } from "@/data/tracks";
import { matchRules, pickSpreadSeeds } from "@/lib/game/seeds";
import { createSeededRng } from "@/utils/shuffle";

describe("sementes da mesa", () => {
  it("devolve a quantidade pedida", () => {
    for (const count of [1, 3, 5]) {
      expect(pickSpreadSeeds(allTracks, count, createSeededRng(7))).toHaveLength(count);
    }
  });

  it("nao repete faixa na mesma mao", () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const chosen = pickSpreadSeeds(allTracks, 5, createSeededRng(seed));
      const ids = chosen.map((track) => track.id);

      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("devolve as cartas em ordem de ano", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const years = pickSpreadSeeds(allTracks, 5, createSeededRng(seed)).map((t) => t.year);

      expect([...years].sort((a, b) => a - b)).toEqual(years);
    }
  });

  it("nao repete ano dentro da mesma mao na maioria das partidas", () => {
    let distinct = 0;

    for (let seed = 1; seed <= 50; seed += 1) {
      const years = pickSpreadSeeds(allTracks, 3, createSeededRng(seed)).map((t) => t.year);

      if (new Set(years).size === years.length) {
        distinct += 1;
      }
    }

    expect(distinct).toBeGreaterThanOrEqual(45);
  });

  it("espalha as sementes por decadas diferentes", () => {
    for (let seed = 1; seed <= 30; seed += 1) {
      const decades = pickSpreadSeeds(allTracks, 3, createSeededRng(seed)).map((track) =>
        Math.floor(track.year / 10) * 10,
      );

      expect(new Set(decades).size).toBe(decades.length);
    }
  });

  it("funciona com um baralho so", () => {
    expect(pickSpreadSeeds(nationalTracks, 5, createSeededRng(3))).toHaveLength(5);
  });

  it("nao estoura quando pedem mais cartas do que existem", () => {
    const tiny = allTracks.slice(0, 2);

    expect(pickSpreadSeeds(tiny, 5, createSeededRng(1)).length).toBeLessThanOrEqual(2);
  });

  it("toda partida comeca com uma carta de saida so", () => {
    expect(matchRules.seedCards).toBe(1);
    expect(matchRules.targetCards).toBe(10);
  });

  it("cabe o pior caso: 10 jogadores", () => {
    const needed = matchRules.seedCards * 10;

    expect(nationalTracks.length).toBeGreaterThan(needed);
    expect(allTracks.length).toBeGreaterThan(needed);
  });
});
