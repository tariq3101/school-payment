import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import API from "@/api/axios";

interface StudentInfo {
  name: string;
  id: string;
  email: string;
}

interface Order {
  _id: string;
  school_id: string;
  trustee_id: string;
  student_info: StudentInfo;
  gateway_name: string;
}

const NewOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [formData, setFormData] = useState<Order>({
    _id: "",
    school_id: "",
    trustee_id: "",
    student_info: { name: "", id: "", email: "" },
    gateway_name: "",
  });

  const { toast } = useToast();

  // 👉 Fetch all orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to fetch orders",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 👉 Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("student_info.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        student_info: { ...prev.student_info, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 👉 Submit new order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.post("/orders", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Success",
        description: "Order created successfully!",
      });

      setFormData({
        _id: "",
        school_id: "",
        trustee_id: "",
        student_info: { name: "", id: "", email: "" },
        gateway_name: "",
      });
      setShowForm(false);
      fetchOrders();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to create order",
        variant: "destructive",
      });
    }
  };

  // 👉 Delete order
  const handleDelete = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Deleted",
        description: "Order deleted successfully",
      });

      fetchOrders();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  // 👉 Show amount input modal
  const handleCreatePaymentClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setPaymentAmount("");
    setShowAmountModal(true);
  };

  // 👉 Create payment with amount
  const handleCreatePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const order = orders.find((o) => o._id === selectedOrderId);

      if (!order) {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        });
        return;
      }

      const res = await API.post(
        "/payments/create-payment",
        {
          amount: parseFloat(paymentAmount),
          orderId: selectedOrderId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const paymentLink = res.data?.collect_request_url;

      toast({
        title: "Redirecting...",
        description: "Taking you to payment page",
      });

      setShowAmountModal(false);
      setSelectedOrderId("");
      setPaymentAmount("");

      if (paymentLink) {
        window.location.href = paymentLink;
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to create payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background text-black dark:text-white">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Orders</CardTitle>
            <CardDescription>Manage and view all orders</CardDescription>
          </div>
          <Button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close Form" : "New Order"}
          </Button>
        </CardHeader>

        <CardContent>
          {/* 👉 New Order Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 mb-8 p-4 rounded-lg 
                bg-white dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                text-black dark:text-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="school_id">School ID</Label>
                  <Input
                    id="school_id"
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="trustee_id">Trustee ID</Label>
                  <Input
                    id="trustee_id"
                    name="trustee_id"
                    value={formData.trustee_id}
                    onChange={handleChange}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="student_info.name">Student Name</Label>
                  <Input
                    id="student_info.name"
                    name="student_info.name"
                    value={formData.student_info.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="student_info.id">Student ID</Label>
                  <Input
                    id="student_info.id"
                    name="student_info.id"
                    value={formData.student_info.id}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="student_info.email">Student Email</Label>
                  <Input
                    id="student_info.email"
                    name="student_info.email"
                    type="email"
                    value={formData.student_info.email}
                    onChange={handleChange}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="gateway_name">Gateway Name</Label>
                  <Input
                    id="gateway_name"
                    name="gateway_name"
                    value={formData.gateway_name}
                    onChange={handleChange}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                  />
                </div>
              </div>
              <Button type="submit" className="mt-4">
                Submit Order
              </Button>
            </form>
          )}

          {/* 👉 Amount Input Modal */}
          {showAmountModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-black dark:text-white border border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">
                  Enter Payment Amount
                </h3>
                <div className="mb-4">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAmountModal(false);
                      setSelectedOrderId("");
                      setPaymentAmount("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePayment}>Create Payment</Button>
                </div>
              </div>
            </div>
          )}

          {/* 👉 Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-700 p-2">
                    School ID
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">
                    Trustee ID
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">
                    Student Name
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">
                    Student ID
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">
                    Student Email
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">
                    Gateway
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order._id}
                    className={`text-center ${
                      i % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                      {order.school_id}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                      {order.trustee_id}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                      {order.student_info?.name}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                      {order.student_info?.id}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                      {order.student_info?.email}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                      {order.gateway_name}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(order._id)}
                        >
                          Delete
                        </Button>

                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleCreatePaymentClick(order._id)}
                        >
                          Create Payment
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="border border-gray-300 dark:border-gray-700 p-2 text-center text-gray-500 dark:text-gray-400"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewOrders;
