import Anthropic from "@anthropic-ai/sdk";
import type { Transaction, Budget, SavingsGoal } from "./supabase";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type FinancialContext = {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  totalIncome: number;
  totalExpenses: number;
};

export type AIInsight = {
  summary: string;
  topRisk: string;
  topOpportunity: string;
  actionItems: string[];
  savingsRate: string;
};

export async function generateMonthlyStrategy(ctx: FinancialContext): Promise<AIInsight> {
  const prompt = `You are AuraFinance AI, a premium financial advisor. Analyze this user's financial data and return a JSON object.

Financial Summary:
- Total Income: $${ctx.totalIncome}
- Total Expenses: $${ctx.totalExpenses}
- Net: $${ctx.totalIncome - ctx.totalExpenses}

Top Transactions (last 10):
${ctx.transactions
  .slice(0, 10)
  .map((t) => `- ${t.category}: $${t.amount} (${t.type}) — ${t.description}`)
  .join("\n")}

Budget Status:
${ctx.budgets.map((b) => `- ${b.category}: $${b.spent_amount}/$${b.limit_amount} spent`).join("\n")}

Savings Goals:
${ctx.goals.map((g) => `- ${g.name}: $${g.current_amount}/$${g.target_amount}`).join("\n")}

Return ONLY valid JSON matching this shape:
{
  "summary": "2-sentence overview",
  "topRisk": "single biggest financial risk",
  "topOpportunity": "single best opportunity to improve",
  "actionItems": ["action 1", "action 2", "action 3"],
  "savingsRate": "X%"
}`;

  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";
  return JSON.parse(text) as AIInsight;
}
