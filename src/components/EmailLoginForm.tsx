
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6个字符"),
});

const EmailLoginForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("登录成功!");
    onClose();
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">邮箱登录</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input placeholder="请输入邮箱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="请输入密码" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-[#fe2c55] hover:bg-[#fe2c55]/90">
            登录
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">其他登录方式</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Button variant="outline" size="icon">
            微信
          </Button>
          <Button variant="outline" size="icon">
            QQ
          </Button>
          <Button variant="outline" size="icon">
            微博
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailLoginForm;
