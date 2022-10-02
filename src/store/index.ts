import create from "zustand";

import createDiscoverySlice, { DiscoverySlice } from "./discovery";

const useStore = create<DiscoverySlice>()((...a) => ({
  ...createDiscoverySlice(...a),
}))

export default useStore;