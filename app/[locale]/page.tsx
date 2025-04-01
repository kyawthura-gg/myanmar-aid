"use client"

import { ArrowRight, Heart, Shield, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export default async function Home() {
	const t = useTranslations("home")
	const common = useTranslations("common")

	return (
		<div className="flex flex-col min-h-screen">
			<SiteHeader />
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="space-y-4">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
									{t("title")}
								</h1>
								<p className="max-w-[600px] text-muted-foreground md:text-xl">
									{t("subtitle")}
								</p>
								<div className="flex flex-col sm:flex-row gap-4">
									<Button asChild size="lg">
										<Link href="/donate">{t("donateButton")}</Link>
									</Button>
									<Button asChild variant="outline" size="lg">
										<Link href="/register-family">{t("registerButton")}</Link>
									</Button>
								</div>
							</div>
							<div className="rounded-lg overflow-hidden">
								<img
									src="/placeholder.svg?height=500&width=700"
									alt="Myanmar earthquake affected area"
									className="aspect-video object-cover w-full"
								/>
							</div>
						</div>
					</div>
				</section>

				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
									{t("howItWorks")}
								</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl">
									{t("howItWorksDescription")}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
							<Card className="flex flex-col items-center text-center">
								<CardHeader>
									<div className="p-2 bg-primary/10 rounded-full w-fit mx-auto">
										<Users className="h-6 w-6 text-primary" />
									</div>
									<CardTitle>{t("register")}</CardTitle>
									<CardDescription>{t("registerDescription")}</CardDescription>
								</CardHeader>
								<CardContent className="flex-1">
									<p className="text-muted-foreground">
										{t("registerContent")}
									</p>
								</CardContent>
								<CardFooter>
									<Button asChild variant="ghost" size="sm">
										<Link
											href="/register-family"
											className="flex items-center gap-1"
										>
											{t("learnMore")} <ArrowRight className="h-4 w-4" />
										</Link>
									</Button>
								</CardFooter>
							</Card>
							<Card className="flex flex-col items-center text-center">
								<CardHeader>
									<div className="p-2 bg-primary/10 rounded-full w-fit mx-auto">
										<Heart className="h-6 w-6 text-primary" />
									</div>
									<CardTitle>Donate</CardTitle>
									<CardDescription>
										Browse verified families and donate directly to them
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-1">
									<p className="text-muted-foreground">
										Choose a family based on their needs and location. Make
										direct payments through bank transfer, mobile money, or
										cryptocurrency.
									</p>
								</CardContent>
								<CardFooter>
									<Button asChild variant="ghost" size="sm">
										<Link href="/donate" className="flex items-center gap-1">
											Learn More <ArrowRight className="h-4 w-4" />
										</Link>
									</Button>
								</CardFooter>
							</Card>
							<Card className="flex flex-col items-center text-center">
								<CardHeader>
									<div className="p-2 bg-primary/10 rounded-full w-fit mx-auto">
										<Shield className="h-6 w-6 text-primary" />
									</div>
									<CardTitle>Transparency</CardTitle>
									<CardDescription>
										Track donations and see the impact of your support
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-1">
									<p className="text-muted-foreground">
										Public donation ledger shows verified transactions. Families
										can acknowledge receipt and share how the aid has helped
										them.
									</p>
								</CardContent>
								<CardFooter>
									<Button asChild variant="ghost" size="sm">
										<Link
											href="/transparency"
											className="flex items-center gap-1"
										>
											Learn More <ArrowRight className="h-4 w-4" />
										</Link>
									</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</section>

				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className="container px-4 md:px-6">
						<div className="grid gap-10 lg:grid-cols-2">
							<div className="space-y-4">
								<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
									Emergency Needs
								</h2>
								<p className="text-muted-foreground md:text-xl">
									Families affected by the earthquake urgently need:
								</p>
								<ul className="grid gap-2 md:grid-cols-2">
									<li className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-primary" />
										<span>Temporary shelter materials</span>
									</li>
									<li className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-primary" />
										<span>Clean drinking water</span>
									</li>
									<li className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-primary" />
										<span>Food supplies</span>
									</li>
									<li className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-primary" />
										<span>Medical assistance</span>
									</li>
									<li className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-primary" />
										<span>Hygiene kits</span>
									</li>
									<li className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-primary" />
										<span>Baby supplies</span>
									</li>
								</ul>
								<div className="pt-4">
									<Button asChild>
										<Link href="/donate">Donate Now</Link>
									</Button>
								</div>
							</div>
							<div className="space-y-4">
								<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
									Impact Statistics
								</h2>
								<div className="grid gap-8 md:grid-cols-2">
									<div className="space-y-2">
										<h3 className="text-4xl font-bold">247</h3>
										<p className="text-muted-foreground">Families Registered</p>
									</div>
									<div className="space-y-2">
										<h3 className="text-4xl font-bold">$32,450</h3>
										<p className="text-muted-foreground">Directly Donated</p>
									</div>
									<div className="space-y-2">
										<h3 className="text-4xl font-bold">189</h3>
										<p className="text-muted-foreground">Families Helped</p>
									</div>
									<div className="space-y-2">
										<h3 className="text-4xl font-bold">100%</h3>
										<p className="text-muted-foreground">Funds to Recipients</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="border-t py-6 md:py-8">
				<div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-2 font-semibold">
						<Heart className="h-5 w-5 text-primary" />
						<span>Myanmar Aid Connect</span>
					</div>
					<p className="text-sm text-muted-foreground">{t("footer")}</p>
					<div className="flex gap-4">
						<Link
							href="/privacy"
							className="text-sm text-muted-foreground hover:underline"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="text-sm text-muted-foreground hover:underline"
						>
							Terms of Service
						</Link>
						<Link
							href="/contact"
							className="text-sm text-muted-foreground hover:underline"
						>
							Contact
						</Link>
					</div>
				</div>
			</footer>
		</div>
	)
}
