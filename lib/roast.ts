const roastLines: Record<number, string[]> = {
  100: [
    "$100 a month? Your subscriptions have a subscription to your wallet.",
    "That’s a generous monthly donation to the autoplay button.",
    "Your budget called. It wants to discuss boundaries.",
  ],
  200: [
    "$200 monthly. You could stream your own financial thriller.",
    "Your subscriptions are networking. Your savings are not.",
    "At this point, your credit card deserves a day off.",
  ],
  300: [
    "$300 a month? Is every app in your phone on payroll?",
    "You’re not subscribed. You’re in a committed relationship with checkout.",
    "Your recurring charges have recurring charges.",
  ],
  400: [
    "$400 monthly. That’s a small vacation, if you stop paying for apps.",
    "You have enough subscriptions to start a support group.",
    "The only thing renewing faster than these is your regret.",
  ],
  500: [
    "Half a grand a month? Your bank app needs a comfort animal.",
    "You could hire a financial advisor—or cancel one streaming service.",
    "Your subscriptions are the main character. Your paycheck is the sidekick.",
  ],
  600: [
    "$600 monthly. Those apps better be doing your laundry.",
    "You’re funding the entire ‘skip intro’ economy.",
    "At this price, the subscriptions should be paying rent.",
  ],
  700: [
    "$700? Your wallet has entered its villain origin story.",
    "That’s a premium plan for having no money left.",
    "You have more recurring charges than recurring hobbies.",
  ],
  800: [
    "$800 monthly. Your subscriptions are basically dependents.",
    "The only thing getting unlimited access is your billing cycle.",
    "You could buy a very nice chair to sit in while cancelling these.",
  ],
  900: [
    "$900? Please tell us at least one of these subscriptions is therapy.",
    "Your budget spreadsheet just filed for early retirement.",
    "You’re one trial period away from a documentary.",
  ],
  1000: [
    "A thousand a month? Congratulations on your new streaming empire.",
    "Your card isn’t declining. It’s just trying to get your attention.",
    "At this point, you should be getting equity in these companies.",
  ],
};

export function getRoast(monthlyTotal: number): string {
  if (monthlyTotal < 100) {
    return "Under $100. Look at you, making responsible choices. Suspicious.";
  }

  const band = Math.min(1000, Math.floor(monthlyTotal / 100) * 100);
  const lines = roastLines[band] ?? roastLines[1000];

  return (
    lines[Math.floor(Math.random() * lines.length)] ??
    "Your subscriptions are doing just fine."
  );
}

export function monthlyCost(
  price: number,
  period: "monthly" | "yearly",
): number {
  return period === "yearly" ? price / 12 : price;
}
