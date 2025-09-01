import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { Send, Bot, User } from 'lucide-react';
import { QUICK_CHAT_QUESTIONS } from '@/lib/constants';
import type { ChatMessage } from '@shared/schema';

export default function AIAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const { data: chatMessages = [], isLoading } = useQuery({
    queryKey: ['/api/chat/messages', { limit: 10 }],
    retry: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      return apiRequest('POST', '/api/chat/message', { message: messageText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      setMessage('');
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
      toast({
        title: "Hata",
        description: "Mesaj gönderilemedi.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <section data-testid="ai-assistant">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary" size={20} />
            Akıllı Finansal Asistan
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Finansal sorularınızı sorun, size özel önerileri keşfedin
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <ScrollArea className="h-64 border rounded-lg p-4" data-testid="chat-messages">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Merhaba! Finansal durumunuz hakkında sorularınızı yanıtlayabilirim. 
                    Ne öğrenmek istiyorsunuz?
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((chat: ChatMessage) => (
                  <div key={chat.id} className={`flex items-start space-x-3 ${
                    chat.isFromUser ? 'justify-end' : ''
                  }`} data-testid={`chat-message-${chat.id}`}>
                    {!chat.isFromUser && (
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot size={12} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`rounded-lg p-3 max-w-xs ${
                      chat.isFromUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{chat.message}</p>
                    </div>

                    {chat.isFromUser && (
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Chat Input */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Finansal sorularınızı sorun..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={sendMessageMutation.isPending}
                data-testid="input-chat-message"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                data-testid="button-send-message"
              >
                <Send size={16} />
              </Button>
            </div>
            
            {/* Quick Questions */}
            <div className="flex flex-wrap gap-2">
              {QUICK_CHAT_QUESTIONS.slice(0, 2).map((question, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs h-6 px-2"
                  data-testid={`button-quick-question-${index}`}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
