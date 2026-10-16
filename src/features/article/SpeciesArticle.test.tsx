import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getAllSpecies, getSpeciesBySlug } from "@/domain/species/repository";
import { plainText, RichText } from "@/ui/RichText";
import { indexCitations } from "./format";
import { QuickFacts } from "./QuickFacts";
import { SpeciesArticle } from "./SpeciesArticle";

const trex = getSpeciesBySlug("tyrannosaurus-rex")!;
const content = trex.content!;
const index = indexCitations(content.citations);

describe("RichText", () => {
  it("renders _Name_ markup as italic and strips it for plain text", () => {
    const { container } = render(<p>{RichText({ text: "Like _T. rex_ and _Triceratops_." })}</p>);
    expect([...container.querySelectorAll("i")].map((i) => i.textContent)).toEqual(["T. rex", "Triceratops"]);
    expect(container.textContent).toBe("Like T. rex and Triceratops.");
    expect(plainText("_A_ b _C_")).toBe("A b C");
  });
});

describe("SpeciesArticle", () => {
  it("shows the facts, what is known and what is uncertain as headed sections", () => {
    render(<SpeciesArticle content={content} index={index} />);
    for (const name of ["Worth knowing", "What scientists know", "What remains uncertain", "Sources"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });

  it("links every source marker to an entry in the sources list", () => {
    const { container } = render(<SpeciesArticle content={content} index={index} />);
    const markers = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#source-"]')];
    expect(markers.length).toBeGreaterThan(10);
    for (const a of markers) {
      expect(container.querySelector(a.getAttribute("href")!), a.getAttribute("href")!).not.toBeNull();
    }
  });

  it("numbers sources so the marker text matches the list position", () => {
    render(<SpeciesArticle content={content} index={index} />);
    const list = screen.getByRole("heading", { name: "Sources" }).nextElementSibling as HTMLElement;
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(content.citations.length);
    expect(items[0]).toHaveTextContent(/^1\./);
    const bell = content.citations.findIndex((c) => c.id === "bell-2017") + 1;
    expect(screen.getAllByRole("link", { name: `Source ${bell}` })[0]).toHaveAttribute(
      "href",
      "#source-bell-2017",
    );
  });

  it("labels evidence on claims but not on discovery history", () => {
    const { container } = render(<SpeciesArticle content={content} index={index} />);
    expect(screen.getAllByText("Plausible reconstruction").length).toBeGreaterThan(0);
    const discovery = container.querySelector("#discovery")!;
    expect(within(discovery as HTMLElement).queryByText(/Fossil evidence|Strong inference/)).toBeNull();
  });
});

describe("QuickFacts", () => {
  it("shows the full spread of estimates and how each was made", () => {
    render(<QuickFacts content={content} index={index} />);
    expect(screen.getByText("12–13 m")).toBeInTheDocument();
    expect(screen.getByText("5–9.5 t")).toBeInTheDocument();
    expect(screen.getByText("How these were estimated")).toBeInTheDocument();
    expect(screen.getByText(/3D volumetric models of four large skeletons/)).toBeInTheDocument();
    expect(screen.getByText(/“Sue”, FMNH PR 2081/)).toBeInTheDocument();
  });
});

describe("every reviewed species", () => {
  it.each(getAllSpecies().filter((s) => s.content && s.review.status !== "draft"))(
    "$slug renders without broken source links",
    (species) => {
      const c = species.content!;
      const { container } = render(<SpeciesArticle content={c} index={indexCitations(c.citations)} />);
      for (const a of container.querySelectorAll('a[href^="#source-"]')) {
        expect(container.querySelector(a.getAttribute("href")!)).not.toBeNull();
      }
    },
  );
});
