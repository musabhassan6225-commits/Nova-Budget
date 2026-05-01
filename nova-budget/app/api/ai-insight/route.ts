import { NextResponse } from "next/server";
import { generateMonthlyStrategy } from "@/lib/ai-agent";

export async function GET() {
  try {
    const insight = await generateMonthlyStrategy({
      totalIncome: 5240,
      totalExpenses: 2805,
      transactions: [
        { id: "1", user_id: "u1", amount: 1800, category: "Housing", description: "Rent", type: "expense", created_at: "" },
        { id: "2", user_id: "u1", amount: 420, category: "Food", description: "Groceries", type: "expense", created_at: "" },
        { id: "3", user_id: "u1", amount: 5240, category: "Salary", description: "Monthly salary", type: "income", created_at: "" },
      ],
      budgets: [
        { id: "b1", user_id: "u1", category: "Housing", limit_amount: 2000, spent_amount: 1800, period: "monthly" },
        { id: "b2", user_id: "u1", category: "Food", limit_amount: 500, spent_amount: 420, period: "monthly" },
        { id: "b3", user_id: "u1", category: "Shopping", limit_amount: 300, spent_amount: 310, period: "monthly" },
      ],
      goals: [
        { id: "g1", user_id: "u1", name: "Emergency Fund", target_amount: 10000, current_amount: 3200, deadline: "2025-12-31" },
        { id: "g2", user_id: "u1", name: "Vacation", target_amount: 3000, current_amount: 1100, deadline: "2025-08-01" },
      ],
    });
    return NextResponse.json(insight);
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
  }
}
