import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PlaceHolderImage from "../../../../../assets/image/placeholdler_image.svg";

const UserEditForm = ({ user, formSchema }) => {
  const [image, setImage] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email || "",
      role: user.role || "user",
      phone: user.phoneNumber || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      password: "",
      confirmPassword: "",
      avatar: user.avatar || "",
    },
  });

  useEffect(() => {
    console.log(user);
    form.reset({
      email: user.email || "",
      role: user.role || "user",
      phone: user.phoneNumber || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      password: user.password || "",
      confirmPassword: user.password || "",
      avatar: user.avatar || "",
    });
  }, [user, form]);

  const onSubmit = async (value) => {
    try {
      let avatarUrl = value.avatar;

      if (avatarUrl && avatarUrl !== user.avatar) {
        const uploadedImageUrl = await uploadImageToCloudinary(avatarUrl);
        if (uploadedImageUrl) {
          avatarUrl = uploadedImageUrl;
        }
      }

      await axios.put(`/server/api/users/${user.id}`, {
        username: value.firstName + value.lastName,
        password: value.password,
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
        phoneNumber: value.phone,
        role: value.role,
        avatar: avatarUrl ? avatarUrl : "",
      });
      alert("Success");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImageChange = () => {
    setImage(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between">
          <div className="w-2/3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      placeholder="example@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="role">Role *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">Phone Number *</FormLabel>
                  <FormControl>
                    <Input id="phone" placeholder="123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <div className="w-1/2">
                    <FormLabel htmlFor="firstName">First Name *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="firstName"
                        placeholder="John"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <div className="w-1/2">
                    <FormLabel htmlFor="lastName">Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="lastName"
                        placeholder="Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password *</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      className="mb-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password *
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/3">
            <div className="flex flex-col items-center w-full gap-5">
              <Label className="text-lg">Profile Picture</Label>
              <div className="w-2/3 mb-4 bg-gray-200 overflow-hidden aspect-w-1 aspect-h-1 rounded-3xl">
                <div className="w-full">
                  <img
                    src={
                      image
                        ? image
                        : user.avatar
                        ? user.avatar
                        : PlaceHolderImage
                    }
                    alt="Profile"
                    className="object-cover w-full h-auto"
                  />
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Image</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Change Profile Picture</DialogTitle>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="flex justify-end mt-4 space-x-2">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onClick={handleCancelImageChange}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="primary">Done</Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="submit">Confirm</Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserEditForm;
