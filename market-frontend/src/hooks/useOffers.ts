import { useEffect, useState } from "react";
import { Offer } from "../types";

export function useOffers(): {
  offers: Offer[];
  loading: boolean;
} {
  const [offers, updateOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOffers = async () => {
      const response = await fetch("/api/offers");
      const offers = (await response.json()).map((i: any) => i as Offer);
      updateOffers(offers);
      setLoading(false);
    };
    fetchOffers();
  }, []);
  return { offers, loading };
}
