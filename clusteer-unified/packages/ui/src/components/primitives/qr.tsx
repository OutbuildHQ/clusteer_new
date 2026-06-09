"use client";

import { QRCodeSVG } from "qrcode.react";

export function QR({ value, size = 192 }: { value: string; size?: number }) {
	return (
		<div className="inline-block rounded-xl border border-border bg-white p-4">
			<QRCodeSVG
				value={value}
				size={size}
				level="M"
				fgColor="#0a0a0a"
				bgColor="#ffffff"
				marginSize={0}
			/>
		</div>
	);
}
