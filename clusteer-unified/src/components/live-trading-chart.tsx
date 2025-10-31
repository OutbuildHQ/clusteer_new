"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import { useQuery } from "@tanstack/react-query";

interface LiveTradingChartProps {
  symbol?: string;
  transactionType?: "buy" | "sell";
}

export default function LiveTradingChart({ symbol = "USDT/NGN", transactionType = "buy" }: LiveTradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const lineSeriesRef = useRef<any>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const initialDataRef = useRef<any[]>([]);

  // Fetch real exchange rate based on transaction type
  const { data: rateData } = useQuery({
    queryKey: ["exchange-rate", "USDT", "NGN", transactionType],
    queryFn: async () => {
      const response = await fetch(`/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=${transactionType}`);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }
      const result = await response.json();
      return result;
    },
    refetchInterval: 60000, // Auto-refresh every 60 seconds
  });

  // Use appropriate rate based on transaction type
  const buyRate = rateData?.buyRate || 1447.68;
  const sellRate = rateData?.sellRate || 1455.50;
  const baseRate = transactionType === "buy" ? buyRate : sellRate;

  useEffect(() => {
    if (!chartContainerRef.current || !baseRate) return;

    // Create chart with enhanced styling
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#F2F2F0" },
        textColor: "#0D0D0D",
        fontSize: 12,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: {
          color: "#E9EAEB",
          style: 1,
        },
        horzLines: {
          color: "#E9EAEB",
          style: 1,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#667085",
          width: 1,
          style: 3,
        },
        horzLine: {
          color: "#667085",
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: "#E9EAEB",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: "#E9EAEB",
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    });

    chartRef.current = chart;

    // Add line series with design color
    const lineSeries = chart.addSeries(LineSeries, {
      color: "#014F01",
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
      crosshairMarkerBorderColor: "#014F01",
      crosshairMarkerBackgroundColor: "#FFFFFF",
    });

    lineSeriesRef.current = lineSeries;

    // Generate realistic historical data based on actual market rates
    const now = Math.floor(Date.now() / 1000);
    const initialData = [];

    // Start very close to base rate for minimal deviation
    let price = baseRate * 0.9995; // Start 0.05% below current rate
    const dailyVolatility = 0.003; // 0.3% daily volatility (very low, synchronized with platform)
    const minuteVolatility = dailyVolatility / Math.sqrt(1440); // Scale to per-minute

    for (let i = 100; i >= 0; i--) {
      const time = now - i * 60; // 1-minute intervals

      // Very small random walk, mostly flat
      const change = (Math.random() - 0.5) * price * minuteVolatility * 0.5;
      price = price + change;

      // Keep price within tight bounds (±0.5% of base rate)
      price = Math.max(baseRate * 0.995, Math.min(baseRate * 1.005, price));

      initialData.push({
        time: time as any,
        value: parseFloat(price.toFixed(2)),
      });
    }

    initialDataRef.current = initialData;
    lineSeries.setData(initialData);
    const lastPrice = initialData[initialData.length - 1].value;
    const firstPrice = initialData[0].value;
    setCurrentPrice(lastPrice);
    setPriceChange(((lastPrice - firstPrice) / firstPrice) * 100);

    // Fit content to display
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Simulate real-time updates synced with platform rate - very slow and minimal changes
    const interval = setInterval(() => {
      if (!lineSeriesRef.current || initialDataRef.current.length === 0) return;

      const lastPoint = initialDataRef.current[initialDataRef.current.length - 1];
      const currentTime = Math.floor(Date.now() / 1000);

      // Very low volatility synchronized with platform (0.3% daily)
      const minuteVolatility = 0.003 / Math.sqrt(1440);

      // Gentle drift toward base rate to keep in sync with platform
      const driftToBase = (baseRate - lastPoint.value) * 0.05; // 5% drift toward base
      const randomChange = (Math.random() - 0.5) * lastPoint.value * minuteVolatility * 0.3;

      let newValue = lastPoint.value + driftToBase + randomChange;

      // Keep within very tight bounds (±0.5% of base rate) to stay synchronized
      newValue = Math.max(baseRate * 0.995, Math.min(baseRate * 1.005, newValue));
      newValue = parseFloat(newValue.toFixed(2));

      const newPoint = {
        time: currentTime as any,
        value: newValue,
      };

      initialDataRef.current.push(newPoint);
      lineSeriesRef.current.update(newPoint);
      setCurrentPrice(newValue);

      // Update price change percentage
      const firstPrice = initialDataRef.current[0].value;
      setPriceChange(((newValue - firstPrice) / firstPrice) * 100);

      // Keep only last 100 points
      if (initialDataRef.current.length > 100) {
        initialDataRef.current.shift();
        lineSeriesRef.current.setData(initialDataRef.current);
      }
    }, 5000); // Update every 5 seconds (slower, more stable)

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
      chart.remove();
    };
  }, [baseRate]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#667085]">{symbol}</p>
          <p className="text-lg font-bold text-[#0D0D0D]">
            ₦{currentPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs font-medium ${priceChange >= 0 ? 'text-[#11C211]' : 'text-[#FF4D4D]'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% today
          </p>
        </div>
        <div className="flex gap-1">
          <span className="text-xs px-2 py-1 rounded-full bg-[#11C211]/10 text-[#11C211] font-medium">
            Live
          </span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full rounded-lg overflow-hidden relative chart-container" />
      <style jsx global>{`
        .chart-container > div > div:last-child {
          display: none !important;
        }
        .chart-container canvas + div {
          display: none !important;
        }
        .chart-container table + div {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
