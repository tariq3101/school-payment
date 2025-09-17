import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, CreditCard, AlertCircle } from "lucide-react";

// Mock data for schools and their transactions
const schools = [
  { id: "SCH001", name: "Delhi Public School" },
  { id: "SCH002", name: "Ryan International School" },
  { id: "SCH003", name: "St. Mary's School" },
  { id: "SCH004", name: "Modern School" },
];

const mockSchoolTransactions = {
  SCH001: [
    {
      collect_id: "TXN001",
      gateway: "Razorpay",
      order_amount: 2500,
      transaction_amount: 2500,
      status: "Success",
      custom_order_id: "ORD_2024_001",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      collect_id: "TXN003",
      gateway: "Razorpay",
      order_amount: 3200,
      transaction_amount: 0,
      status: "Failed",
      custom_order_id: "ORD_2024_003",
      created_at: "2024-01-15T12:00:00Z",
    },
  ],
  SCH002: [
    {
      collect_id: "TXN002",
      gateway: "PayU",
      order_amount: 1800,
      transaction_amount: 1800,
      status: "Pending",
      custom_order_id: "ORD_2024_002",
      created_at: "2024-01-15T11:15:00Z",
    },
  ],
  SCH003: [
    {
      collect_id: "TXN004",
      gateway: "PayU",
      order_amount: 900,
      transaction_amount: 900,
      status: "Success",
      custom_order_id: "ORD_2024_004",
      created_at: "2024-01-15T14:20:00Z",
    },
  ],
};

const SchoolTransactions = () => {
  const [selectedSchool, setSelectedSchool] = useState<string>("");

  const selectedSchoolData = schools.find(school => school.id === selectedSchool);
  const transactions = selectedSchool ? mockSchoolTransactions[selectedSchool as keyof typeof mockSchoolTransactions] || [] : [];

  const getStatusBadge = (status: string) => {
    const variants = {
      Success: "bg-success-light text-success",
      Pending: "bg-warning-light text-warning",
      Failed: "bg-destructive-light text-destructive",
    };
    return variants[status as keyof typeof variants] || "bg-muted text-muted-foreground";
  };

  const calculateStats = () => {
    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(t => t.status === "Success").length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
    const failedTransactions = transactions.filter(t => t.status === "Failed").length;

    return {
      total: totalTransactions,
      successful: successfulTransactions,
      amount: totalAmount,
      failed: failedTransactions,
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">School Transactions</h1>
        <p className="text-muted-foreground">
          View transactions for a specific school
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select School</CardTitle>
          <CardDescription>
            Choose a school to view its transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select a school..." />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSchool && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Successful
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{stats.successful}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₹{stats.amount.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Failed
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedSchoolData?.name} Transactions</CardTitle>
              <CardDescription>
                Transaction history for {selectedSchoolData?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Collect ID</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Gateway</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Transaction Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Custom Order ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.collect_id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 text-foreground font-medium">{transaction.collect_id}</td>
                          <td className="py-3 px-4 text-foreground">{transaction.gateway}</td>
                          <td className="py-3 px-4 text-foreground">₹{transaction.order_amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-foreground">₹{transaction.transaction_amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadge(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{transaction.custom_order_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
                  <p className="text-muted-foreground">This school has no transaction history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SchoolTransactions;