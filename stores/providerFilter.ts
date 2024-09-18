import { atom } from "jotai";

interface ProviderFilterStoreProps {
  filterValue: string;
  provider?: string;
}

const providerFilterStore = atom({
  filterValue: "all",
} as ProviderFilterStoreProps);

export { providerFilterStore };
