"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Bot, User, Send, Loader2 } from "lucide-react";
import { askAssistantAction } from "@/app/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const result = await askAssistantAction({ query: input, history: messages });
    
    if (result.data) {
      const modelMessage: Message = { role: 'model', content: result.data };
      setMessages(prev => [...prev, modelMessage]);
    } else {
      const errorMessage: Message = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? 'translate-x-[200%]' : 'translate-x-0')}>
        <Button onClick={toggleChat} size="icon" className="rounded-full w-14 h-14 shadow-lg">
            <MessageSquare className="w-6 h-6" />
        </Button>
      </div>

      <div className={cn("fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out", 
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
      )}>
        <Card className="w-[380px] h-[500px] flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="w-5 h-5"/>
                AI Research Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
                <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                 <div className="space-y-4 pr-4">
                {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'model' && <AvatarFor role="model" />}
                         <div className={cn("p-3 rounded-lg max-w-[80%]", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <p className="text-sm">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && <AvatarFor role="user" />}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <AvatarFor role="model" />
                        <div className="p-3 rounded-lg bg-muted">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                <Input 
                    placeholder="Ask about a species..." 
                    value={input}
                    onChange={handleInputChange}
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                   {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

function AvatarFor({role}: {role: 'user' | 'model'}) {
    return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-card border shrink-0">
            {role === 'user' ? <User className="w-4 h-4"/> : <Bot className="w-4 h-4 text-primary" />}
        </div>
    )
}
