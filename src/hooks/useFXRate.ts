"use client";

import { useState, useEffect } from "react";

export function useFXRate(baseCurrency = "PHP", targetCurrency = "JPY") {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRate() {
      try {
        const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${baseCurrency}&symbols=${targetCurrency}`);
        if (!res.ok) throw new Error("Failed to fetch from Frankfurter");
        const data = await res.json();
        if (data?.rates?.[targetCurrency] && isMounted) {
          setRate(data.rates[targetCurrency]);
        }
      } catch (err) {
        console.warn("FX rate fetch fallback:", err);
        if (isMounted) {
          // Standard approximate benchmark fallback: 1 PHP ≈ 2.70 JPY
          if (baseCurrency === "PHP" && targetCurrency === "JPY") {
            setRate(2.70);
          } else if (baseCurrency === "USD" && targetCurrency === "JPY") {
            setRate(155.0);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchRate();

    return () => {
      isMounted = false;
    };
  }, [baseCurrency, targetCurrency]);

  return { rate, isLoading };
}
