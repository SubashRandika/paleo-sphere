import type { SpeciesInput } from "@/domain/species/schema";
import { tyrannosaurusRex } from "./tyrannosaurus-rex";

/** Register each species file here. Order is not significant; the explorer sorts by age. */
export const speciesRecords: readonly SpeciesInput[] = [tyrannosaurusRex];
