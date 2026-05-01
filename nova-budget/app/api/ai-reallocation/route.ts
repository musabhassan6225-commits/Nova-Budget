import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type BudgetInput = { category: string; spent: number; limit: number };

export async function POST(req: NextRequest) {
  const { budgets }: { budgets: BudgetInput[] } = await req.json();

  const over = budgets.filter((b) => b.spent > b.limit);
  const under = budgets.filter((b) => b.limit - b.spent > 50);

  if (!over.length) {
    return NextResponse.json({ hints: [{ from: "—", to: "—", amount: 0, reason: "All budgets are within limits. Great job!" }] });
  }

  const prompt = `You are AuraFinance AI. A user has over-budget categories and under-budget categories this month.

Over budget:
${over.map((b) => `- ${b.category}: spent $${b.spent}, limit $${b.limit} (over by $${b.spent - b.limit})`).join("\n")}

Under budget (available headroom):
${under.map((b) => `- ${b.category}: spent $${b.spent}, limit $${b.limit} (headroom $${b.limit - b.spent})`).join("\n")}

Suggest up to 3 reallocation moves. Return ONLY valid JSON:
{
  "hints": [
    { "from": "category name", "to": "category name", "amount": 150, "reason": "one sentence explanation" }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
  }
}
