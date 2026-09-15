"use client";

import { createContext, useContext } from "react";

/** Presentation state only. Scrolling never advances or resets a conversion. */
export const HeroConversionContext = createContext<{
	motion: boolean;
	cardOnly: boolean;
	visible: boolean;
	interactive: boolean;
	dashboardInteractive: boolean;
	open: () => void;
	close: () => void;
} | null>(null);

export const useHeroConversion = () => useContext(HeroConversionContext);
