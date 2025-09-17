import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import API from "@/api/axios";

interface Transaction {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  custom_order_id: string;
  payment_time?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gatewayFilter, setGatewayFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Sorting state
  const [sortField, setSortField] = useState("payment_time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // ✅ Fetch data from backend with pagination and sorting
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortField,
        order: sortOrder,
      });

      // Add filters to params if they're not "all"
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (gatewayFilter !== "all") {
        params.append("gateway", gatewayFilter);
      }
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      const res = await API.get(`/transactions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data, pagination: paginationData } = res.data;
      
      setTransactions(data || []);
      setPagination(prev => ({
        ...prev,
        ...paginationData,
      }));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.limit, sortField, sortOrder, statusFilter, gatewayFilter]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchTransactions();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // ✅ Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // ✅ Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: string) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: parseInt(newLimit), 
      page: 1 
    }));
  };

  // ✅ Handle filter changes
  const handleFilterChange = (filterType: "status" | "gateway", value: string) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else {
      setGatewayFilter(value);
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // ✅ Badge styling
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      SUCCESS: "bg-success-light text-success",
      PENDING: "bg-warning-light text-warning",
      FAILED: "bg-destructive-light text-destructive",
    };
    return (
      variants[status.toUpperCase()] || "bg-muted text-muted-foreground"
    );
  };

  // ✅ Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortOrder === "asc" ? "rotate-180" : ""} transition-transform`} 
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            All Transactions
          </h1>
          <p className="text-muted-foreground">
            Comprehensive view of all payment transactions ({pagination.total} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
          <CardDescription>
            Search and filter transactions by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by Order ID, Collect ID, or School ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gatewayFilter} onValueChange={(value) => handleFilterChange("gateway", value)}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateways</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="payu">PayU</SelectItem>
                <SelectItem value="edviron">Edviron</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-full sm:w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transactions ({transactions.length} of {pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading transactions...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Collect ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        School ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Gateway
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        <button
                          onClick={() => handleSort("order_amount")}
                          className="flex items-center gap-2 hover:text-foreground transition-colors"
                        >
                          Order Amount
                          {getSortIcon("order_amount")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        <button
                          onClick={() => handleSort("transaction_amount")}
                          className="flex items-center gap-2 hover:text-foreground transition-colors"
                        >
                          Transaction Amount
                          {getSortIcon("transaction_amount")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        <button
                          onClick={() => handleSort("payment_time")}
                          className="flex items-center gap-2 hover:text-foreground transition-colors"
                        >
                          Payment Time
                          {getSortIcon("payment_time")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Custom Order ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.custom_order_id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-3 px-4 text-foreground font-medium">
                          {transaction.collect_id}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {transaction.school_id}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {transaction.gateway}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          ₹{transaction.order_amount?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          ₹{transaction.transaction_amount?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {transaction.payment_time 
                            ? new Date(transaction.payment_time).toLocaleString()
                            : "-"
                          }
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {transaction.custom_order_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} results
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNumber = Math.max(1, pagination.page - 2) + i;
                      if (pageNumber > pagination.totalPages) return null;
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {transactions.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No transactions found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;