import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { toSummaries } from "@/domain/species/explorer";
import { getAllSpecies } from "@/domain/species/repository";
import { SpeciesBrowser } from "./SpeciesBrowser";

const species = toSummaries(getAllSpecies());
const cards = () => within(screen.getAllByRole("list").at(-1)!).getAllByRole("link");

describe("SpeciesBrowser", () => {
  it("lists every species, oldest first, linking to its page", () => {
    render(<SpeciesBrowser species={species} />);
    expect(cards().map((a) => a.getAttribute("href"))).toEqual(species.map((s) => `/species/${s.slug}`));
    expect(screen.getByRole("status")).toHaveTextContent("5 species");
  });

  it("narrows by filter chips, which toggle and combine", async () => {
    const user = userEvent.setup();
    render(<SpeciesBrowser species={species} />);

    await user.click(screen.getByRole("button", { name: "Jurassic" }));
    expect(cards()).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Jurassic" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Meat-eater" }));
    expect(cards().map((a) => a.textContent)).toEqual([expect.stringContaining("Allosaurus fragilis")]);
    expect(screen.getByRole("status")).toHaveTextContent("1 of 5 species");

    await user.click(screen.getByRole("button", { name: "Jurassic" }));
    expect(cards()).toHaveLength(2);
  });

  it("searches names and shows a way out when nothing matches", async () => {
    const user = userEvent.setup();
    render(<SpeciesBrowser species={species} />);

    await user.type(screen.getByRole("searchbox"), "triceratops");
    expect(cards()).toHaveLength(1);

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "velociraptor");
    expect(screen.getByText(/No species match/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(cards()).toHaveLength(5);
  });
});
