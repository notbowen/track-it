import { Button } from "@/components/ui/button";

export default function Home() {
  return (
      <main className="p-12">
          <section className="py-6 mt-12 flex flex-col items-center text-center gap-8">
              <h1 className="text-4xl font-bold">A Collaborative Todo Tracker</h1>
              <p className="text-muted-foreground">Lorem ipsum placeholder thingy here</p>
          </section>
          <div className="flex gap-6 items-center justify-center">
              <Button variant="secondary">Source Code</Button>
              <Button>Get Started</Button>
          </div>
      </main>
  )
}
