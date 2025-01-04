import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast.js";

const AdminReview = () => {
  const [contributions, setContributions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchContributions = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/training-data/unverified`
      );
      const data = await response.json();
      setContributions(data || []); // The response is already an array
    } catch (error) {
      console.error("Error fetching contributions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch contributions",
      });
    }
  };

  useEffect(() => {
    // Only fetch if user is logged in
    if (user) {
      fetchContributions();
    }
  }, [user]);

  // Redirect if not logged in or not admin
  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleReviewAction = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/training-data/verify/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            is_verified: true,
            admin_id: user.id,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `Contribution ${status} successfully`,
        });
        fetchContributions();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update contribution status",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating contribution status",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-8">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Review Contributions</h2>
        </div>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Banglish Text</TableHead>
                  <TableHead>Proposed Bangla Text</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell>{contribution.id}</TableCell>
                    <TableCell>{contribution.banglish_text}</TableCell>
                    <TableCell>{contribution.proposed_bangla_text}</TableCell>
                    <TableCell>
                      {new Date(contribution.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          handleReviewAction(contribution.id, "approved")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleReviewAction(contribution.id, "rejected")
                        }
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <select
              className="rounded-md border"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReview;
