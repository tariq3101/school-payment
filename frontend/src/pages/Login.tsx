import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import API from "../api/axios.js"; // ⬅️ Axios instance

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",   // backend expects email, not username
    password: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // ✅ Save JWT token in localStorage
      localStorage.setItem("token", res.data.token);

      toast({
        title: "Login successful",
        description: "You are now logged in",
      });

      navigate("/transactions"); // redirect after login
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Login failed",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p><strong>Credentials:</strong></p>
                <p>Email: <code>admin@gmail.com</code></p>
                <p>Password: <code>admin</code></p>
              </div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          {/* Demo credentials info */}

        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
