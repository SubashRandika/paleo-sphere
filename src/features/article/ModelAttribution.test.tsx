import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ModelAttribution } from "./ModelAttribution";

const attribution = {
  creator: "Someone",
  creatorUrl: "https://example.org/someone",
  title: "Fixture model",
  sourceUrl: "https://example.org/model",
  license: "CC-BY-4.0" as const,
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  modifications: [] as string[],
};

const notes = [{ text: "Colour is an artistic choice.", level: 4 as const, citationIds: [] }];

describe("ModelAttribution", () => {
  it("links the source, creator, and license as CC BY requires", () => {
    render(<ModelAttribution attribution={attribution} appearanceNotes={notes} />);

    expect(screen.getByRole("link", { name: "“Fixture model”" })).toHaveAttribute(
      "href",
      attribution.sourceUrl,
    );
    expect(screen.getByRole("link", { name: "Someone" })).toHaveAttribute("href", attribution.creatorUrl);
    expect(screen.getByRole("link", { name: "CC BY 4.0" })).toHaveAttribute("rel", "license");
  });

  it("states modifications when the asset was changed", () => {
    render(
      <ModelAttribution
        attribution={{ ...attribution, modifications: ["Textures resized", "Scaled to life size"] }}
        appearanceNotes={notes}
      />,
    );
    expect(screen.getByText(/Changes: Textures resized; Scaled to life size\./)).toBeInTheDocument();
  });

  it("labels each appearance note with its evidence level in words", () => {
    render(<ModelAttribution attribution={attribution} appearanceNotes={notes} />);
    expect(screen.getByText("Artistic interpretation")).toBeInTheDocument();
    expect(screen.getByText(notes[0]!.text)).toBeInTheDocument();
  });
});
