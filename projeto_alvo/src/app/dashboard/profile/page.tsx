"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import React from "react";

const profileSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters." }).max(50),
  email: z.string().email(),
  // photoURL: z.string().url().optional(), // For actual implementation
});

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsSubmitting(true);
    // Simulate API call to update profile
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Profile update submitted:", values);
    // In a real app, update user context/state here
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    setIsSubmitting(false);
  }

  if (authLoading || !user) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-headline mb-6">Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading Profile...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <div className="bg-muted rounded-full h-full w-full animate-pulse"></div>
              </Avatar>
              <div className="space-y-2">
                 <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
                 <div className="h-4 w-60 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
             <div className="h-10 w-full bg-muted rounded animate-pulse mt-4"></div>
             <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-headline mb-8 text-foreground">User Profile</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="shadow-lg">
            <CardHeader className="items-center text-center">
              <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20 shadow-md">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} data-ai-hint="profile picture" />
                <AvatarFallback className="text-4xl">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="mr-2 h-4 w-4" /> Change Photo
              </Button>
              <CardTitle className="text-2xl font-headline mt-4">{user.displayName || 'User Name'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for future quick info or actions */}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Account Information</CardTitle>
              <CardDescription>Manage your account details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} disabled type="email" />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground pt-1">Email cannot be changed.</p>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle  className="text-xl font-headline">Subscription Details</CardTitle>
              <CardDescription>Manage your LexAI subscription plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm"><span className="font-medium text-foreground">Current Plan:</span> Pro (Mock Data)</p>
              <p className="text-sm"><span className="font-medium text-foreground">Renews on:</span> January 1, 2025 (Mock Data)</p>
              <Button variant="outline">Manage Subscription</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
