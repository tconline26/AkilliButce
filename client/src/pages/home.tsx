import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import FinancialOverview from '@/components/Dashboard/FinancialOverview';
import QuickActions from '@/components/Dashboard/QuickActions';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import BudgetOverview from '@/components/Dashboard/BudgetOverview';
import AnalyticsSection from '@/components/Dashboard/AnalyticsSection';
import FinancialGoals from '@/components/Dashboard/FinancialGoals';
import AIAssistant from '@/components/Dashboard/AIAssistant';
import InsightsRecommendations from '@/components/Dashboard/InsightsRecommendations';
import { apiRequest } from '@/lib/queryClient';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Initialize default categories for new users
  const initCategoriesMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/init/categories');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error('Failed to initialize categories:', error);
    },
  });

  // Check if user has categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    retry: false,
  });

  // Initialize categories if none exist
  useEffect(() => {
    if (categories && categories.length === 0) {
      initCategoriesMutation.mutate();
    }
  }, [categories]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-8" data-testid="home-dashboard">
      {/* Financial Overview */}
      <FinancialOverview />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Transactions & Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions />
        <BudgetOverview />
      </div>

      {/* Analytics Section */}
      <AnalyticsSection />

      {/* Financial Goals */}
      <FinancialGoals />

      {/* AI Assistant */}
      <AIAssistant />

      {/* Insights and Recommendations */}
      <InsightsRecommendations />
    </div>
  );
}
