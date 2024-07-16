import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
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
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  role: z.enum(["admin", "user", "editor"]),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
  avatar: z.string().optional(),
  isVerified: z.boolean().optional(),
});

const UserEditForm = ({ user, setEditUser, mutate }) => {
  const [image, setImage] = useState(null);
  const [userEdit, setUserEdit] = useState(user);
  const { toast } = useToast();
  const [editProfilePicture, setEditProfilePicture] = useState(false);
  const [isShowPassWord, setIsShowPassWord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEdit.email || "",
      role: userEdit.role || "user",
      phoneNumber: userEdit.phoneNumber || "",
      firstName: userEdit.firstName || "",
      lastName: userEdit.lastName || "",
      password: userEdit.password || "",
      avatar: userEdit.avatar || "",
    },
  });

  useEffect(() => {
    form.reset({
      email: userEdit.email || "",
      role: userEdit.role || "user",
      phoneNumber: userEdit.phoneNumber || "",
      firstName: userEdit.firstName || "",
      lastName: userEdit.lastName || "",
      password: userEdit.password || "",
      avatar: userEdit.avatar || "",
    });
  }, [userEdit, form]);

  const onSubmit = async () => {
    const value = form.getValues();
    setIsLoading(true);
    try {
      let avatarUrl = value.avatar;

      if (avatarUrl && avatarUrl !== userEdit.avatar) {
        const uploadedImageUrl = await uploadImageToCloudinary(avatarUrl);
        if (uploadedImageUrl) {
          avatarUrl = uploadedImageUrl;
        }
      }

      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/${userEdit._id}`,
        {
          username: value.firstName + value.lastName,
          password: value.password,
          email: value.email,
          firstName: value.firstName,
          lastName: value.lastName,
          phoneNumber: value.phoneNumber,
          role: value.role,
          avatar: avatarUrl ? avatarUrl : "",
        }
      );
      toast({
        description: "Edit user successfully!",
      });
      mutate();
      setEditUser(null);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        form.setValue("avatar", reader.result);
        setUserEdit((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImageChange = () => {
    setImage(userEdit.avatar || null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserEdit((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {isLoading ? (
        <DialogContent className="sm:max-w-[800px] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full">
              <div className="flex justify-between">
                <div className="lg:w-2/3 w-full">
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
                            onChange={(e) => {
                              field.onChange(e);
                              handleChange(e);
                            }}
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
                          onValueChange={(value) =>
                            form.setValue("role", value)
                          }
                          value={field.value}>
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
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="phoneNumber">
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="phoneNumber"
                            placeholder="123-456-7890"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleChange(e);
                            }}
                          />
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
                          <FormLabel htmlFor="firstName">
                            First Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="firstName"
                              placeholder="John"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleChange(e);
                              }}
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
                              onChange={(e) => {
                                field.onChange(e);
                                handleChange(e);
                              }}
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
                          <div className="relative">
                            <Input
                              id="password"
                              type={isShowPassWord ? "text" : "password"}
                              placeholder="Enter password"
                              className="mb-5"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleChange(e);
                              }}
                            />
                            <div
                              onClick={() => setIsShowPassWord(!isShowPassWord)}
                              className="absolute cursor-pointer top-2 right-2">
                              {isShowPassWord ? <EyeOff /> : <Eye />}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem className="lg:hidden">
                        <FormLabel htmlFor="avatar">Profile Picture</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            id="avatar"
                            onChange={(e) => {
                              handleImageChange(e);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator
                  className="hidden lg:block w-[1px] mx-5 h-auto"
                  orientation="vertical"
                />
                <div className="hidden lg:flex lg:w-1/3">
                  <div className="flex flex-col items-center w-full gap-5">
                    <Label className="text-lg">Profile Picture</Label>
                    <div className="w-2/3 mb-4 bg-gray-200 overflow-hidden aspect-w-1 aspect-h-1 rounded-3xl">
                      <div className="w-full">
                        <img
                          src={
                            image
                              ? image
                              : userEdit.avatar
                              ? userEdit.avatar
                              : PlaceHolderImage
                          }
                          alt="Profile"
                          className="object-cover w-full h-auto"
                        />
                      </div>
                    </div>
                    <Dialog
                      open={editProfilePicture}
                      onOpenChange={setEditProfilePicture}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Change Image</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Change Profile Picture</DialogTitle>
                        <Input
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
              <DialogFooter className="justify-start">
                <Button onClick={() => onSubmit(userEdit)}>Confirm</Button>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </>
  );
};

export default UserEditForm;
