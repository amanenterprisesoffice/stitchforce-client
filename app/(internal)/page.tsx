"use client"

import Link from "next/link"
import Header from "@/components/ui/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Factory,
  IndianRupee,
  Layers3,
  Users,
  TrendingUp,
  CheckCircle2,
  Scissors,
} from "lucide-react"

const stats = [
  {
    label: "Active Workers",
    value: "124",
    icon: Users,
  },
  {
    label: "Pieces Completed",
    value: "8,450",
    icon: Layers3,
  },
  {
    label: "Worker Earnings",
    value: "₹84,250",
    icon: IndianRupee,
  },
]

const operations = [
  {
    name: "Collar Stitching",
    worker: "Rahul S.",
    pieces: 120,
    amount: "₹360",
    progress: 85,
  },
  {
    name: "Sleeve Stitching",
    worker: "Priya M.",
    pieces: 95,
    amount: "₹380",
    progress: 68,
  },
  {
    name: "Button Attachment",
    worker: "Amit K.",
    pieces: 150,
    amount: "₹300",
    progress: 92,
  },
]

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Background decorations */}
      <div className="pointer-events-none absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />

      {/* Hero */}
      <section className="relative flex flex-1 items-center pt-18 md:pt-0">
        <div className="my-container mx-auto grid w-full pt-10 md:pt-0 border-t md:border-t-0  items-center gap-10 py-10 lg:min-h-full lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-8 xl:gap-20">
          {/* LEFT: Content */}
          <div className="flex flex-col items-start">
            <Badge
              variant="outline"
              className="mb-5 gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Garment Manufacturing Management
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Badge>

            <h1 className="text-[clamp(2.5rem,4.4vw,4.5rem)] leading-[1.08] font-extrabold tracking-[-0.055em]">
              Every piece.
              <br />
              <span className="text-primary">Every rupee.</span>
              <br />
              Accounted for.
            </h1>

            <p className="mt-5 max-w-[510px] text-sm leading-7 text-muted-foreground md:text-base">
              Meet StitchForce — your all-in-one garment manufacturing
              management system. Track production, manage workers, calculate
              earnings, and stay on top of every payment from one place.
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-11 gap-3 px-6"
                render={
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />

              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6"
                render={<Link href="/dashboard">Explore Platform</Link>}
              />
            </div>

            {/* Features */}
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {[
                "Production Tracking",
                "Worker Earnings",
                "Payment Records",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Dashboard preview */}
          <div className="relative mx-auto w-full max-w-[620px]">
            {/* Glow */}
            <div className="absolute inset-10 rounded-full bg-primary/10 blur-[90px]" />

            <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/10">
              {/* Dashboard header */}
              <div className="flex items-center justify-between border-b px-4 py-3 md:px-5 md:py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Scissors className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">StitchForce</p>
                    <p className="text-xs text-muted-foreground">
                      Manufacturing Overview
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="gap-1.5 rounded-full text-[10px] md:text-xs"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Live Overview
                </Badge>
              </div>

              <div className="space-y-4 p-4 md:space-y-5 md:p-5">
                {/* Welcome */}
                <div>
                  <h2 className="text-base font-bold md:text-lg">
                    Good morning, Admin 👋
                  </h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Here's what's happening in your factory.
                  </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {stats.map((stat) => {
                    const Icon = stat.icon

                    return (
                      <div
                        key={stat.label}
                        className="min-w-0 rounded-xl border bg-background p-2.5 md:p-3.5"
                      >
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>

                        <p className="truncate text-base font-bold tracking-tight md:text-xl">
                          {stat.value}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-muted-foreground md:text-xs">
                          {stat.label}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Outstanding payments */}
                <div className="flex items-center justify-between gap-3 rounded-xl bg-primary/5 p-3.5 md:p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IndianRupee className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold md:text-sm">
                        Outstanding Payments
                      </p>
                      <p className="text-[10px] text-muted-foreground md:text-xs">
                        Pending worker earnings
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold md:text-xl">₹32,450</p>
                    <p className="text-[10px] text-muted-foreground md:text-xs">
                      To be settled
                    </p>
                  </div>
                </div>
              </div>

              {/* Dashboard bottom bar */}
              <div className="flex items-center justify-between border-t px-4 py-2.5">
                <span className="text-[10px] text-muted-foreground">
                  StitchForce Management
                </span>

                <span className="flex items-center gap-1.5 text-[10px] font-medium text-primary">
                  <TrendingUp className="h-3 w-3" />
                  Production at a glance
                </span>
              </div>
            </div>

            {/* Floating factory card */}
            <div className="absolute top-20 -right-3 hidden rounded-xl border bg-card p-3 shadow-lg xl:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Factory className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold">Factory Control</p>
                  <p className="text-[10px] text-muted-foreground">
                    All in one place
                  </p>
                </div>
              </div>
            </div>

            {/* Floating production card */}
            <div className="absolute -bottom-3 -left-3 hidden rounded-xl border bg-card p-3 shadow-lg xl:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                  <Boxes className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold">Production Organized</p>
                  <p className="text-[10px] text-muted-foreground">
                    Every piece tracked
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
