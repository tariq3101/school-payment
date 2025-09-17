import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import API from "@/api/axios";

const StatusCheck = () => {
  const [orderId, setOrderId] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!orderId.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/payments/status/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setSearchResult(res.data);
    } catch (err: any) {
      console.error("Error checking status:", err);
      setError(err.response?.data?.error || "Something went wrong");
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "FAILED":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    const variants = {
      SUCCESS: "bg-success-light text-success",
      PENDING: "bg-warning-light text-warning",
      FAILED: "bg-destructive-light text-destructive",
    };
    return variants[status as keyof typeof variants] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transaction Status Check</h1>
        <p className="text-muted-foreground">
          Check the current status of any transaction using the order ID
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check Transaction Status</CardTitle>
          <CardDescription>
            Enter the order ID to get the latest transaction status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!orderId.trim() || isSearching}
              className="bg-primary hover:bg-primary-hover"
            >
              {isSearching ? (
                "Searching..."
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Check Status
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8 text-red-600">
                <XCircle className="w-12 h-12 mx-auto mb-4" />
                <p>{error}</p>
              </div>
            ) : searchResult ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {getStatusIcon(searchResult.status)}
                  <h3 className="text-xl font-semibold text-foreground">
                    Transaction Status:{" "}
                    <Badge className={`ml-2 ${getStatusBadge(searchResult.status)}`}>
                      {searchResult.status || "Unknown"}
                    </Badge>
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Transaction Details</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Custom Order ID:</dt>
                        <dd className="text-foreground">{orderId || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Payment Mode:</dt>
                        <dd className="text-foreground">{searchResult.details?.payment_mode || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Bank Reference:</dt>
                        <dd className="text-foreground">{searchResult.details?.bank_ref || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Card Network:</dt>
                        <dd className="text-foreground">{searchResult.details?.payment_methods?.card?.card_network || "N/A"}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Payment Information</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Amount:</dt>
                        <dd className="text-foreground font-semibold">
                          ₹{searchResult.amount?.toLocaleString() || "N/A"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Transaction Amount:</dt>
                        <dd className="text-foreground font-semibold">
                          ₹{searchResult.transaction_amount?.toLocaleString() || "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Transaction Found</h3>
                <p className="text-muted-foreground">
                  No transaction found with order ID: <span className="font-mono">{orderId}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatusCheck;
