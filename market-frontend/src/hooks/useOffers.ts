import { useEffect, useState } from "react";
import { Offer } from "../types";

export function useOffers(): {
  offers: Offer[];
  loaded: boolean;
} {
  const [offers, updateOffers] = useState<Offer[]>([]);
  const [loaded, updateLoaded] = useState(false);
  useEffect(() => {
    const fetchOffers = async () => {
      const response = await fetch("/api/offers");
      const offers = (await response.json()).map((i: any) => i as Offer);
      updateOffers(offers);
      updateLoaded(true);
    };
    fetchOffers();
  }, []);
  return { offers, loaded };
}
