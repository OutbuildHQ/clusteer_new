"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";

export default function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="ml-auto md:hidden z-50 relative"
				aria-label="Toggle menu"
			>
				<Image
					src="/assets/icons/menu.svg"
					alt="Menu icon"
					width={24}
					height={24}
				/>
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="fixed inset-0 bg-black/50 z-40 md:hidden"
						/>

						{/* Menu Panel */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.3 }}
							className="fixed right-0 top-0 h-full w-[280px] bg-white shadow-2xl z-50 md:hidden"
						>
							<div className="flex flex-col h-full">
								{/* Header */}
								<div className="flex items-center justify-between p-6 border-b">
									<Link href="/" onClick={() => setIsOpen(false)}>
										<Image
											src="/assets/icons/logo_with_name.svg"
											alt="Clusteer logo"
											width={100}
											height={24}
										/>
									</Link>
									<button
										onClick={() => setIsOpen(false)}
										className="text-2xl"
										aria-label="Close menu"
									>
										×
									</button>
								</div>

								{/* Menu Items */}
								<nav className="flex-1 overflow-y-auto p-6">
									<ul className="space-y-6">
										<li>
											<Link
												href="/login"
												className="block text-lg font-semibold hover:text-dark-green transition-colors"
												onClick={() => setIsOpen(false)}
											>
												Log In
											</Link>
										</li>
										<li>
											<Link
												href="/signup"
												className="block text-lg font-semibold hover:text-dark-green transition-colors"
												onClick={() => setIsOpen(false)}
											>
												Sign Up
											</Link>
										</li>
										<li className="pt-4 border-t">
											<Link
												href="#how-it-works"
												className="block text-base hover:text-dark-green transition-colors"
												onClick={() => setIsOpen(false)}
											>
												How It Works
											</Link>
										</li>
										<li>
											<Link
												href="#features"
												className="block text-base hover:text-dark-green transition-colors"
												onClick={() => setIsOpen(false)}
											>
												Features
											</Link>
										</li>
										<li>
											<Link
												href="#reviews"
												className="block text-base hover:text-dark-green transition-colors"
												onClick={() => setIsOpen(false)}
											>
												Reviews
											</Link>
										</li>
										<li>
											<Link
												href="#faq"
												className="block text-base hover:text-dark-green transition-colors"
												onClick={() => setIsOpen(false)}
											>
												FAQ
											</Link>
										</li>
									</ul>
								</nav>

								{/* Footer */}
								<div className="p-6 border-t space-y-3">
									<Link
										href="/signup"
										className="block w-full text-center py-3 px-4 bg-light-green border-2 border-black rounded-full font-semibold hover:bg-light-green/80 transition-colors"
										onClick={() => setIsOpen(false)}
									>
										Get Started
									</Link>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
