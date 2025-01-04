import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast.js";
import { useAuth } from "../contexts/AuthContext";

const ContributePage = () => {
  const [banglishText, setBanglishText] = useState("");
  const [banglaText, setBanglaText] = useState("");
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/training-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          banglish_text: banglishText,
          proposed_bangla_text: banglaText,
          // contributor_id: currentUser.id,
          // status: "pending",
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contribution submitted successfully!",
        });
        setBanglishText("");
        setBanglaText("");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit contribution",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error submitting contribution",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Contribute to Dataset</h2>
          <p className="text-muted-foreground">
            Help improve our dataset by contributing Banglish-Bangla text pairs.
          </p>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="banglish" className="text-sm font-medium">
                Banglish Text
              </label>
              <Textarea
                id="banglish"
                placeholder="Enter Banglish text..."
                value={banglishText}
                onChange={(e) => setBanglishText(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bangla" className="text-sm font-medium">
                Bangla Text
              </label>
              <Textarea
                id="bangla"
                placeholder="Enter Bangla text..."
                value={banglaText}
                onChange={(e) => setBanglaText(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Contribution
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributePage;
