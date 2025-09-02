import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword, verifyPassword } from "./auth";
import { 
  insertTransactionSchema, 
  insertBudgetSchema, 
  insertFinancialGoalSchema,
  insertCategorySchema,
  insertChatMessageSchema
} from "@shared/schema";
import { z } from "zod";

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  firstName: z.string().min(1, "Ad alanı zorunludur"),
  lastName: z.string().min(1, "Soyad alanı zorunludur")
});

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Şifre gereklidir")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanımda" });
      }
      
      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName
      });
      
      // Create session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Register error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Kayıt işlemi başarısız" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
      }
      
      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
      }
      
      // Create session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Giriş işlemi başarısız" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Çıkış işlemi başarısız" });
      }
      res.json({ message: "Başarıyla çıkış yapıldı" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Categories routes
  app.get('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const categories = await storage.getCategories(userId);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const categoryData = insertCategorySchema.parse({ ...req.body, userId });
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.get('/api/categories/default', async (req, res) => {
    try {
      const categories = await storage.getDefaultCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching default categories:", error);
      res.status(500).json({ message: "Failed to fetch default categories" });
    }
  });

  // Transactions routes
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactionData = insertTransactionSchema.parse({ 
        ...req.body, 
        userId,
        date: new Date(req.body.date || Date.now())
      });
      
      // AI categorization if no category provided
      if (!transactionData.categoryId && transactionData.description) {
        const categories = await storage.getCategories(userId);
        const suggestedCategory = await categorizeTransaction(transactionData.description, categories);
        if (suggestedCategory) {
          transactionData.categoryId = suggestedCategory.id;
          transactionData.source = 'ai';
        }
      }
      
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.get('/api/transactions/monthly-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
      
      const stats = await storage.getMonthlyStats(userId, year, month);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
      res.status(500).json({ message: "Failed to fetch monthly stats" });
    }
  });

  // Budgets routes
  app.get('/api/budgets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const budgets = await storage.getBudgets(userId);
      
      // Calculate spending for each budget
      const budgetsWithSpending = await Promise.all(
        budgets.map(async (budget) => {
          if (budget.categoryId) {
            const spending = await storage.getBudgetSpending(
              userId,
              budget.categoryId,
              budget.startDate,
              budget.endDate
            );
            return { ...budget, spent: spending };
          }
          return { ...budget, spent: 0 };
        })
      );
      
      res.json(budgetsWithSpending);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.post('/api/budgets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const budgetData = insertBudgetSchema.parse({ 
        ...req.body, 
        userId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      });
      const budget = await storage.createBudget(budgetData);
      res.json(budget);
    } catch (error) {
      console.error("Error creating budget:", error);
      res.status(500).json({ message: "Failed to create budget" });
    }
  });

  // Financial Goals routes
  app.get('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goals = await storage.getFinancialGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching financial goals:", error);
      res.status(500).json({ message: "Failed to fetch financial goals" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goalData = insertFinancialGoalSchema.parse({ 
        ...req.body, 
        userId,
        targetDate: new Date(req.body.targetDate)
      });
      const goal = await storage.createFinancialGoal(goalData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating financial goal:", error);
      res.status(500).json({ message: "Failed to create financial goal" });
    }
  });

  // AI Insights routes
  app.get('/api/insights', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const insights = await storage.getAiInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  // Chat routes
  app.get('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChatMessages(userId, limit);
      res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat/message', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { message } = req.body;
      
      // Save user message
      const userMessage = await storage.createChatMessage({
        userId,
        message,
        isFromUser: true,
      });
      
      // Generate AI response
      const aiResponse = await generateAIResponse(message, userId);
      
      // Save AI response
      const aiMessage = await storage.createChatMessage({
        userId,
        message: aiResponse,
        isFromUser: false,
      });
      
      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // OCR endpoint (mocked for MVP)
  app.post('/api/ocr/scan', isAuthenticated, async (req: any, res) => {
    try {
      // Mock OCR processing
      const mockResult = {
        amount: "245.80",
        description: "Market Alışverişi",
        merchant: "ABC Market",
        date: new Date().toISOString(),
        category: "Gıda & İçecek",
        confidence: 0.95
      };
      
      res.json(mockResult);
    } catch (error) {
      console.error("Error processing OCR:", error);
      res.status(500).json({ message: "Failed to process receipt" });
    }
  });

  // Voice input endpoint (mocked for MVP)
  app.post('/api/voice/process', isAuthenticated, async (req: any, res) => {
    try {
      // Mock voice processing
      const mockResult = {
        text: "Market alışverişi için iki yüz kırk beş lira ödedim",
        amount: "245.00",
        description: "Market alışverişi",
        type: "expense",
        confidence: 0.88
      };
      
      res.json(mockResult);
    } catch (error) {
      console.error("Error processing voice input:", error);
      res.status(500).json({ message: "Failed to process voice input" });
    }
  });

  // Initialize default categories for new users
  app.post('/api/init/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const defaultCategories = [
        { name: "Gıda & İçecek", icon: "fas fa-utensils", color: "#4CAF50" },
        { name: "Ulaşım", icon: "fas fa-car", color: "#FF9800" },
        { name: "Eğlence", icon: "fas fa-gamepad", color: "#F44336" },
        { name: "Faturalar", icon: "fas fa-file-invoice", color: "#2196F3" },
        { name: "Alışveriş", icon: "fas fa-shopping-bag", color: "#9C27B0" },
        { name: "Sağlık", icon: "fas fa-heart", color: "#E91E63" },
        { name: "Eğitim", icon: "fas fa-graduation-cap", color: "#00BCD4" },
        { name: "Ev", icon: "fas fa-home", color: "#795548" },
        { name: "Gelir", icon: "fas fa-wallet", color: "#4CAF50" },
        { name: "Diğer", icon: "fas fa-ellipsis-h", color: "#9E9E9E" },
      ];
      
      const categories = await Promise.all(
        defaultCategories.map(cat => 
          storage.createCategory({ ...cat, userId })
        )
      );
      
      res.json(categories);
    } catch (error) {
      console.error("Error initializing categories:", error);
      res.status(500).json({ message: "Failed to initialize categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// AI categorization helper function
async function categorizeTransaction(description: string, categories: any[]): Promise<any | null> {
  const descLower = description.toLowerCase();
  
  // Simple keyword-based categorization
  const categoryMapping = {
    'market': 'Gıda & İçecek',
    'super': 'Gıda & İçecek',
    'restaurant': 'Gıda & İçecek',
    'cafe': 'Gıda & İçecek',
    'benzin': 'Ulaşım',
    'yakıt': 'Ulaşım',
    'otobüs': 'Ulaşım',
    'metro': 'Ulaşım',
    'sinema': 'Eğlence',
    'film': 'Eğlence',
    'oyun': 'Eğlence',
    'elektrik': 'Faturalar',
    'su': 'Faturalar',
    'internet': 'Faturalar',
    'telefon': 'Faturalar',
  };
  
  for (const [keyword, categoryName] of Object.entries(categoryMapping)) {
    if (descLower.includes(keyword)) {
      return categories.find(cat => cat.name === categoryName);
    }
  }
  
  return null;
}

// AI response generator helper function
async function generateAIResponse(message: string, userId: string): Promise<string> {
  const messageLower = message.toLowerCase();
  
  // Simple rule-based responses for MVP
  if (messageLower.includes('harcama') || messageLower.includes('ne kadar')) {
    return "Bu ay toplam harcamanız ₺6,280. En yüksek harcama kategoriniz Gıda & İçecek (₺1,240). Bütçenizin %73'ünü kullandınız.";
  }
  
  if (messageLower.includes('tasarruf')) {
    return "Tasarruf durumunuz iyi görünüyor. Bu ay ₺2,220 tasarruf ettiniz. Hedeflediğiniz tasarruf oranına ulaşmak için aylık ₺300 daha az harcamanızı öneririm.";
  }
  
  if (messageLower.includes('bütçe')) {
    return "Bütçe yönetimi konusunda başarılısınız. Gelecek ay için mevcut harcama alışkanlıklarınıza göre ₺8,500 bütçe ayırmanızı öneriyorum.";
  }
  
  if (messageLower.includes('kategori')) {
    return "Harcama kategorileriniz arasında en yüksek pay Gıda & İçecek (%35), Ulaşım (%25), Eğlence (%20) şeklinde. Daha fazla tasarruf için ev yemekleri yapabilirsiniz.";
  }
  
  return "Size nasıl yardımcı olabilirim? Harcamalarınız, bütçeniz, tasarruf önerileriniz veya finansal hedefleriniz hakkında sorular sorabilirsiniz.";
}
