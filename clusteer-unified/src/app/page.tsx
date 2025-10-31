import AnimatedButton from "@/components/animated-button";
import NavBar from "@/components/nav-bar";
import StableCoinConverter from "@/components/stable-coin-converter";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FAQs, REASONS_TO_LOVE_CLUSTEER, REVIEWS } from "@/lib/data";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import CryptoCurrencies from "../../public/assets/images/crypto_currencies.svg";
import Container from "../components/container";

export default function Home() {
	return (
		<>
			<NavBar />
			<div className="pt-16 lg:pt-20 font-mona bg-[#FAFAFA]">
				<Container>
					<section className="flex flex-col items-center pb-16 lg:pb-20">
						<header className="text-center">
							<h1 className="font-bold text-[40px] leading-tight lg:text-6xl">
								Buy & Sell USDT <br /> instantly to <br />
								<span className="text-light-green">Naira</span>
							</h1>
							<p className="mt-6 lg:mt-8 text-[32px] leading-11 lg:text-4xl tracking-[-0.02em] font-avenir-next">
								Trade stablecoins. Receive Naira. No delays.
							</p>
						</header>
						<div className="mt-10 lg:mt-16 w-full">
							<StableCoinConverter />
						</div>
						<AnimatedButton
							className="h-[60px] max-w-[228px] rounded-[50px] mx-auto justify-center lg:hidden mt-10"
							text="Get Started"
							to="/signup"
						/>
						<div className="relative hidden lg:flex h-[60px] rounded-[50px] border-2 border-black font-avenir-next shrink-0 max-w-[456px] w-full overflow-hidden mt-12">
							<AnimatedButton
								className="!h-full rounded-none border-0 border-r-2 gap-x-3"
								text="Buy USDT"
								to="/login"
							/>
							<AnimatedButton
								variant="secondary"
								className="!h-full rounded-none border-0"
								text="Sell USDT"
								to="/login"
							/>
						</div>
						<div className="flex flex-col md:flex-row justify-between gap-x-5 gap-y-8 mt-16 lg:mt-20 w-fit md:w-full mx-auto md:items-center font-avenir-next">
							<div className="flex items-center gap-x-3.5 sm:gap-x-4">
								<Image
									className="lg:w-[67px] lg:h-[62px]"
									src="/assets/icons/customer_service.svg"
									alt="customer service icon"
									width={62}
									height={62}
								/>
								<span className="font-semibold text-xl">
									24/7 customer support
								</span>
							</div>
							<div className="flex items-center gap-x-3.5 sm:gap-x-4">
								<Image
									className="lg:w-[67px] lg:h-[62px]"
									src="/assets/icons/retry.svg"
									alt="customer service icon"
									width={62}
									height={62}
								/>
								<span className="font-semibold text-xl">Real-time rate</span>
							</div>
							<div className="flex items-center gap-x-3.5 sm:gap-x-4">
								<Image
									className="lg:w-[67px] lg:h-[62px]"
									src="/assets/icons/fees.svg"
									alt="customer service icon"
									width={62}
									height={62}
								/>
								<span className="font-semibold text-xl">Transparent fees</span>
							</div>
						</div>
						<Image
							className="mt-16 lg:mt-20 max-h-[388px] shrink"
							src={CryptoCurrencies}
							alt="an image of Multiple crypto currencies"
						/>
					</section>
				</Container>
				<Container id="how-it-works">
					<section className="py-16 lg:py-20">
						<header className="text-center">
							<h2 className="font-bold text-[40px] leading-snug lg:text-5xl tracking-[-0.02em]">
								How It Works
							</h2>
							<p className="mt-6 lg:mt-8 text-xl leading-[30px]">
								Get started with Clusteer in four simple steps. <br className="hidden md:block" /> Fast, secure, and straightforward.
							</p>
						</header>
						<div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
							<div className="flex flex-col items-center text-center">
								<div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-light-green border-2 border-black flex items-center justify-center text-2xl lg:text-3xl font-bold mb-6">
									1
								</div>
								<h3 className="text-xl font-bold font-avenir-next mb-3">Sign Up</h3>
								<p className="text-reviews-text font-lexend">
									Create your free account with your email or phone number. Quick verification in minutes.
								</p>
							</div>
							<div className="flex flex-col items-center text-center">
								<div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-light-green border-2 border-black flex items-center justify-center text-2xl lg:text-3xl font-bold mb-6">
									2
								</div>
								<h3 className="text-xl font-bold font-avenir-next mb-3">Choose Action</h3>
								<p className="text-reviews-text font-lexend">
									Select whether you want to buy USDT with Naira or sell USDT for Naira.
								</p>
							</div>
							<div className="flex flex-col items-center text-center">
								<div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-light-green border-2 border-black flex items-center justify-center text-2xl lg:text-3xl font-bold mb-6">
									3
								</div>
								<h3 className="text-xl font-bold font-avenir-next mb-3">Complete Transaction</h3>
								<p className="text-reviews-text font-lexend">
									Send crypto to the provided wallet address or make payment via bank transfer.
								</p>
							</div>
							<div className="flex flex-col items-center text-center">
								<div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-light-green border-2 border-black flex items-center justify-center text-2xl lg:text-3xl font-bold mb-6">
									4
								</div>
								<h3 className="text-xl font-bold font-avenir-next mb-3">Receive Funds</h3>
								<p className="text-reviews-text font-lexend">
									Get Naira in your bank account within 5 minutes or USDT in your wallet instantly.
								</p>
							</div>
						</div>
					</section>
				</Container>
				<Container id="features">
					<section className="py-16 lg:py-20">
						<header className="text-center">
							<h2 className="font-bold text-[40px] leading-snug lg:text-5xl tracking-[-0.02em]">
								Why you'll love Clusteer
							</h2>
							<p className="mt-6 lg:mt-8 text-xl leading-[30px]">
								Enjoy fast, secure, and hassle-free trading on a platform designed
								to make your <br className="hidden md:block" /> crypto-to-fiat
								exchanges simple and trustworthy.
							</p>
						</header>
						<ul className="grid grid-cols-1 text-center sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-x-8 gap-y-8 lg:gap-y-16 mt-12 lg:mt-16 xl:p-8">
							{REASONS_TO_LOVE_CLUSTEER.map((reason, _i) => (
								<li
									key={_i}
									className="bg-[#F0EBE6] rounded-2xl px-6 pt-[54px] pb-8 max-w-[384px] relative flex flex-col justify-center mt-8"
								>
									<div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
										<Image
											src={reason.image}
											alt="Data transfer icon"
											width={64}
											height={64}
										/>
									</div>
									<span className="text-xl font-bold font-avenir-next">
										{reason.title}
									</span>
									<p className="mt-2 font-lexend text-base text-real-black">
										{reason.content}
									</p>
								</li>
							))}
						</ul>
						<AnimatedButton
							className="mt-12 lg:mt-16 h-[60px] max-w-[228px] rounded-[50px] mx-auto justify-center"
							text="Start Now"
							to="/signup"
						/>
					</section>
				</Container>
				<section id="reviews" className="mt-16 lg:mt-20 pt-16 lg:pt-20 font-avenir-next">
					<Container className="pb-16 lg:pb-20">
						<header className="text-center">
							<h2 className="font-semibold text-3xl lg:text-5xl tracking-normal">
								Our reviews
							</h2>
							<p className="mt-6 lg:mt-8 text-lg lg:text-xl">
								Hear first-hand from our incredible community of customers.
							</p>
						</header>
						<div className="relative mt-12 lg:mt-16">
							<div className="flex justify-center xl:px-8 gap-x-8">
								<ul className="font-inter flex flex-col items-center gap-y-5 lg:gap-y-8 lg:pt-8">
									{REVIEWS.slice(1, 4).map((review) => (
										<li
											key={review.name}
											className="p-6 border border-[#E9EAEB] shadow-xs rounded-xl max-w-[384px]"
										>
											<div className="flex gap-x-1 mb-3">
												{[...Array(5)].map((_, i) => (
													<span
														key={i}
														className={`text-lg ${
															i < review.rating
																? "text-yellow-500"
																: "text-gray-300"
														}`}
													>
														★
													</span>
												))}
											</div>
											<p className="text-reviews-text">{review.content}</p>
											<div className="mt-8 flex gap-x-3">
												<Avatar className="size-12 border-[0.75px] border-[#00000014]">
													<AvatarImage
														src={review.image}
														alt="profile picture"
													/>
													<AvatarFallback>
														{getInitials(review.name)}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="flex gap-x-2">
														<span className="font-semibold text-base">
															{review.name}
														</span>
														<Image
															src="/assets/icons/verified.svg"
															alt="verified icon"
															width={16}
															height={16}
														/>
													</div>
													<p className="text-reviews-text text-sm">
														{review.position}
													</p>
												</div>
											</div>
										</li>
									))}
								</ul>
								<ul className="font-inter hidden md:flex flex-col items-center gap-y-5 lg:gap-y-8">
									{REVIEWS.slice(4, 7).map((review) => (
										<li
											key={review.name}
											className="p-6 border border-[#E9EAEB] shadow-xs rounded-xl max-w-[384px]"
										>
											<div className="flex gap-x-1 mb-3">
												{[...Array(5)].map((_, i) => (
													<span
														key={i}
														className={`text-lg ${
															i < review.rating
																? "text-yellow-500"
																: "text-gray-300"
														}`}
													>
														★
													</span>
												))}
											</div>
											<p className="text-reviews-text">{review.content}</p>
											<div className="mt-8 flex gap-x-3">
												<Avatar className="size-12 border-[0.75px] border-[#00000014]">
													<AvatarImage
														src={review.image}
														alt="profile picture"
													/>
													<AvatarFallback>
														{getInitials(review.name)}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="flex gap-x-2">
														<span className="font-semibold text-base">
															{review.name}
														</span>
														<Image
															src="/assets/icons/verified.svg"
															alt="verified icon"
															width={16}
															height={16}
														/>
													</div>
													<p className="text-reviews-text text-sm">
														{review.position}
													</p>
												</div>
											</div>
										</li>
									))}
								</ul>
								<ul className="font-inter hidden lg:flex flex-col items-center gap-y-5 lg:gap-y-8 lg:pt-8">
									{REVIEWS.slice(1, 4).map((review) => (
										<li
											key={review.name}
											className="p-6 border border-[#E9EAEB] shadow-xs rounded-xl max-w-[384px]"
										>
											<div className="flex gap-x-1 mb-3">
												{[...Array(5)].map((_, i) => (
													<span
														key={i}
														className={`text-lg ${
															i < review.rating
																? "text-yellow-500"
																: "text-gray-300"
														}`}
													>
														★
													</span>
												))}
											</div>
											<p className="text-reviews-text">{review.content}</p>
											<div className="mt-8 flex gap-x-3">
												<Avatar className="size-12 border-[0.75px] border-[#00000014]">
													<AvatarImage
														src={review.image}
														alt="profile picture"
													/>
													<AvatarFallback>
														{getInitials(review.name)}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="flex gap-x-2">
														<span className="font-semibold text-base">
															{review.name}
														</span>
														<Image
															src="/assets/icons/verified.svg"
															alt="verified icon"
															width={16}
															height={16}
														/>
													</div>
													<p className="text-reviews-text text-sm">
														{review.position}
													</p>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
							<div className="absolute bottom-0 left-0 right-0 h-3/12 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent pointer-events-none" />
						</div>
					</Container>
				</section>
				<Container>
					<section className="py-16 lg:py-20">
						<div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-16 font-avenir-next">
							<div className="space-y-4 max-w-[394px] w-full">
								<Image
									src="/assets/icons/traders.svg"
									alt="traders icon"
									width={76}
									height={76}
								/>
								<p className="text-xl font-bold">
									Trusted by 1,000+ traders across Nigeria
								</p>
								<p className="text-reviews-text text-lg">
									Big traders, small traders, side hustlers — they all hang with
									Clusteer. You're next  😘
								</p>
							</div>
							<div className="space-y-4 max-w-[394px] w-full">
								<Image
									src="/assets/icons/2fa_security.svg"
									alt="traders icon"
									width={76}
									height={76}
								/>
								<p className="text-xl font-bold">
									2FA Security, Fingerprint-Level Trust
								</p>
								<p className="text-reviews-text text-lg">
									Because passwords are so last season. Add 2FA and keep the nosy
									folks out — like a digital bouncer with your fingerprint.
								</p>
							</div>
							<div className="space-y-4 max-w-[394px] w-full">
								<Image
									src="/assets/icons/code.svg"
									alt="traders icon"
									width={76}
									height={76}
								/>
								<p className="text-xl font-bold">Built by Crypto-Natives</p>
								<p className="text-reviews-text text-lg">
									We use Clusteer too. That's why we made it bulletproof.
								</p>
							</div>
						</div>
					</section>
				</Container>
				<Container>
					<section id="faq" className="py-16 lg:py-20">
						<h2 className="font-bold text-center text-[40px] leading-snug lg:text-5xl tracking-normal">
							Frequently Asked Questions
						</h2>
						<div className="mt-12 lg:mt-16 font-lexend text-left max-w-[768px] mx-auto">
							<Accordion
								type="single"
								collapsible
							>
								{FAQs.map(({ question, answer }, _i) => (
									<AccordionItem
										key={`faq-${_i}`}
										className="p-8 border-b border-real-black last:border-b"
										value={`faq-${_i}`}
									>
										<AccordionTrigger className="text-lg font-medium">
											{question}
										</AccordionTrigger>
										<AccordionContent className="text-base pl-12 pb-0">
											{answer}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</section>
				</Container>
				<Container>
					<section className="border-b border-[#21241D4D] py-16 lg:py-20 text-center">
						<h3 className="font-semibold text-[30px] leading-10 text-center">
							Instant Naira payouts to your preferred bank
						</h3>
						<p className="mt-6 font-lexend text-base text-real-black">
							Once your crypto is received and confirmed on the network, Naira is
							sent directly to your bank account within 5 minutes.
						</p>

						<AnimatedButton
							className="mt-8 h-[60px] max-w-[228px] rounded-[50px] mx-auto"
							text="Sell USDT for Naira"
							to="/login"
						/>
					</section>
				</Container>
				<Container>
					<footer className="py-12 lg:py-16">
						<div className="flex flex-col sm:flex-row justify-between items-center sm:items-end">
							<div className="flex flex-col items-center sm:items-start text-center">
								<Link href="/">
									<Image
										src="/assets/icons/logo_with_name.svg"
										alt="Clusteer logo"
										className="shrink-0"
										width={160}
										height={38}
									/>
								</Link>
								<p className="max-w-[320px] text-center sm:text-left mt-6">
									Clusteer is a fast, secure platform for seamless USDT to Naira
									exchanges, offering instant transfers and transparent pricing.
								</p>
								<div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mt-6 sm:mt-8">
									<Link
										href="/security-info"
										className="text-base font-semibold hover:text-dark-green"
									>
										Security
									</Link>
									<Link
										href="#"
										className="text-base font-semibold hover:text-dark-green"
									>
										Anti-money Laundering
									</Link>
									<Link
										href="#"
										className="text-base font-semibold hover:text-dark-green"
									>
										Terms & Conditions
									</Link>
									<Link
										href="#"
										className="text-base font-semibold hover:text-dark-green"
									>
										Privacy
									</Link>
								</div>
							</div>
							<div className="flex flex-col gap-4 sm:ml-auto mt-8 sm:mt-0">
								<span className="font-inter font-medium text-center md:text-start">
									Coming Soon
								</span>
								<Link
									href="#"
									className="relative overflow-hidden grey-button flex items-center pl-[10px] gap-x-2 w-[135px] justify-start h-[40px] rounded-[30px] border border-black"
								>
									<Image
										src="/assets/icons/apple_logo.svg"
										alt="apple logo"
										width={18}
										height={22}
									/>
									<div className="space-y-[3px]">
										<Image
											src="/assets/icons/apple_download_text.svg"
											alt="download from the app store"
											width={75}
											height={16}
										/>
										<Image
											src="/assets/icons/apple_store_text.svg"
											alt="apple app store"
											width={70}
											height={7}
										/>
									</div>
								</Link>
								<Link
									href="#"
									className="relative overflow-hidden grey-button flex items-center pl-[10px] gap-x-2 w-[135px] justify-start h-[40px] rounded-[30px] border border-black"
								>
									<Image
										src="/assets/icons/google_play_logo.svg"
										alt="google play store logo"
										width={23}
										height={26}
									/>
									<div className="space-y-[3px]">
										<Image
											src="/assets/icons/google_play_download_text.svg"
											alt="Download from the play store"
											width={39}
											height={6}
										/>
										<Image
											src="/assets/icons/google_play_text.svg"
											alt="google play store"
											width={85}
											height={17}
										/>
									</div>
								</Link>
							</div>
						</div>
						<div className="mt-12 pt-8 px-8 sm:px-0 flex flex-col sm:flex-row gap-y-6 justify-between border-t border-grey-200">
							<p className="text-gray-500 text-base text-center">
								© 2025 Clusteer. All rights reserved.
							</p>
							<div className="flex gap-x-6 justify-center items-center">
								<Link
									href="https://twitter.com/clusteer"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:opacity-70 transition-opacity"
								>
									<Image
										src="/assets/icons/twitter_icon.svg"
										alt="twitter logo"
										className="h-auto"
										width={24}
										height={24}
									/>
								</Link>
								<Link
									href="https://linkedin.com/company/clusteer"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:opacity-70 transition-opacity"
								>
									<Image
										src="/assets/icons/linkedin_logo.svg"
										alt="linkedin logo"
										className="h-auto"
										width={24}
										height={24}
									/>
								</Link>
								<Link
									href="https://facebook.com/clusteer"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:opacity-70 transition-opacity"
								>
									<Image
										src="/assets/icons/facebook_logo.svg"
										alt="facebook logo"
										className="h-auto"
										width={24}
										height={24}
									/>
								</Link>
								<Link
									href="https://instagram.com/clusteer"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:opacity-70 transition-opacity"
								>
									<Image
										src="/assets/icons/instagram_logo.svg"
										alt="instagram logo"
										className="h-auto"
										width={24}
										height={24}
									/>
								</Link>
							</div>
						</div>
					</footer>
				</Container>
			</div>
		</>
	);
}
