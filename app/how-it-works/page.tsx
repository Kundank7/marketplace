import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, CreditCard, CheckCircle } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">How It Works</h1>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Step 1 */}
            <div className="md:col-start-1 flex flex-col items-center md:items-end">
              <div className="relative z-10 bg-background p-2 rounded-full mb-4">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <Card className="w-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <ShoppingCart className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold">Choose Your Service</h3>
                    <p className="text-muted-foreground text-center md:text-left">
                      Browse our wide range of services and select the one that fits your needs. Customize your order
                      with the desired quantity and options.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-start-1 md:col-span-1"></div>

            {/* Step 2 */}
            <div className="md:col-start-2 flex flex-col items-center md:items-start">
              <div className="relative z-10 bg-background p-2 rounded-full mb-4">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <Card className="w-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <CreditCard className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold">Make a Payment</h3>
                    <p className="text-muted-foreground text-center md:text-left">
                      Deposit funds to your account using our secure payment methods. We support UPI, QR code payments,
                      and cryptocurrency.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-start-2 md:col-span-1"></div>

            {/* Step 3 */}
            <div className="md:col-start-1 flex flex-col items-center md:items-end">
              <div className="relative z-10 bg-background p-2 rounded-full mb-4">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <Card className="w-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <CheckCircle className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold">Get Results</h3>
                    <p className="text-muted-foreground text-center md:text-left">
                      Sit back and relax as we deliver your order. Track the progress in real-time from your dashboard
                      and receive notifications when it's completed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
