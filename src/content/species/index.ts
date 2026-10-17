import type { SpeciesInput } from "@/domain/species/schema";
import { allosaurusFragilis } from "./allosaurus-fragilis";
import { brachiosaurusAltithorax } from "./brachiosaurus-altithorax";
import { brontosaurusExcelsus } from "./brontosaurus-excelsus";
import { dilophosaurusWetherilli } from "./dilophosaurus-wetherilli";
import { mamenchisaurus } from "./mamenchisaurus";
import { stegosaurusStenops } from "./stegosaurus-stenops";
import { triceratopsHorridus } from "./triceratops-horridus";
import { tyrannosaurusRex } from "./tyrannosaurus-rex";

/** Register each species file here. Order is not significant; the explorer sorts by age. */
export const speciesRecords: readonly SpeciesInput[] = [
  tyrannosaurusRex,
  triceratopsHorridus,
  stegosaurusStenops,
  allosaurusFragilis,
  mamenchisaurus,
  dilophosaurusWetherilli,
  brontosaurusExcelsus,
  brachiosaurusAltithorax,
];
