import {
  users,
  categories,
  transactions,
  budgets,
  financialGoals,
  aiInsights,
  chatMessages,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Transaction,
  type InsertTransaction,
  type Budget,
  type InsertBudget,
  type FinancialGoal,
  type InsertFinancialGoal,
  type AiInsight,
  type InsertAiInsight,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql, sum } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(userId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  getDefaultCategories(): Promise<Category[]>;
  
  // Transaction operations
  getTransactions(userId: string, limit?: number): Promise<(Transaction & { category?: Category })[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<(Transaction & { category?: Category })[]>;
  getMonthlyStats(userId: string, year: number, month: number): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  }>;
  
  // Budget operations
  getBudgets(userId: string): Promise<(Budget & { category?: Category })[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget>;
  getBudgetSpending(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<number>;
  
  // Financial goals operations
  getFinancialGoals(userId: string): Promise<FinancialGoal[]>;
  createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
  updateFinancialGoal(id: string, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal>;
  
  // AI Insights operations
  getAiInsights(userId: string): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  markInsightAsRead(id: string): Promise<void>;
  
  // Chat operations
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(userId: string): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getDefaultCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isDefault, true))
      .orderBy(categories.name);
  }

  // Transaction operations
  async getTransactions(userId: string, limit: number = 50): Promise<(Transaction & { category?: Category })[]> {
    return await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        amount: transactions.amount,
        type: transactions.type,
        description: transactions.description,
        categoryId: transactions.categoryId,
        date: transactions.date,
        source: transactions.source,
        isRecurring: transactions.isRecurring,
        recurringPeriod: transactions.recurringPeriod,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        category: categories,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<(Transaction & { category?: Category })[]> {
    return await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        amount: transactions.amount,
        type: transactions.type,
        description: transactions.description,
        categoryId: transactions.categoryId,
        date: transactions.date,
        source: transactions.source,
        isRecurring: transactions.isRecurring,
        recurringPeriod: transactions.recurringPeriod,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        category: categories,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date));
  }

  async getMonthlyStats(userId: string, year: number, month: number): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [incomeResult] = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, 'income'),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      );

    const [expenseResult] = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, 'expense'),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      );

    const totalIncome = Number(incomeResult?.total || 0);
    const totalExpenses = Number(expenseResult?.total || 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  }

  // Budget operations
  async getBudgets(userId: string): Promise<(Budget & { category?: Category })[]> {
    return await db
      .select({
        id: budgets.id,
        userId: budgets.userId,
        categoryId: budgets.categoryId,
        amount: budgets.amount,
        period: budgets.period,
        startDate: budgets.startDate,
        endDate: budgets.endDate,
        isActive: budgets.isActive,
        createdAt: budgets.createdAt,
        updatedAt: budgets.updatedAt,
        category: categories,
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .where(and(eq(budgets.userId, userId), eq(budgets.isActive, true)))
      .orderBy(categories.name);
  }

  async createBudget(budget: InsertBudget): Promise<Budget> {
    const [newBudget] = await db
      .insert(budgets)
      .values(budget)
      .returning();
    return newBudget;
  }

  async updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget> {
    const [updatedBudget] = await db
      .update(budgets)
      .set({ ...budget, updatedAt: new Date() })
      .where(eq(budgets.id, id))
      .returning();
    return updatedBudget;
  }

  async getBudgetSpending(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<number> {
    const [result] = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.categoryId, categoryId),
          eq(transactions.type, 'expense'),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      );

    return Number(result?.total || 0);
  }

  // Financial goals operations
  async getFinancialGoals(userId: string): Promise<FinancialGoal[]> {
    return await db
      .select()
      .from(financialGoals)
      .where(eq(financialGoals.userId, userId))
      .orderBy(financialGoals.targetDate);
  }

  async createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal> {
    const [newGoal] = await db
      .insert(financialGoals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async updateFinancialGoal(id: string, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal> {
    const [updatedGoal] = await db
      .update(financialGoals)
      .set({ ...goal, updatedAt: new Date() })
      .where(eq(financialGoals.id, id))
      .returning();
    return updatedGoal;
  }

  // AI Insights operations
  async getAiInsights(userId: string): Promise<AiInsight[]> {
    return await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.userId, userId))
      .orderBy(desc(aiInsights.createdAt));
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const [newInsight] = await db
      .insert(aiInsights)
      .values(insight)
      .returning();
    return newInsight;
  }

  async markInsightAsRead(id: string): Promise<void> {
    await db
      .update(aiInsights)
      .set({ isRead: true })
      .where(eq(aiInsights.id, id));
  }

  // Chat operations
  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
